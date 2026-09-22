import { useEffect, useRef } from 'react'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * A despedida do bloco de texto, em `--hw`: `start` é onde começa a apagar e
 * `length` quanto dura, os dois em fração de UMA TELA de rolagem.
 *
 * Os números não são mais uma conta contra a aresta de uma cortina — não há
 * cortina. O hero é uma seção comum de uma tela e sai de quadro rolando, como
 * qualquer página; o que este hook faz é dar a ele uma saída em vez de deixá-lo
 * ir embora reto. Com 0.06 a 0.40, o nome termina de apagar com o hero ainda
 * pela metade em quadro: quem rola vê o texto se despedir, e não sumir de uma
 * vez no meio do caminho.
 *
 * O limite superior é a chegada da seção 02, que encosta no pé da tela quando
 * uma tela inteira foi rolada (fração 1). Terminar perto disso traria de volta
 * o texto aceso encontrando a borda da outra seção, que é o que o efeito antigo
 * existia para evitar.
 */
const FADE = { start: 0.06, length: 0.34 }

/**
 * A CENA — luzes, fios e cards — sai DEPOIS do nome, em `--hs`.
 *
 * O escalonamento é o que restou de útil da versão com cortina, e a razão dele
 * mudou: antes era para a chapa opaca não fatiar quatro cards acesos; hoje é
 * profundidade. O texto vai primeiro e o fundo o segue, então a hero se desfaz
 * em duas camadas em vez de uma chapa só — é o que a referência do anime.js faz
 * na saída de cada bloco.
 *
 * Termina em 0.70, antes de a seção 02 encostar, para a troca não acontecer com
 * as duas coisas na tela ao mesmo tempo.
 */
const CENA = { start: 0.22, length: 0.48 }

/**
 * A saída do hero, publicada em `--hw` e `--hs` no próprio elemento.
 *
 * **O que este hook JÁ FOI, e por que encolheu.** Ele dirigia uma travessia
 * presa: o hero morava num track de 180svh com 100svh em `sticky`, e a seção 02
 * subia por cima como cortina opaca (uma margem negativa de 80svh). Três
 * números acoplados — altura do track, altura do preso e a margem de lá —, e
 * os dois fades eram uma conta contra a posição da aresta dessa cortina na
 * tela. Errar um errava os três, em silêncio.
 *
 * Isso saiu inteiro. A rolagem agora é a do documento, sem nada preso e sem
 * ninguém subindo por cima de ninguém: o hero tem uma tela de altura, a seção
 * 02 vem depois dele, e o que sobrou aqui é só a saída em duas camadas. A
 * referência é o site do anime.js, que não prende nenhuma seção — a rolagem é
 * nativa e quem anima é cada bloco, conforme entra e sai de quadro.
 *
 * Com isso os dois fades deixaram de ser uma conta contra outro elemento e
 * passaram a ser frações de uma tela de rolagem, que é a única medida de que
 * dependem. **Mexer neles não quebra mais nada fora deste arquivo.**
 *
 * Como todo efeito de scroll daqui, lê a posição a cada frame e funciona nos
 * dois sentidos. Com movimento reduzido no sistema nada apaga: quem pediu menos
 * animação prefere o bloco indo embora inteiro a ele piscando.
 */
export function useHeroScroll() {
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.setProperty('--hw', '1')
      track.style.setProperty('--hs', '1')
      return
    }

    let raf = 0
    let visible = true

    /**
     * MEDIDAS EM CACHE, e esta é a diferença entre rolar liso e rolar travado.
     *
     * Nada aqui muda enquanto se rola, e mesmo assim isto já foi lido a cada
     * quadro — com o loop ESCREVENDO `--hw` logo depois. Escrita invalida o
     * estilo, então a leitura do quadro seguinte força um recálculo de layout
     * síncrono. Com três hooks fazendo o mesmo, dá até três layouts forçados por
     * quadro, numa página que ainda tem três canvas WebGL e um plano 3D com
     * dezenas de blocos.
     *
     * Medindo uma vez e refazendo só no `resize`, sobra por quadro a única
     * leitura que precisa ser fresca: a posição de rolagem.
     */
    let distance = 0
    let topoNoDocumento = 0
    const medir = () => {
      // o percurso é a ALTURA DO PRÓPRIO HERO, e não `window.innerHeight`: no
      // celular os dois são números diferentes, e o layout usa o primeiro
      distance = track.offsetHeight
      // o topo do hero em relação ao DOCUMENTO. Com ele o loop troca
      // `getBoundingClientRect()`, que força layout, por `scrollY`, que não força
      topoNoDocumento = track.getBoundingClientRect().top + window.scrollY
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

      // Onde o hero está agora, sem tocar no layout: `top` do
      // `getBoundingClientRect` é o topo no documento menos o quanto já rolou.
      const top = topoNoDocumento - window.scrollY
      const progress = distance > 0 ? clamp(-top / distance, 0, 1) : 0

      const fade = 1 - clamp((progress - FADE.start) / FADE.length, 0, 1)
      track.style.setProperty('--hw', fade.toFixed(3))
      track.style.setProperty(
        '--hs',
        (1 - clamp((progress - CENA.start) / CENA.length, 0, 1)).toFixed(3),
      )

      // depois de sumir, para de interceptar cliques nos botões — há um trecho
      // em que o bloco já está invisível e o hero ainda ocupa a tela
      const content = contentRef.current
      if (content) content.style.pointerEvents = fade < 0.02 ? 'none' : ''

      raf = requestAnimationFrame(tick)
    }

    /** Com o hero fora da tela não há o que recalcular — e este loop lê o
     *  layout a cada frame. Ao voltar, o primeiro tick refaz tudo a partir da
     *  posição de scroll atual. */
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(tick)
      },
      { rootMargin: '120px' },
    )
    visibility.observe(track)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      visibility.disconnect()
      window.removeEventListener('resize', medir)
      observador.disconnect()
    }
  }, [])

  return { trackRef, contentRef }
}
