import { useEffect, useRef } from 'react'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Trecho do track em que o bloco do hero se despede: `start` é onde começa a
 * apagar e `length` quanto dura, os dois em fração do percurso preso.
 *
 * Os números não são gosto, são uma conta contra a cortina — e a conta mudou
 * quando o fundo animado passou a apagar junto com o texto.
 *
 * O track do hero tem 180vh e o `sticky` prende por 80vh, que é o percurso
 * deste progresso. O `Metodo` começa a 100vh do topo do track (`180 − 80` do
 * `-mt-[80vh]` dele), ou seja a aresta dele já está no pé da tela quando a
 * página abre, e sobe 1vh a cada 1vh de rolagem: com `S` vh rolados ela está
 * a `100 − S` do topo, e o progresso vale `S / 80`.
 *
 * Terminando o fade em 0.56 (`0.30 + 0.26`), o texto acaba de sair com
 * S = 45vh, quando a cortina já está a 55vh do topo — subindo pela metade de
 * baixo da tela. **É isto que fecha o buraco preto:** antes o fade terminava
 * em 0.34 (S = 27vh) com a cortina ainda a 83vh, e como o fundo apaga junto,
 * sobrava meia tela de preto parado esperando.
 *
 * Atrasar mais traz de volta o problema oposto, que é o motivo de este fade
 * existir: a cortina cruza o nome ainda aceso e o corta ao meio.
 *
 * **Mexeu no `-mt-[80vh]` do `Metodo` ou na altura de um dos dois tracks,
 * refaça a conta.** Os dois erros são silenciosos.
 */
const FADE = { start: 0.3, length: 0.26 }

/**
 * A saída do hero, publicada em `--hw` (1 → 0) no track.
 *
 * **Por que existe:** a seção 02 sobe como cortina opaca por cima do hero
 * preso (ver o `-mt-[80vh]` no `Metodo.tsx`). Sem nada acontecendo do lado do
 * hero, essa cortina passa por cima de um bloco de texto aceso e o corta na
 * horizontal — e como os dois são pretos, o que se vê é só a costura de luz
 * do topo dela atravessando o nome. Lê como emenda de página, não como
 * transição. Com o fade, o bloco se despede antes de a aresta chegar nele.
 *
 * **O fundo apaga junto**, a pedido: quem lê `--hw` é o bloco de texto E o
 * canvas dos fios, no `Hero.tsx`. Já foi o contrário — o campo ficava aceso
 * justamente para o quadro não esvaziar —, e a troca abriu um intervalo de
 * preto parado que foi fechado adiantando a cortina e atrasando este fade.
 * Ver a conta no `FADE` acima; os dois números são um par com o `-mt` de lá.
 *
 * **O que este hook já foi:** a coreografia inteira do hero antigo — `--p`
 * para o card fechar as bordas com lerp, e DOIS tempos de fade (`--hc` para a
 * moldura, `--hw` para o nome sozinho no meio). O card não existe mais, e a
 * composição de hoje é um bloco só: nome e botões saem juntos, porque apagá-
 * los em tempos diferentes desmonta o bloco em vez de limpar a cena. Sobrou
 * uma variável.
 *
 * Como todo efeito de scroll daqui, lê a posição a cada frame e funciona nos
 * dois sentidos. Com movimento reduzido no sistema o bloco nunca apaga: quem
 * pediu menos animação prefere o texto cortado a ele piscando.
 */
export function useHeroScroll() {
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.setProperty('--hw', '1')
      return
    }

    let raf = 0
    let visible = true

    const tick = () => {
      if (!visible) {
        raf = 0
        return
      }

      // toda a vida presa do hero: fixo do topo do track até faltar uma tela
      // para o fim dele
      const distance = track.offsetHeight - window.innerHeight
      const progress =
        distance > 0 ? clamp(-track.getBoundingClientRect().top / distance, 0, 1) : 0

      const fade = 1 - clamp((progress - FADE.start) / FADE.length, 0, 1)
      track.style.setProperty('--hw', fade.toFixed(3))

      // depois de sumir, para de interceptar cliques nos botões — há um trecho
      // em que o bloco já está invisível e a cortina ainda não o cobriu
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
    }
  }, [])

  return { trackRef, contentRef }
}
