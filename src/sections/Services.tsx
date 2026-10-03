import type { CSSProperties } from 'react'
import { splitText, stagger } from 'animejs'

import { Icon } from '../components/Icon'
import { AgentDemo } from '../components/services/AgentDemo'
import { WorkGrid } from '../components/services/WorkGrid'
import { services } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { assentar, naRolagem, useScrollMotion } from '../hooks/useScrollMotion'

const ACCENTS = {
  warm: 'var(--color-accent-warm)',
  cool: 'var(--color-accent-cool)',
} as const

/** Cada faixa escolhe o painel que vai ao lado do texto. */
const VISUALS = {
  works: WorkGrid,
  agent: AgentDemo,
} as const


type Card = (typeof services.cards)[number]

/**
 * Duas faixas de largura inteira, uma por frente de trabalho, na MESMA
 * disposição: texto à esquerda, painel à direita. Ler duas faixas iguais é uma
 * leitura só, feita duas vezes — alternando o lado, o olho recomeça do zero na
 * segunda e o paralelo entre as duas frentes se perde.
 *
 * Eram dois cards gêmeos lado a lado, e a simetria custava caro dos dois lados:
 * os clipes dos trabalhos — a coisa mais forte da página — ficavam com um quarto
 * da largura e não se enxergavam, e a lista de serviços vivia escondida atrás de
 * um "ver os serviços" porque não cabia aberta. Em faixa, a lista fica sempre
 * aberta e os clipes dobram de tamanho.
 */
export function Services() {
  const ref = useScrollMotion(entrada)

  return (
    <section
      ref={ref}
      id="servicos"
      /*
       * Sem margem negativa nem `z-10`: a cortina que sobe por cima do hero é
       * da seção 02, que agora é quem vem logo depois dele. Aqui é fluxo
       * normal — o `Metodo` já cobriu o hero antes desta seção existir.
       */
      className="relative px-6 py-28 sm:px-10 md:py-40"
    >
      {/*
        A entrada é a função `entrada`, no fim do arquivo: o cabeçalho e cada
        faixa têm a sua timeline, cada uma amarrada à rolagem do PRÓPRIO bloco
        — a faixa de baixo só começa quando ela mesma aparece, e não quando a
        seção aparece.
      */}
      <div className="mx-auto max-w-6xl">
        <div data-m="cabeca">
          {/* Rótulo + título. O `description` do `SectionHeading` fica de
              fora: a linha de apoio que morava ali resumia os quatro serviços,
              e as duas faixas logo abaixo já fazem isso melhor.

              Não é só estética: sem o `h2` a seção ia do rótulo (um `<p>`)
              direto para os `h3` das faixas, e o documento pulava um nível —
              busca e leitor de tela liam a seção de serviços como subordinada
              à anterior. */}
          <SectionHeading eyebrow={services.eyebrow} title={services.title} align="center" />
        </div>

        <div className="mt-20 md:mt-28">
          {services.cards.map((card, i) => (
            <ServiceBand key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceBand({ card, index }: { card: Card; index: number }) {
  const Visual = VISUALS[card.visual]

  return (
    <article
      data-m="faixa"
      className={`grid items-center gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 ${
        index > 0 ? 'mt-20 border-t border-white/6 pt-20 md:mt-28 md:pt-28' : ''
      }`}
      style={{ '--accent': ACCENTS[card.accent] } as CSSProperties}
    >
      <div>
        <p data-m="rotulo" className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-(--accent)">
          <Icon name={card.icon} className="size-4" />
          {card.label}
          {/* Só a barra: é pontuação entre o rótulo e o contador, não texto
              para ler, e por isso fica abaixo do piso de contraste dos
              outros — ela separa, não informa. */}
          <span className="text-ink/40">/</span>
          <span data-m="numero" className="inline-block text-ink/55">{String(index + 1).padStart(2, '0')}</span>
        </p>

        <h3 data-m="titulo" className="mt-5 max-w-lg font-serif text-[clamp(24px,2.9vw,36px)] leading-[1.2] text-ink-bright">
          {card.headline}
        </h3>

        {/* Sempre aberta. Fechada atrás de um botão, a lista de serviços era a
            única resposta à pergunta "o que exatamente vocês fazem?" — e ficava
            a um clique de distância de quem ainda nem sabia se devia perguntar. */}
        <ul className="mt-8 divide-y divide-white/6 border-y border-white/8">
          {card.services.map((service) => (
            <li key={service.name} data-m="linha" className="py-3.5">
              <p className="flex items-center gap-2.5 text-[13px] text-ink/85">
                <span data-m="ponto" className="size-1 shrink-0 rounded-full bg-(--accent)" />
                {service.name}
              </p>
              <p className="mt-1 pl-[18px] text-[12.5px] leading-relaxed text-ink/60">
                {service.detail}
              </p>
            </li>
          ))}
        </ul>

      </div>

      {/* Centrado, não esticado: os dois painéis têm altura própria — as
          proporções dos thumbs num, os quatro passos no outro. Esticados até a
          altura da coluna de texto, o vão sobrava DENTRO deles, e no processo
          isso abria um buraco de mais de cem pixels entre um passo e o
          seguinte. Vão simétrico em volta lê como respiro; vão no meio da
          lista lê como defeito. */}
      {/* Sem moldura aqui: quem tem borda é o painel que precisa dela. A
          grade de trabalhos traz a sua; o `AgentDemo` é um celular, e caixa em
          volta de celular vira moldura dentro de moldura. */}
      <div data-m="painel">
        <Visual />
      </div>
    </article>
  )
}

/**
 * Entrada da seção 03, dirigida pela rolagem nos dois sentidos.
 *
 * Cabeçalho: o rótulo sobe e o título entra palavra por palavra. Cada faixa:
 * o rótulo desliza da esquerda, o contador ("01") sobe, o título vem por
 * palavras, as linhas da lista entram em cascata com o ponto colorido
 * crescendo, e o painel sobe por último. Na faixa de trabalhos os quatro
 * cartões vêm em cascata por dentro da moldura — o painel da outra faixa é um
 * bloco só, e anda inteiro.
 *
 * O `a` dos cartões não tem `transition` própria (o zoom do hover é no `img`
 * e no `video`, dentro dele), por isso dá para animar o `transform` dele sem
 * a transição atrasar cada quadro.
 */
function entrada(root: HTMLElement) {
  const cabeca = root.querySelector<HTMLElement>('[data-m="cabeca"]')!
  const tituloCabeca = splitText(cabeca.querySelector('h2')!, { words: true })

  const tlCabeca = naRolagem(cabeca, '60% top')
    .add(cabeca.querySelector('p')!, { opacity: [0, 1], translateY: [20, 0], letterSpacing: ['0.5em', '0.18em'] }, 0)
    .add(
      tituloCabeca.words,
      { opacity: [0, 1], translateY: ['0.5em', '0em'], filter: ['blur(8px)', 'blur(0px)'], delay: stagger(60) },
      120,
    )

  assentar(tlCabeca)

  for (const faixa of root.querySelectorAll<HTMLElement>('[data-m="faixa"]')) {
    const q = (m: string) => faixa.querySelector<HTMLElement>(`[data-m="${m}"]`)!
    const titulo = splitText(q('titulo'), { words: true })
    const painel = q('painel')
    const cartoes = painel.querySelectorAll(':scope > div > a')

    const tl = naRolagem(faixa)
      .add(q('rotulo'), { opacity: [0, 1], translateX: [-28, 0] }, 0)
      .add(q('numero'), { opacity: [0, 1], translateY: [14, 0], rotateX: [-90, 0] }, 150)
      .add(titulo.words, { opacity: [0, 1], translateY: ['0.5em', '0em'], filter: ['blur(6px)', 'blur(0px)'], delay: stagger(35) }, 100)
      .add(faixa.querySelectorAll('[data-m="linha"]'), { opacity: [0, 1], translateY: [24, 0], delay: stagger(70) }, 300)
      .add(faixa.querySelectorAll('[data-m="ponto"]'), { scale: [0, 1], delay: stagger(70), ease: 'outBack' }, 380)
      .add(painel, { opacity: [0, 1], translateY: [100, 0], scale: [0.96, 1], duration: 800, ease: 'outCubic' }, 0)

    if (cartoes.length) {
      tl.add(cartoes, { opacity: [0, 1], translateY: [40, 0], scale: [0.92, 1], delay: stagger(90) }, 250)
    }
    assentar(tl)
  }
}
