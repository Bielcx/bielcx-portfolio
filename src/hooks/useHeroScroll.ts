import { useEffect, useRef } from 'react'

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Trecho do track em que o bloco do hero se despede: `start` é onde começa a
 * apagar e `length` quanto dura, os dois em fração do percurso preso.
 *
 * Os números não são gosto, são uma conta contra a ARESTA DA CORTINA — e a
 * conta é sobre onde ela está na TELA, não sobre quanto já se rolou.
 *
 * O track do hero tem 180svh e o `sticky` prende por 80svh, que é o percurso
 * deste progresso. O `Metodo` começa a 100svh do topo do track (`180 − 80` do
 * `-mt-[80svh]` dele): a aresta dele está no pé da tela quando a página abre e
 * sobe 1px por px rolado, então com `S` px rolados ela está a `tela − S` do
 * topo. O nome mora no meio da tela, ou seja a aresta o alcança em
 * `S ≈ 0,55 × tela` — com uma tela de 860px, por volta de 470px de rolagem,
 * que é 0,68 do percurso preso.
 *
 * Daí o par: **o fade termina em 0,68**, com a aresta chegando no nome, e
 * começa em 0,44 para ter uma boa distância de despedida. Antes terminava em
 * 0,56 — e o problema não era o corte, era o vazio: com a cena inteira
 * apagando junto, dos 385px (fim do fade) aos 860px (quando o `Metodo` prende
 * e mostra o conteúdo dele) a tela ficava PRETA, quase 500px de rolagem sem
 * nada em quadro. Hoje só o texto apaga; luzes, cabos e cards ficam acesos e
 * a cortina os cobre, que é o que uma cortina faz.
 *
 * Terminar mais tarde traz de volta o motivo de o fade existir: a aresta cruza
 * o nome ainda aceso e o corta na horizontal.
 *
 * **Mexeu no `-mt-[80svh]` do `Metodo` ou na altura de um dos dois tracks,
 * refaça a conta.** Os dois erros são silenciosos.
 */
const FADE = { start: 0.44, length: 0.24 }

/**
 * A CENA — luzes, fios e cards — sai DEPOIS do nome, em `--hs`.
 *
 * Ela já saiu junto (e abria meia tela de preto parado, porque a cortina
 * também é preta até prender) e já ficou acesa até o fim, que é o erro
 * oposto e o que se via por último: a cortina é uma chapa opaca subindo, e
 * passar por cima de quatro cards acesos os corta ao meio no ar. Com o nome
 * sumindo e o resto não, o que a tela mostra é meia hero sendo fatiada — lê
 * como defeito, não como transição.
 *
 * Saindo entre 0.62 e 0.98 do percurso preso, a cena apaga ENQUANTO a
 * cortina cobre: quando o fade termina, a aresta já está a um quinto do topo
 * da tela, então o que resta aceso é uma faixa fina, e não uma cena inteira
 * com uma linha reta atravessando.
 *
 * Os dois fades são um par com o `-mt-[80svh]` do `Metodo`: o do nome fecha
 * quando a aresta chega nas letras, o da cena fecha quando ela já cobriu o
 * grosso da tela. Mexeu num, confira os outros dois.
 */
const CENA = { start: 0.62, length: 0.36 }

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
 * **São DOIS fades, e é isso que evita os dois erros opostos.** O `--hw` leva
 * o bloco de texto quando a aresta da cortina chega nele; o `--hs` leva a cena
 * (luzes, fios e cards) depois, enquanto a cortina cobre. Apagando tudo junto
 * sobrava meia tela de preto parado — a cortina também é preta até prender;
 * não apagando a cena, ela era fatiada no ar por uma chapa opaca subindo. Ver
 * as contas no `FADE` e no `CENA` acima; os três números são um par com o
 * `-mt` do `Metodo`.
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
      track.style.setProperty('--hs', '1')
      return
    }

    let raf = 0
    let visible = true

    /**
     * MEDIDAS EM CACHE, e esta é a diferença entre rolar liso e rolar travado.
     *
     * Nada aqui muda enquanto se rola: o track é `180svh`, o elemento preso é
     * `100svh`, e `svh` não acompanha a barra do navegador. Mesmo assim isto
     * era lido a cada quadro — e o loop ESCREVE `--hw` logo depois. Escrita
     * invalida o estilo, então a leitura do quadro seguinte força um recálculo
     * de layout síncrono. Com três hooks fazendo o mesmo, dá até três layouts
     * forçados por quadro, numa página que ainda tem três canvas WebGL e um
     * plano 3D com dezenas de blocos.
     *
     * Medindo uma vez e refazendo só no `resize`, sobra por quadro a única
     * leitura que precisa ser fresca: a posição de rolagem.
     */
    let distance = 0
    let topoNoDocumento = 0
    const medir = () => {
      const preso = track.firstElementChild as HTMLElement | null
      // a "tela" é a altura do PRÓPRIO elemento preso, e não `window.innerHeight`:
      // no celular os dois são números diferentes, e o layout usa o primeiro
      distance = track.offsetHeight - (preso?.offsetHeight ?? window.innerHeight)
      // o topo do track em relação ao DOCUMENTO. O track não é sticky, então
      // este número é estável — e com ele o loop troca `getBoundingClientRect()`,
      // que força layout, por `scrollY`, que não força
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

      // Onde o track está agora, sem tocar no layout: `top` do
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
      window.removeEventListener('resize', medir)
      observador.disconnect()
    }
  }, [])

  return { trackRef, contentRef }
}
