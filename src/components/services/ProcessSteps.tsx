import { useState, type CSSProperties } from 'react'

import { Icon } from '../Icon'
import { services } from '../../data/content'

/**
 * A rede da automação: o que entra à esquerda, a automação no meio, o que sai
 * à direita, tudo ligado por fios com um pulso de luz correndo dentro deles.
 *
 * **Por que é uma rede e não uma lista.** Aqui já esteve a sequência de como um
 * contrato começa, em quatro passos empilhados com um facho descendo. Aquilo
 * ilustrava um PROCESSO — início, meio e fim —, e o que esta faixa vende é o
 * contrário: algo que entra uma vez e continua rodando sozinho. Nós ligados,
 * com pulso permanente em todos os fios ao mesmo tempo, é o desenho disso. Foi
 * pedido assim.
 *
 * **Nenhum logo de ferramenta**, e isso não é falta de acabamento: o painel
 * nasceu no lugar de uma grade de logos. Logo responde "com o que vocês
 * trabalham"; a pergunta que o cliente faz antes é "serve para mim?", e uma
 * parede de marcas que ele não reconhece responde que não. Os ícones são
 * genéricos e quem nomeia as ferramentas é a `note`, em texto.
 *
 * A linha do rodapé continua sendo a mais importante do painel: é ela que tira
 * o pé do cliente da dúvida de precisar ter alguma coisa pronta antes de
 * chamar.
 */

/**
 * O sistema de coordenadas do desenho.
 *
 * Tudo aqui é PORCENTAGEM da caixa — é a única grade, e os nós (HTML) a usam
 * direto em `left`/`top`. Os fios (SVG) passam pelo `vb()`, que converte para
 * as unidades do `viewBox`.
 *
 * **O `viewBox` é 160×110 porque a caixa é `aspect-[16/11]`, e os dois têm de
 * ser a MESMA proporção.** Era 100×69, que dá 1,4493 contra os 1,4545 da
 * caixa: com o `preserveAspectRatio` padrão, o SVG encolhe para caber e fica
 * centralizado com sobra, e aí a grade dele deixa de bater com a dos nós. Era
 * isso que desalinhava o fio da bolinha — e desalinhava POUCO, que é o pior
 * caso, porque parece desleixo de desenho e não erro de conta.
 *
 * Mexeu na proporção da caixa, refaça o `viewBox` para a mesma razão.
 */
const VB_W = 160
const VB_H = 110
/** De porcentagem da caixa para unidade do viewBox. */
const vb = (x: number, y: number) => [(x / 100) * VB_W, (y / 100) * VB_H] as const
/**
 * Espessura ÚNICA, para o fio parado e para o pulso. Eram 0.16 e 0.3, e o
 * pulso mais gordo lia como um fio diferente passando por cima do outro, não
 * como luz dentro do mesmo fio. O que separa os dois agora é só cor e brilho —
 * ver o `fio-pulso` no `index.css`.
 *
 * O valor subiu de 0.28 para 0.45 junto com o rastro. Em unidades do `viewBox`
 * de 160 de largura, 0.28 dava menos de 1px num painel de ~500px: o traço caía
 * em meio pixel, o antialias comia metade dele e o pulso piscava ao andar. É
 * isso que tira a fluidez, e não a animação.
 */
const ESPESSURA = 0.45

/** Camadas do halo: [multiplicador da espessura, opacidade]. */
const HALOS = [
  [5, 0.1],
  [2.4, 0.22],
] as const

/**
 * O COMETA, e por que ele não é mais um tracejado.
 *
 * A versão anterior movia um `stroke-dasharray` pelo caminho. Funciona, mas o
 * traço tem opacidade uniforme e ponta redonda: lê como uma cápsula deslizando
 * dentro do fio. O `AnimatedBeam` do Magic UI faz outra coisa — stroke com um
 * `linearGradient` que se desloca, com quatro paradas (transparente → cor 1 →
 * cor 2 → transparente). O resultado é luz com cauda, que some nas duas pontas.
 * Era isso que faltava.
 *
 * O gradiente é UM só, em `userSpaceOnUse`, compartilhado pelos seis fios. Como
 * todos correm da esquerda para a direita, um gradiente horizontal atravessando
 * o quadro inteiro acende cada trecho na hora em que a frente de luz passa pelo
 * x dele: entra pelos nós da esquerda, cruza o núcleo no meio do caminho e sai
 * pelos da direita. **É uma passagem só**, em vez de cada perna do percurso
 * levar um ciclo inteiro como antes.
 *
 * Quem anima é SMIL (`<animate>`), e não CSS: coordenada de gradiente SVG não é
 * animável por CSS de forma confiável, e o original resolve isso com uma
 * dependência de animação que aqui não entra.
 *
 * **Diferença deliberada para o original:** lá o movimento usa `easeOutExpo`,
 * porque cada feixe é um disparo avulso. Aqui é linear, e de propósito: os nós
 * acendem quando a frente passa por eles, e essa conta (`fase`) só fecha com
 * velocidade constante. Trocar por easing é ter de refazer a fase de cada nó.
 */
const CICLO = 4.8
/** Comprimento da luz, em unidades do viewBox. */
const COMETA = 46
/** Curso total da cabeça do cometa: de 0 até a direita do quadro mais a cauda. */
const CURSO = VB_W + COMETA

/**
 * O `animation-delay` que faz o nó em `xPct` acender no instante em que a
 * frente de luz passa por ele. É o que sincroniza o brilho com o fluxo.
 *
 * **O sinal é a parte que engana.** O nó deve acender em `t = curso até x`, e o
 * `beam-bead` tem o pico em 0%/100% — então é preciso que `t + delay` caia num
 * múltiplo do ciclo. Delay negativo ADIANTA a animação, logo `-t` acende o nó
 * `t` segundos cedo demais: com `-3,21s`, os nós da direita piscavam em 1,6s,
 * enquanto a luz ainda estava nas pernas de entrada. O valor certo é
 * `-(ciclo - t)`, que é a mesma fase e ainda começa a valer de imediato — um
 * delay positivo esperaria até 3,2s com o nó aceso antes do primeiro ciclo.
 */
const fase = (xPct: number) => {
  const chegada = (vb(xPct, 0)[0] / CURSO) * CICLO
  return `${-(CICLO - chegada).toFixed(3)}s`
}

const COLUNA_ENTRADA = 14
const COLUNA_SAIDA = 86
/**
 * Altura do núcleo e das três linhas de nós, em % da caixa.
 *
 * **As três linhas são simétricas em torno de `MEIO`, e `MEIO` é 50.** Parece
 * óbvio e não estava assim: era 34.5 com linhas em 12/34.5/57, então o centro
 * do conjunto caía a 34,5% da altura e sobrava um vazio do tamanho de um terço
 * da caixa embaixo do desenho. O eyebrow em cima e a nota embaixo escondiam
 * parte disso, e o que se via era a rede "subida" dentro do painel.
 *
 * Os 22 e 78 deixam folga para o rótulo, que fica ABAIXO de cada nó: a linha de
 * baixo termina perto de 85% com ele, não em 78%.
 */
const MEIO = 50
const LINHAS = [22, MEIO, 78]

/** Curva de um nó ao núcleo (ou do núcleo a um nó): sai e chega na horizontal. */
const fio = (px1: number, py1: number, px2: number, py2: number) => {
  const [x1, y1] = vb(px1, py1)
  const [x2, y2] = vb(px2, py2)
  const meio = (x1 + x2) / 2
  return `M${x1},${y1} C${meio},${y1} ${meio},${y2} ${x2},${y2}`
}

export function ProcessSteps() {
  const { eyebrow, rede, note } = services.process
  /* SMIL não respeita `prefers-reduced-motion` — quem tem de respeitar é
     quem monta. Lido uma vez, no inicializador: sem `<animate>`, o gradiente
     fica parado onde nasce e os fios ficam só desenhados. Mesmo caminho que o
     `EthMark` usa, e pela mesma razão. */
  const [parado] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const fios = [
    ...rede.entradas.map((_, i) => fio(COLUNA_ENTRADA, LINHAS[i], 50, MEIO)),
    ...rede.saidas.map((_, i) => fio(50, MEIO, COLUNA_SAIDA, LINHAS[i])),
  ]

  const nos = [
    ...rede.entradas.map((n, i) => ({ ...n, x: COLUNA_ENTRADA, y: LINHAS[i] })),
    { ...rede.nucleo, x: 50, y: MEIO },
    ...rede.saidas.map((n, i) => ({ ...n, x: COLUNA_SAIDA, y: LINHAS[i] })),
  ]

  return (
    <div className="p-8 md:p-10">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
        {eyebrow}
      </p>

      <div className="relative mt-7 aspect-[16/11] w-full">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden
        >
          {/* O gradiente que viaja. `userSpaceOnUse` para as coordenadas
              serem as do viewBox e não as da caixa de cada fio — é o que
              permite um só para os seis. As quatro paradas são as do Magic UI,
              com as cores daqui: some, acende no frio, vira menta, some. */}
          <defs>
            {/* A COR do pulso: um degradê parado, frio à esquerda e menta à
                direita, atravessando o quadro. Ele não se move — quem se move é
                a máscara. O efeito é o cometa entrar azul pelos nós de entrada
                e sair menta pelos de saída, que é a viagem que o painel conta. */}
            <linearGradient id="tom" gradientUnits="userSpaceOnUse" x1="0" x2={VB_W} y1="0" y2="0">
              <stop stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--color-accent-mint)" />
            </linearGradient>

            {/* A borda macia do cometa: opaco no miolo, transparente nas duas
                pontas. É o que dava as quatro paradas do gradiente do Magic UI,
                agora no alfa da máscara em vez de na cor. */}
            <linearGradient id="borda">
              <stop stopColor="#fff" stopOpacity="0" />
              <stop offset="22%" stopColor="#fff" />
              <stop offset="78%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* A JANELA QUE ANDA, e a razão de existir desta versão.
                
                Antes quem se movia era o gradiente, animado por SMIL. Funciona,
                mas SMIL corre na linha do tempo do DOCUMENTO e o brilho dos nós
                é animação CSS, que começa quando o React monta: duas linhas do
                tempo, defasadas pelo tempo de boot. No desktop isso desencontra;
                no celular, onde o boot é mais lento, desencontra mais — era o
                "não sincroniza" e o "não funciona no mobile", com uma causa só.
                
                Uma máscara com `transform` em CSS resolve porque passa a correr
                no MESMO relógio do `beam-bead` dos nós. Sincronia por
                construção, e não por dois números que se perseguem. */}
            <mask id="onda" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
              <rect
                className={parado ? undefined : 'onda-corre'}
                /* O curso vem daqui, e não do CSS, para não existir o mesmo
                   número em dois arquivos: o `fase()` que acende os nós usa
                   exatamente `COMETA` e `CURSO`, e se o keyframe tivesse cópias
                   deles a sincronia quebraria em silêncio na primeira vez que
                   alguém mexesse num só. */
                style={
                  {
                    '--onda-de': `${-COMETA}px`,
                    '--onda-ate': `${VB_W}px`,
                  } as CSSProperties
                }
                width={COMETA}
                height={VB_H}
                fill="url(#borda)"
              />
            </mask>
          </defs>

          {fios.map((d) => (
            <g key={d}>
              {/* O fio parado: o caminho que fica de pé o tempo todo. É contra
                  ele que a luz se lê como andando. */}
              <path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth={ESPESSURA}
              />
              {/* A luz, em três camadas do MESMO caminho e do MESMO gradiente:
                  duas mais grossas e transparentes por baixo, e a nítida por
                  cima. É assim que sai a queda de brilho sem `filter` —
                  `drop-shadow` num `<path>` recompõe a região e deixa um
                  retângulo fraco atrás da curva (medido: fundo `3,3,5` onde a
                  página é `5,5,5`).

                  Sem `stroke-dasharray` agora: quem decide o que está aceso é a
                  posição do gradiente, não um tracejado. E sem
                  `vector-effect="non-scaling-stroke"`, que já foi armadilha
                  aqui — ele interpreta tracejado em pixels de tela. */}
              {HALOS.map(([mult, alfa]) => (
                <path
                  key={mult}
                  d={d}
                  fill="none"
                  stroke="url(#tom)"
                  mask="url(#onda)"
                  strokeWidth={ESPESSURA * mult}
                  strokeLinecap="round"
                  opacity={alfa}
                />
              ))}
              <path
                d={d}
                fill="none"
                stroke="url(#tom)"
                mask="url(#onda)"
                strokeWidth={ESPESSURA}
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>

        {nos.map((no) => {
          const nucleo = no.x === 50

          return (
            <span
              key={no.label}
              /* **A caixa é exatamente a da bolinha**, e o rótulo pendura dela
                 por `absolute`. Esse é o alinhamento: o `-translate-y-1/2`
                 centra o que está DENTRO deste span no ponto, então se o rótulo
                 estivesse aqui dentro no fluxo — como esteve —, o que ficaria
                 centrado seria o conjunto bolinha+rótulo, e a bolinha subiria
                 metade da altura do texto. Eram ~9px, o bastante para o fio
                 entrar na bolinha abaixo do centro em todos os sete nós.
                 Fio e bolinha são a mesma coordenada; só o rótulo é que desce.

                 Posição em `%` casando com o viewBox. Nada de `transform`
                 inline: o `-translate` do Tailwind v4 usa a propriedade
                 `translate`, que SOMA ao `transform`, e sairia dobrado. */
              style={{ left: `${no.x}%`, top: `${no.y}%` }}
              className={`absolute block -translate-x-1/2 -translate-y-1/2 ${
                nucleo ? 'size-12' : 'size-9'
              }`}
            >
              <span
                /* Acende quando a frente de luz passa pelo x DESTE nó — entra
                   pela esquerda, cruza o núcleo, sai pela direita. */
                style={{ animationDelay: fase(no.x) } as CSSProperties}
                className="beam-bead flex size-full items-center justify-center rounded-full border border-(--accent)/35 bg-card text-(--accent)"
              >
                <Icon name={no.icon} className={nucleo ? 'size-5' : 'size-4'} />
              </span>

              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-ink/55">
                {no.label}
              </span>
            </span>
          )
        })}
      </div>

      {/* Centrada, como o resto do painel: a rede é simétrica em torno do
          núcleo, e um parágrafo encostado à esquerda embaixo dela desequilibra
          o bloco inteiro. O `mx-auto` no `max-w-md` é o que centra a CAIXA; o
          `text-center` centra a linha dentro dela. */}
      <p className="mx-auto mt-10 max-w-md border-t border-white/8 pt-7 text-center text-[13px] leading-relaxed text-ink/60">
        {note}
      </p>
    </div>
  )
}
