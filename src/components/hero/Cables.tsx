import { useEffect, useRef } from 'react'

/**
 * OS CABOS DA HERO — filamentos ondulando entre cada card e o nome.
 *
 * Eram tracejados (`stroke-dasharray`, o desenho do handoff) e viraram fio
 * ondulado a pedido: o hero antigo tinha um campo de fios WebGL atrás do nome
 * (o `WebThreads` do React Bits, portado em `threadsShaders.ts`) e a ideia foi
 * trazer AQUELA linha para cá.
 *
 * **O shader não serve, e a razão é geométrica, não de esforço.** Lá cada fio
 * é uma senóide em `uv` atravessando a tela inteira, num leque que aperta no
 * meio — ele desenha o caminho dele, não um caminho dado. Cabo daqui tem de
 * sair do canto de um card e chegar no nome, e isso é uma curva arbitrária.
 *
 * O que dá para levar é a LINGUAGEM do efeito, que é o que se vê: senóide
 * lenta, núcleo fino e halo largo sem nenhum blur — a queda é a própria
 * distância, em três traços empilhados. É o mesmo truque de camadas que a rede
 * de nós da seção 03 usava (`drop-shadow` num `<path>` recompõe a região e
 * deixa um retângulo mais escuro atrás da curva; medido, na época).
 *
 * **A onda é recalculada em JS, e não animada em CSS**, porque o que ondula é
 * a GEOMETRIA: não há propriedade animável que faça uma curva ondular sobre si
 * mesma (`d` só interpola entre formas do mesmo tamanho, e nem todo navegador
 * o anima). São quatro caminhos de 48 pontos por quadro — pouco mais do que o
 * que um keyframe de opacidade custa, e o loop para quando a hero sai da tela.
 *
 * A amplitude morre nas duas pontas (`sin(pi * t)`): é isso que mantém o fio
 * PLUGADO no canto do card e no nome, ondulando só no meio do caminho. Sem
 * isso ele se solta da ponta e a cena inteira perde o sentido — ver a nota
 * das âncoras no `Hero.tsx`.
 *
 * **ESTE LOOP TAMBÉM FAZ OS CARDS FLUTUAREM, e essa é a razão de ele existir
 * assim.** O flutuar já foi um `@keyframes` em CSS, e por isso o fio descolava:
 * a ponta dele nascia num ponto FIXO do desenho enquanto o card subia e descia
 * 10px por conta própria, em outro relógio — animação CSS começa quando o
 * elemento monta, o `requestAnimationFrame` daqui conta de outro zero, e os
 * dois se afastam. É o mesmo erro que a rede de nós da seção 03 já teve entre
 * SMIL e CSS, e a cura é a mesma: um relógio só.
 *
 * Agora o quadro calcula `boia` uma vez por card e usa o MESMO número nos dois
 * lugares — escreve no `transform` do card e soma na ponta do fio. Sincronia
 * por construção, não por dois números que se perseguem.
 *
 * Onde a ponta encosta é MEDIDO, não calculado: um `[data-plug]` de tamanho
 * zero mora no canto do card e é lido uma vez por resize, já com a rotação e a
 * folga embutidas. Refazer essa conta em trigonometria exigiria a altura do
 * card, que depende do texto — e texto muda.
 */

export const VB_W = 1240
export const VB_H = 700

type Ponto = readonly [number, number]

/**
 * Cada cabo, em pontos de controle de uma bézier cúbica — e não mais numa
 * string `d`. A curva é AMOSTRADA a cada quadro para receber a onda, então
 * ela precisa ser conta, não texto.
 *
 * A primeira ponta (`p0`) é onde o card se pendura; a última chega no nome.
 * As curvas são as do handoff, convertidas ponto a ponto.
 */
export const CABOS = [
  {
    id: 'automacao',
    p: [
      [268, 200],
      [420, 208],
      [470, 320],
      [600, 332],
    ] as Ponto[],
    cor: 'rgba(168,199,250,',
    alfa: 0.62,
    /** Fase inicial, para os quatro não ondularem em compasso. */
    fase: 0,
    pulso: 4,
    /** O canto do card que encosta nesta ponta. */
    canto: 'br',
    /** Inclinação do card, em graus, e o compasso do flutuar. */
    giro: -6,
    boia: 10,
    atraso: 0,
  },
  {
    id: 'rodando',
    p: [
      [300, 556],
      [430, 540],
      [470, 384],
      [600, 356],
    ] as Ponto[],
    cor: 'rgba(168,199,250,',
    alfa: 0.44,
    fase: 1.7,
    pulso: 4.6,
    canto: 'tr',
    giro: 5,
    boia: 12,
    atraso: 1.2,
  },
  {
    id: 'landing',
    p: [
      [962, 214],
      [820, 224],
      [782, 320],
      [645, 332],
    ] as Ponto[],
    cor: 'rgba(150,175,120,',
    alfa: 0.66,
    fase: 3.1,
    pulso: 4.2,
    canto: 'bl',
    giro: 7,
    boia: 9,
    atraso: 0.6,
  },
  {
    id: 'atendimento',
    p: [
      [948, 570],
      [826, 556],
      [788, 382],
      [645, 356],
    ] as Ponto[],
    cor: 'rgba(150,175,120,',
    alfa: 0.48,
    fase: 4.6,
    pulso: 5.2,
    canto: 'tl',
    giro: -5,
    boia: 11,
    atraso: 1.6,
  },
] as const

/** A ponta do cabo em % do palco — é onde o canto do card vai encostar. */
export const ancora = (id: string) => {
  const cabo = CABOS.find((c) => c.id === id)
  /* Sem cabo não há onde pendurar o card, e o `!` que estava aqui derrubava a
     PÁGINA INTEIRA em tela branca — foi o que aconteceu ao renomear um card na
     copy sem renomear o cabo. Centro é um lugar errado e visível; tela branca
     é um erro invisível até alguém abrir o console. */
  if (!cabo) return { left: '50%', top: '50%' }
  return { left: `${(cabo.p[0][0] / VB_W) * 100}%`, top: `${(cabo.p[0][1] / VB_H) * 100}%` }
}

/** Amostras por fio. 48 é onde a curva para de mostrar quina no zoom. */
const PONTOS = 48
/** Amplitude da onda, em unidades do viewBox, no meio do fio. */
const AMPLITUDE = 9
/** Ondas inteiras dentro de um fio. */
const ONDAS = 2.4
/** Velocidade da onda, em rad/s. Lenta: é respiração, não vibração. */
const VELOCIDADE = 1.15

/** As três camadas do fio: [multiplicador da espessura, opacidade]. */
const CAMADAS = [
  [4.2, 0.1],
  [2.1, 0.22],
  [1, 1],
] as const
const ESPESSURA = 1.3

const bezier = (p: Ponto[], t: number): Ponto => {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [
    a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
    a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1],
  ]
}

const tangente = (p: Ponto[], t: number): Ponto => {
  const u = 1 - t
  const a = 3 * u * u
  const b = 6 * u * t
  const c = 3 * t * t
  return [
    a * (p[1][0] - p[0][0]) + b * (p[2][0] - p[1][0]) + c * (p[3][0] - p[2][0]),
    a * (p[1][1] - p[0][1]) + b * (p[2][1] - p[1][1]) + c * (p[3][1] - p[2][1]),
  ]
}

/** Um ponto do fio ondulado no parâmetro `t` — a curva com a onda somada na
 *  perpendicular. O traço e a bolinha passam pela MESMA conta. */
const ponto = (p: Ponto[], t: number, fase: number, tempo: number, amplitude: number): Ponto => {
  const [x, y] = bezier(p, t)
  const [tx, ty] = tangente(p, t)
  const norma = Math.hypot(tx, ty) || 1
  // amplitude morre nas pontas: o fio fica preso no card e no nome
  const amp = amplitude * Math.sin(Math.PI * t)
  const onda = Math.sin(t * ONDAS * Math.PI * 2 + fase - tempo * VELOCIDADE) * amp
  return [x + (-ty / norma) * onda, y + (tx / norma) * onda]
}

/** O fio inteiro num instante. */
function tracar(p: Ponto[], fase: number, tempo: number, amplitude: number) {
  let d = ''
  for (let i = 0; i <= PONTOS; i++) {
    const [x, y] = ponto(p, i / PONTOS, fase, tempo, amplitude)
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return d
}

/** Quanto o card flutuou neste instante, em px. Zero no começo do ciclo. */
const boiar = (cabo: (typeof CABOS)[number], tempo: number) =>
  (-cabo.boia / 2) * (1 - Math.cos(((tempo + cabo.atraso) / cabo.pulso) * Math.PI))

/**
 * O CELULAR, abaixo de 820px: os mesmos fios, ligando a grade 2×2 ao nome.
 *
 * Lá não há palco nem desenho do handoff — a grade é fluxo de página e muda
 * com a fonte, a largura e a copy. Então a rota inteira é MEDIDA, não só a
 * ponta: o centro de cada card (`[data-plug]`) e a caixa do nome (`[data-no]`),
 * em px do bloco de texto, que contém os dois. Sem `viewBox`, uma unidade do
 * SVG é um px.
 *
 * O fio sai do card para FORA, sobe pela margem e entra no nome pelo lado,
 * como no desktop: pelo meio ele cruzaria os botões. A linha de baixo faz a
 * curva mais aberta e entra mais alto no nome, a de cima a mais fechada e
 * entra mais baixo — uma dentro da outra, sem se cruzar.
 *
 * Onda e flutuar encolhem: a grade tem 10px de vão, e a boia de 10px do
 * desktop encostaria um card no outro. `margem` é quanto a curva passa para
 * fora da grade, [linha de cima, linha de baixo]; `piso` é o mínimo até a
 * beira da tela (a 360px a margem da grade é 20px, e as duas curvas dividem
 * isso); `quina` é quanto os controles passam das pontas, em fração da altura
 * do fio. Medidos a 360, 390, 600 e 760px contra os outros cards, os botões e
 * a beira — mexeu, meça de novo.
 */
const CELULAR = { amplitude: 0.3, boia: 0.3, margem: [10, 18], piso: 8, quina: 0.4 } as const

export function Cables({ celular = false }: { celular?: boolean }) {
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const raiz = svg.current
    if (!raiz) return

    const palco = raiz.parentElement
    if (!palco) return

    const fios = [...raiz.querySelectorAll<SVGPathElement>('[data-fio]')]
    const bolinhas = [...raiz.querySelectorAll<SVGCircleElement>('[data-pulso]')]
    const cards = CABOS.map((c) => palco.querySelector<HTMLElement>(`[data-card="${c.id}"]`))
    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /**
     * ONDE CADA FIO ENCOSTA, em unidades do viewBox — medido, e em cache.
     *
     * Lê o `[data-plug]` de cada card (um ponto sem tamanho no canto que olha
     * para o nome) com o card PARADO, o que traz de graça a rotação e a folga
     * de 10px. É a única leitura de layout daqui, e ela roda no mount e no
     * resize, nunca por quadro — a regra do `AGENTS.md` sobre não ler layout
     * dentro de loop de scroll vale igual aqui.
     */
    const rotas: Ponto[][] = CABOS.map((c) => [...c.p])
    let porPx = { x: VB_W / 1240, y: VB_H / 700 }
    const amplitude = celular ? AMPLITUDE * CELULAR.amplitude : AMPLITUDE
    const repouso = (i: number) => (celular ? '' : `rotate(${CABOS[i].giro}deg)`)
    const nome = palco.querySelector<HTMLElement>('[data-no]')

    const medir = () => {
      const caixa = palco.getBoundingClientRect()
      if (!caixa.width || !caixa.height) return
      porPx = celular ? { x: 1, y: 1 } : { x: VB_W / caixa.width, y: VB_H / caixa.height }

      const centros = cards.map((card, i): Ponto | null => {
        if (!card) return null
        const antes = card.style.transform
        // sem o flutuar: a medida é a do card em repouso
        card.style.transform = repouso(i)
        const r = card.querySelector<HTMLElement>('[data-plug]')?.getBoundingClientRect()
        card.style.transform = antes
        return r ? [(r.left - caixa.left) * porPx.x, (r.top - caixa.top) * porPx.y] : null
      })

      if (!celular) {
        centros.forEach((c, i) => c && (rotas[i][0] = c))
        return
      }

      const n = nome?.getBoundingClientRect()
      const caixas = cards.map((c) => c?.getBoundingClientRect())
      if (!n?.width || caixas.some((c) => !c?.width)) return
      const nx = n.left - caixa.left + n.width / 2
      const ny = n.top - caixa.top + n.height / 2
      const esquerda = Math.min(...caixas.map((c) => c!.left)) - caixa.left
      const direita = Math.max(...caixas.map((c) => c!.right)) - caixa.left
      const meioY = centros.reduce((s, c) => s + (c?.[1] ?? 0), 0) / centros.length

      centros.forEach((p0, i) => {
        if (!p0) return
        const lado = p0[0] < nx ? -1 : 1
        const externo = p0[1] > meioY
        // termina DENTRO de uma linha do nome (±¼ da altura é o meio de cada
        // uma), atrás das letras e da sombra delas — no vão entre as duas o
        // fio aparece. A linha de baixo da grade entra na de cima do nome.
        const p3: Ponto = [nx + lado * n.width * 0.16, ny + (externo ? -0.25 : 0.25) * n.height]
        // onde a curva deve encostar na margem, fora da grade
        // — mas nunca a menos de `piso` da beira da tela, onda incluída
        const piso = CELULAR.piso + amplitude
        const borda = Math.min(
          Math.max((lado < 0 ? esquerda : direita) + lado * CELULAR.margem[externo ? 1 : 0], piso),
          caixa.width - piso,
        )
        // o x dos dois controles que leva o ponto mais aberto da bézier até a
        // `borda` (em t=½ ele vale ⅛·p0 + ¾·controle + ⅛·p3)
        const cx = (borda - (p0[0] + p3[0]) / 8) / 0.75
        // os controles passam das quinas — abaixo do card, acima do nome —, e
        // a curva fica mais "caixa": chega na margem antes de subir (sem isso a
        // de baixo corta a quina do card de cima) e desce no nome por cima, em
        // vez de varrer o canto dos botões
        const folga = CELULAR.quina * (p0[1] - p3[1])
        rotas[i] = [p0, [cx, p0[1] + folga], [cx, p3[1] - folga], p3]
      })
    }

    /** Um quadro. Com movimento reduzido ele roda UMA vez, e é o suficiente:
     *  sem isto o SVG nasce com os fios sem `d` nenhum e a cena fica vazia. */
    const desenhar = (tempo: number) => {
      CABOS.forEach((cabo, i) => {
        // o MESMO número move o card e a ponta do fio
        const boia = boiar(cabo, tempo) * (celular ? CELULAR.boia : 1)
        const card = cards[i]
        if (card) card.style.transform = `translateY(${boia.toFixed(2)}px) ${repouso(i)}`

        // a curva começa onde o card está AGORA, não onde o desenho o pôs
        const r = rotas[i]
        const p: Ponto[] = [[r[0][0], r[0][1] + boia * porPx.y], r[1], r[2], r[3]]
        const d = tracar(p, cabo.fase, tempo, amplitude)
        // as três camadas do mesmo fio compartilham o caminho
        for (let camada = 0; camada < CAMADAS.length; camada++) {
          fios[i * CAMADAS.length + camada]?.setAttribute('d', d)
        }

        const bola = bolinhas[i]
        if (!bola) return
        // a bolinha anda pelo MESMO fio ondulado: percorre o parâmetro e é
        // posicionada pela mesma conta, senão ela desliza ao lado da luz
        const ciclo = (tempo % cabo.pulso) / cabo.pulso
        const [x, y] = ponto(p, ciclo, cabo.fase, tempo, amplitude)
        bola.setAttribute('cx', x.toFixed(2))
        bola.setAttribute('cy', y.toFixed(2))
        // some nas duas pontas: aparecer de estalo lê como defeito de render
        bola.setAttribute('opacity', String(Math.sin(Math.PI * ciclo) ** 0.6))
      })
    }

    medir()
    // no celular a grade anda sem o bloco mudar de tamanho — a fonte do nome
    // chegando, a copy quebrando linha —, então o nome e os cards também
    const regua = new ResizeObserver(() => {
      medir()
      if (parado) desenhar(0)
    })
    regua.observe(palco)
    if (celular) [nome, ...cards].forEach((el) => el && regua.observe(el))

    if (parado) {
      desenhar(0)
      return () => regua.disconnect()
    }

    let raf = 0
    let visivel = true
    const inicio = performance.now()

    const quadro = (agora: number) => {
      raf = 0
      if (!visivel) return
      // o primeiro quadro pode ter carimbo ANTERIOR ao `inicio`, e tempo
      // negativo dá `ciclo` negativo e opacidade `NaN` na bolinha
      desenhar(Math.max(0, agora - inicio) / 1000)
      raf = requestAnimationFrame(quadro)
    }

    /** Fora da tela não desenha — mesma regra dos canvas do site. */
    const olho = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting
        if (visivel && !raf) {
          // escondido (`display: none` do outro lado dos 820px) mediu zero
          medir()
          raf = requestAnimationFrame(quadro)
        }
      },
      { rootMargin: '120px' },
    )
    olho.observe(raiz)
    raf = requestAnimationFrame(quadro)

    return () => {
      cancelAnimationFrame(raf)
      olho.disconnect()
      regua.disconnect()
    }
  }, [celular])

  return (
    <svg
      ref={svg}
      viewBox={celular ? undefined : `0 0 ${VB_W} ${VB_H}`}
      aria-hidden
      fill="none"
      // o fade é por filho, nunca num ancestral dos cards — a razão está no
      // `Hero.tsx`. No celular o fio vai com o bloco de texto (`--hw`), ao
      // QUADRADO: no meio do fade o próprio card está translúcido e deixa
      // passar o fio sem desfoque; apagando antes dos cards, sobra pouco
      style={{ opacity: celular ? 'calc(var(--hw, 1) * var(--hw, 1))' : 'var(--hs, 1)' }}
      className={`absolute inset-0 size-full overflow-visible ${celular ? 'hidden max-[820px]:block' : ''}`}
    >
      {CABOS.map((cabo) =>
        CAMADAS.map(([mult, opacidade]) => (
          <path
            key={`${cabo.id}-${mult}`}
            data-fio
            stroke={`${cabo.cor}${cabo.alfa})`}
            strokeWidth={ESPESSURA * mult}
            strokeLinecap="round"
            opacity={opacidade}
          />
        )),
      )}

      {CABOS.map((cabo) => (
        <circle
          key={cabo.id}
          data-pulso
          r={3}
          fill={cabo.cor.startsWith('rgba(168') ? '#a8c7fa' : '#b6c98f'}
        />
      ))}
    </svg>
  )
}
