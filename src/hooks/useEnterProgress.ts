import { useEffect, useRef } from 'react'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Progresso de entrada de uma seção, publicado em `--enter` (0 → 1).
 *
 * Vale 0 enquanto o topo da seção ainda está na borda de baixo da janela e
 * chega a 1 depois que ela subiu `range` da altura da tela. Quem consome
 * decide o que fazer com o número — deslocar um bloco mais que o outro é o
 * que dá a sensação de profundidade, já que os dois andam em velocidades
 * diferentes enquanto a seção entra.
 *
 * Como todo efeito de scroll daqui, lê a posição a cada frame e funciona nos
 * dois sentidos: subir de volta desfaz o movimento, sem estado acumulado. Fora
 * da tela o loop para, e com movimento reduzido no sistema a seção já nasce
 * assentada.
 */
export function useEnterProgress(range = 0.6) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--enter', '1')
      return
    }

    let raf = 0
    let visible = true

    /**
     * Medidas em cache. A justificativa longa está no `useHeroScroll`: ler
     * layout a cada quadro logo DEPOIS de escrever estilo força um recálculo
     * síncrono, e com três hooks fazendo isso dá até três layouts forçados por
     * quadro. Nada medido aqui muda enquanto se rola — só em `resize`.
     */
    let viewport = 0
    let topoNoDocumento = 0
    const medir = () => {
      viewport = window.innerHeight
      topoNoDocumento = el.getBoundingClientRect().top + window.scrollY
    }
    medir()
    window.addEventListener('resize', medir)
    /* O `resize` não basta: a posição no documento também muda quando algo
       ACIMA deste elemento muda de tamanho — fonte que carrega tarde, imagem
       que chega. Sem isto o valor em cache ficaria velho e o efeito dispararia
       na posição errada, em silêncio. Observar o `body` cobre os dois casos e
       dispara raramente. */
    const observador = new ResizeObserver(medir)
    observador.observe(document.body)

    const tick = () => {
      if (!visible) {
        raf = 0
        return
      }

      const top = topoNoDocumento - window.scrollY
      const progress = clamp((viewport - top) / (viewport * range), 0, 1)
      el.style.setProperty('--enter', easeOutCubic(progress).toFixed(4))

      raf = requestAnimationFrame(tick)
    }

    /** Longe da tela não há o que calcular; o último valor escrito fica de pé. */
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(tick)
      },
      { rootMargin: '200px' },
    )
    visibility.observe(el)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      visibility.disconnect()
      window.removeEventListener('resize', medir)
      observador.disconnect()
    }
  }, [range])

  return ref
}
