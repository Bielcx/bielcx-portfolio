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

/** O fio inteiro num instante: a curva com a onda somada na perpendicular. */
function tracar(p: Ponto[], fase: number, tempo: number) {
  let d = ''
  for (let i = 0; i <= PONTOS; i++) {
    const t = i / PONTOS
    const [x, y] = bezier(p, t)
    const [tx, ty] = tangente(p, t)
    const norma = Math.hypot(tx, ty) || 1
    // amplitude morre nas pontas: o fio fica preso no card e no nome
    const amp = AMPLITUDE * Math.sin(Math.PI * t)
    const onda = Math.sin(t * ONDAS * Math.PI * 2 + fase - tempo * VELOCIDADE) * amp
    d += `${i ? 'L' : 'M'}${(x + (-ty / norma) * onda).toFixed(2)} ${(y + (tx / norma) * onda).toFixed(2)}`
  }
  return d
}

export function Cables() {
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const raiz = svg.current
    if (!raiz) return

    const fios = [...raiz.querySelectorAll<SVGPathElement>('[data-fio]')]
    const bolinhas = [...raiz.querySelectorAll<SVGCircleElement>('[data-pulso]')]
    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /** Um quadro. Com movimento reduzido ele roda UMA vez, e é o suficiente:
     *  sem isto o SVG nasce com os fios sem `d` nenhum e a cena fica vazia. */
    const desenhar = (tempo: number) => {
      CABOS.forEach((cabo, i) => {
        const d = tracar(cabo.p as Ponto[], cabo.fase, tempo)
        // as três camadas do mesmo fio compartilham o caminho
        for (let camada = 0; camada < CAMADAS.length; camada++) {
          fios[i * CAMADAS.length + camada]?.setAttribute('d', d)
        }

        const bola = bolinhas[i]
        if (!bola) return
        // a bolinha anda pelo MESMO fio ondulado: percorre o parâmetro e é
        // posicionada pela mesma conta, senão ela desliza ao lado da luz
        const ciclo = (tempo % cabo.pulso) / cabo.pulso
        const [x, y] = bezier(cabo.p as Ponto[], ciclo)
        const [tx, ty] = tangente(cabo.p as Ponto[], ciclo)
        const norma = Math.hypot(tx, ty) || 1
        const amp = AMPLITUDE * Math.sin(Math.PI * ciclo)
        const onda = Math.sin(ciclo * ONDAS * Math.PI * 2 + cabo.fase - tempo * VELOCIDADE) * amp
        bola.setAttribute('cx', String(x + (-ty / norma) * onda))
        bola.setAttribute('cy', String(y + (tx / norma) * onda))
        // some nas duas pontas: aparecer de estalo lê como defeito de render
        bola.setAttribute('opacity', String(Math.sin(Math.PI * ciclo) ** 0.6))
      })
    }

    if (parado) {
      desenhar(0)
      return
    }

    let raf = 0
    let visivel = true
    const inicio = performance.now()

    const quadro = (agora: number) => {
      raf = 0
      if (!visivel) return
      desenhar((agora - inicio) / 1000)
      raf = requestAnimationFrame(quadro)
    }

    /** Fora da tela não desenha — mesma regra dos canvas do site. */
    const olho = new IntersectionObserver(
      ([entrada]) => {
        visivel = entrada.isIntersecting
        if (visivel && !raf) raf = requestAnimationFrame(quadro)
      },
      { rootMargin: '120px' },
    )
    olho.observe(raiz)
    raf = requestAnimationFrame(quadro)

    return () => {
      cancelAnimationFrame(raf)
      olho.disconnect()
    }
  }, [])

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      aria-hidden
      fill="none"
      className="absolute inset-0 size-full"
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
