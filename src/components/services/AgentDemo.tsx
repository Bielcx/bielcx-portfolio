import { useEffect, useRef, useState } from 'react'

import { Icon } from '../Icon'
import { services } from '../../data/content'

/**
 * O agente de atendimento, funcionando — o painel da faixa de automação.
 *
 * A linha "Agente de IA" da lista ao lado é a mais difícil de vender por
 * escrito: o cliente lê "entende a conversa e responde no seu tom" e imagina
 * um menu de robô. Aqui ele conversa com um, num negócio fictício, e vê as
 * três coisas que separam um agente de um menu: ele consulta algo antes de
 * responder (a linha de passo), responde em frase e não em opção numerada, e
 * passa a bola para uma pessoa quando a conversa sai do que ele resolve.
 *
 * **As respostas são escritas à mão, e a nota do rodapé diz isso.** Não há
 * LLM aqui, e a escolha não é preguiça: o site é estático, e pôr um modelo de
 * verdade nesta caixa é uma função serverless, uma chave de API, custo por
 * visita e um estranho com um campo de texto aberto para a conta do dono. O
 * que esta caixa precisa provar — o formato da conversa — um roteiro prova
 * igual, e nunca alucina na frente de um cliente. Se um dia virar modelo de
 * verdade, o que muda é de onde `resposta` vem; o resto do componente serve.
 *
 * No lugar deste painel havia a rede de nós do `ProcessSteps` — entradas à
 * esquerda, automação no meio, saídas à direita, com um cometa de luz
 * correndo pelos fios. Ela DESENHAVA o que este painel agora DEMONSTRA, e
 * saiu inteira (com as utilidades `onda-corre` e `beam-bead`, que eram só
 * dela). Está no git.
 */

type Fala = {
  de: 'cliente' | 'agente' | 'passo'
  texto: string
  hora?: string
}

/** Quanto tempo o agente "pensa" antes do passo e antes da resposta. */
const ESPERA_PASSO = 450
const ESPERA_RESPOSTA = 1600

/**
 * O RELÓGIO DA CONVERSA, e por que ele não é o relógio de verdade.
 *
 * Hora real (`new Date()`) numa conversa de demonstração cria duas mentiras
 * pequenas: a primeira mensagem, que já nasce na tela antes de qualquer
 * clique, ficaria carimbada com o instante em que a página abriu, e quem
 * lesse a conversa às 3h da manhã veria um restaurante confirmando reserva às
 * 3h. Aqui é uma manhã fixa, e cada mensagem anda um minuto.
 */
const INICIO = 9 * 60 + 14
const relogio = (i: number) => {
  const m = INICIO + i
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/**
 * As medidas do aparelho, na grade do desenho do Magic UI (ver `Moldura`, no
 * fim do arquivo). A tela é posicionada em PORCENTAGEM delas, e não em pixel:
 * é o que mantém o conteúdo colado à moldura em qualquer largura.
 */
const LARGURA = 433
const ALTURA = 882
const TELA_X = 21.25
const TELA_Y = 19.25
const TELA_W = 389.5
const TELA_H = 843.5
const RAIO = 55.75

const pct = (parte: number, todo: number) => (parte / todo) * 100

/**
 * A PALETA DA TELA É A DO WHATSAPP NO ESCURO, e é a única coisa do site que
 * não sai dos tokens do tema.
 *
 * Fundo `#0b141a`, cabeçalho e balão recebido `#1f2c33`, balão enviado
 * `#005c4b`, tinta `#e9edef`, tique lido `#53bdeb`. Isso é deliberado: o que
 * está dentro da moldura não é o site, é OUTRO APLICATIVO aberto no telefone
 * do cliente. Pintar a conversa com o preto e o azul da página faria dela mais
 * um painel do portfólio, que é exatamente o que o mockup existe para não ser.
 *
 * O verde entra só aqui, nunca vaza para fora do furo da tela, e não há logo
 * nem a palavra WhatsApp em lugar nenhum — a faixa proíbe logo de ferramenta,
 * e quem nomeia o canal é a nota em texto, embaixo do aparelho.
 */
const ZAP = {
  fundo: 'bg-[#0b141a]',
  barra: 'bg-[#1f2c33]',
  recebido: 'bg-[#1f2c33]',
  enviado: 'bg-[#005c4b]',
  tinta: 'text-[#e9edef]',
  meta: 'text-[#e9edef]/45',
  tique: 'text-[#53bdeb]',
  sistema: 'bg-[#182229]',
} as const

export function AgentDemo() {
  const { eyebrow, negocio, status, divisor, saudacao, abertura, perguntas, reiniciar, note } =
    services.agente

  /* A conversa já em andamento — ver a nota da `saudacao` na copy. */
  const inicio = (): Fala[] => [
    { de: 'cliente', texto: saudacao, hora: relogio(0) },
    { de: 'agente', texto: abertura, hora: relogio(1) },
  ]

  /* Sem animação e sem espera para quem pediu movimento reduzido: a conversa
     aparece inteira no clique. Lido uma vez, como no `EthMark`. */
  const [parado] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [falas, setFalas] = useState<Fala[]>(inicio)
  const [feitas, setFeitas] = useState<readonly string[]>([])
  const [ocupado, setOcupado] = useState(false)

  /* Os timers ficam num ref para serem cancelados no desmonte — sem isso, o
     StrictMode e a saída da página deixam `setState` disparando em componente
     morto. */
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /* Rola a CAIXA, nunca a página: `scrollIntoView` num painel no meio de uma
     seção arrasta o visitante para cá enquanto ele lê outra coisa. */
  const log = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = log.current
    if (el) el.scrollTop = el.scrollHeight
  }, [falas, ocupado])

  /* O minuto da próxima mensagem conta só as que TÊM hora: a linha de passo é
     do sistema, não da conversa, e não carimba horário nem consome um minuto. */
  const proxima = (lista: Fala[]) => relogio(lista.filter((f) => f.hora).length)

  function perguntar(p: (typeof perguntas)[number]) {
    if (ocupado) return
    setFalas((f) => [...f, { de: 'cliente', texto: p.pergunta, hora: proxima(f) }])
    setFeitas((f) => [...f, p.pergunta])
    setOcupado(true)

    const depois = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, parado ? 0 : ms))
    }
    depois(ESPERA_PASSO, () => setFalas((f) => [...f, { de: 'passo', texto: p.passo }]))
    depois(ESPERA_RESPOSTA, () => {
      setFalas((f) => [...f, { de: 'agente', texto: p.resposta, hora: proxima(f) }])
      setOcupado(false)
    })
  }

  function recomecar() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setFalas(inicio())
    setFeitas([])
    setOcupado(false)
  }

  const restantes = perguntas.filter((p) => !feitas.includes(p.pergunta))

  return (
    <div className="flex flex-col items-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">{eyebrow}</p>

      <div className="relative mt-7 w-full max-w-[272px]">
        {/* O halo, ATRÁS do aparelho. O telefone é preto como a página, e sem
            ele a moldura some no fundo em vez de flutuar sobre ele. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-(--accent)/8 blur-2xl"
        />

        <div className="relative" style={{ aspectRatio: `${LARGURA}/${ALTURA}` }}>
          {/* A TELA, por baixo da moldura e aparecendo pelo furo dela.

              O raio vai em `X% / Y%` porque uma tela de 389×843 com canto
              circular de 55 tem porcentagens diferentes nos dois eixos; com um
              valor só o canto sai oval e denuncia o desenho. */}
          <div
            className={`absolute flex flex-col overflow-hidden ${ZAP.fundo}`}
            style={{
              left: `${pct(TELA_X, LARGURA)}%`,
              top: `${pct(TELA_Y, ALTURA)}%`,
              width: `${pct(TELA_W, LARGURA)}%`,
              height: `${pct(TELA_H, ALTURA)}%`,
              borderRadius: `${pct(RAIO, TELA_W)}% / ${pct(RAIO, TELA_H)}%`,
            }}
          >
            {/* A barra de contato: foto, nome do negócio e o estado embaixo —
                a mesma disposição do aplicativo. É o que põe o visitante no
                lugar do cliente DELE, e não no de quem contrata.

                O `pt-12` é a altura da ilhota mais folga: ela é desenhada pela
                moldura, POR CIMA desta tela, e sem o respiro o nome do negócio
                passa por baixo dela. */}
            <div className={`flex items-center gap-3 px-3.5 pb-2.5 pt-12 ${ZAP.barra}`}>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/40 text-(--accent)">
                <Icon name="bolt" className="size-4" />
              </span>
              <span className="min-w-0">
                <span className={`block truncate text-[13px] ${ZAP.tinta}`}>{negocio}</span>
                <span className={`block truncate text-[11px] ${ZAP.meta}`}>{status}</span>
              </span>
            </div>

            {/* `flex-1`: a conversa é quem come a altura que sobra do aparelho.
                Altura fixa aqui deixaria um vão embaixo dos chips, e vão dentro
                de uma moldura de celular lê como tela cortada.

                **A conversa cresce de BAIXO para cima** (`min-h-full` +
                `justify-end` no miolo). Sem isso a primeira mensagem nasce
                colada no alto e sobram uns 400px de vazio até os chips — e
                aplicativo de mensagem nenhum se comporta assim, então a tela
                lê na hora como maquete. O `mt-auto` não serve: com uma
                conversa longa ele empurra o começo para fora do scroll. */}
            <div ref={log} aria-live="polite" className="flex-1 overflow-y-auto px-3 py-4">
              <div className="flex min-h-full flex-col justify-end space-y-2">
                <Sistema aria-hidden>{divisor}</Sistema>

                {falas.map((fala, i) =>
                  fala.de === 'passo' ? (
                    /* A linha de passo é a peça que vende o painel: ela mostra
                     que o agente CONSULTOU alguma coisa antes de responder. No
                     aplicativo, mensagem de sistema é uma pílula centrada — o
                     mesmo lugar do "hoje" —, e é por isso que ela entra assim
                     e não como balão: balão a faria parecer fala do negócio. */
                    <Sistema key={i} className="text-(--accent)">
                      <Icon name="check" className="size-3" />
                      {fala.texto}
                    </Sistema>
                  ) : (
                    <Balao key={i} fala={fala} />
                  ),
                )}

                {ocupado && (
                  <p
                    className={`flex w-fit gap-1 rounded-lg rounded-tl-none px-3 py-3 ${ZAP.recebido}`}
                    aria-hidden
                  >
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        style={{ animationDelay: `${d * 160}ms` }}
                        className="size-1.5 animate-pulse rounded-full bg-[#e9edef]/60"
                      />
                    ))}
                  </p>
                )}
              </div>
            </div>

            {/* Perguntas prontas no lugar da barra de digitação, que é onde o
                aplicativo põe as respostas rápidas. Campo de texto livre seria
                o caminho óbvio e é justamente o que não pode existir: ele
                convida o visitante a testar o que o roteiro não responde, e o
                que ele leva embora é a falha. Uma barra de digitação FALSA,
                que não escreve, seria pior ainda — parece defeito.

                Cada chip sai da lista depois de usado: a mesma resposta duas
                vezes denuncia o roteiro. O `pb-7` é a área da barra de gesto;
                chip encostado na borda de baixo lê como corte, não como fim. */}
            <div className={`flex flex-wrap gap-1.5 px-3 pb-7 pt-3 ${ZAP.barra}`}>
              {restantes.map((p) => (
                <button
                  key={p.pergunta}
                  type="button"
                  onClick={() => perguntar(p)}
                  disabled={ocupado}
                  className={`rounded-full border border-[#2a3942] bg-[#111b21] px-2.5 py-1 text-[11.5px] ${ZAP.tinta} transition-colors hover:border-(--accent)/60 disabled:opacity-40`}
                >
                  {p.label}
                </button>
              ))}
              {restantes.length === 0 && (
                <button
                  type="button"
                  onClick={recomecar}
                  className={`rounded-full border border-[#2a3942] bg-[#111b21] px-2.5 py-1 text-[11.5px] ${ZAP.tinta} transition-colors hover:border-(--accent)/60`}
                >
                  {reiniciar}
                </button>
              )}
            </div>
          </div>

          <Moldura />
        </div>
      </div>

      {/* FORA do telefone, de propósito: é o site falando com quem olha, e não
          o negócio fictício falando com o cliente dele. Dentro da moldura a
          nota viraria mais uma mensagem da conversa. */}
      <p className="mt-9 max-w-md border-t border-white/8 pt-6 text-center text-[13px] leading-relaxed text-ink/60">
        {note}
      </p>
    </div>
  )
}

/** A pílula centrada do aplicativo: separador de data e mensagem de sistema. */
function Sistema({ children, className = '', ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={`mx-auto flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${ZAP.sistema} ${className || 'text-[#e9edef]/55'}`}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * Um balão. O canto reto do lado de quem falou é o que o aplicativo usa no
 * lugar do rabicho, e é o detalhe que faz a conversa ler como print.
 *
 * A hora e os tiques vão `aria-hidden`: são cenário. Quem usa leitor de tela
 * recebe o texto da mensagem, que é o conteúdo, sem ouvir "09:16 visto" a cada
 * linha.
 */
function Balao({ fala }: { fala: Fala }) {
  const cliente = fala.de === 'cliente'

  return (
    <div className={`flex ${cliente ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-[12.5px] leading-snug ${ZAP.tinta} ${
          cliente ? `rounded-tr-none ${ZAP.enviado}` : `rounded-tl-none ${ZAP.recebido}`
        }`}
      >
        {fala.texto}
        <span
          aria-hidden
          className={`float-right ml-2 mt-1 flex items-center text-[10px] ${ZAP.meta}`}
        >
          {fala.hora}
          {cliente && <Tique />}
        </span>
      </p>
    </div>
  )
}

/**
 * O tique duplo de "lido".
 *
 * Desenhado aqui, e não com o `Icon`: o `check` do conjunto é um certo DENTRO
 * de um círculo, e dois círculos sobrepostos viram um diagrama de Venn azul no
 * canto do balão. O tique do aplicativo é o traço solto, duas vezes.
 */
function Tique() {
  return (
    <svg
      viewBox="0 0 18 12"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ml-1 h-3 w-[18px] ${ZAP.tique}`}
    >
      <path d="M1 6.6 4.2 10 10.6 2" />
      <path d="M7.2 6.6 10.4 10 16.8 2" />
    </svg>
  )
}

/**
 * A moldura do iPhone — porte do componente do Magic UI, como o `LightBeam` e
 * o `DriftWall` são portes do React Bits.
 *
 * **O original só sabe pôr imagem ou vídeo na tela** (props `src`/`videoSrc`).
 * Aqui a tela é HTML vivo — botão, rolagem, `aria-live` —, então as duas props
 * saíram e a máscara dele passou a servir a outro fim: o `furo` vaza o
 * retângulo da tela do corpo do aparelho, e a conversa aparece por baixo. A
 * ilhota é desenhada FORA do grupo mascarado, e por isso continua por cima da
 * conversa, que é onde ela fica num telefone de verdade.
 *
 * **`pointer-events-none` é obrigatório**: o SVG cobre o aparelho inteiro,
 * furo incluído, e sem isso ele come o clique dos chips que estão embaixo.
 *
 * As cores do original são um par claro/escuro do Tailwind (`#E5E5E5` /
 * `#404040`). Aqui são fixas e escuras: o site não tem tema claro, e quem
 * separa o aparelho do fundo preto é o halo atrás dele, não a cor da moldura.
 */
function Moldura() {
  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      fill="none"
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
    >
      <defs>
        <mask id="furo" maskUnits="userSpaceOnUse">
          <rect width={LARGURA} height={ALTURA} fill="white" />
          <rect
            x={TELA_X}
            y={TELA_Y}
            width={TELA_W}
            height={TELA_H}
            rx={RAIO}
            ry={RAIO}
            fill="black"
          />
        </mask>
      </defs>

      {/* Corpo e botões laterais, todos furados pela tela. */}
      <g mask="url(#furo)">
        <g className="fill-[#26272b]">
          <path d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z" />
          <path d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z" />
          <path d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z" />
          <path d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z" />
          <path d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z" />
        </g>
        {/* A borda interna, mais escura: é o vão entre o metal e a tela. */}
        <path
          className="fill-[#0e0f11]"
          d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
        />
      </g>

      {/* A ilhota, FORA da máscara: fica por cima da conversa. */}
      <path
        className="fill-black"
        d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
      />
      <path
        className="fill-[#101113]"
        d="M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
      />
    </svg>
  )
}
