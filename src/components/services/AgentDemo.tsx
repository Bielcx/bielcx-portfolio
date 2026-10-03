import { useEffect, useRef, useState } from 'react'

import { services } from '../../data/content'
import video from '../../assets/automacao/agente.mp4'
import poster from '../../assets/automacao/agente-poster.webp'

/**
 * O agente de atendimento, funcionando — o painel da faixa de automação.
 *
 * Um celular rodando, em loop, um vídeo de 15 segundos: o cliente pergunta
 * por horário, o agente consulta a agenda, responde com horário de verdade e
 * reserva; do outro lado, a agenda do negócio se preenche sozinha. A linha
 * do agente na lista ao lado é a mais difícil de vender por escrito, e
 * o vídeo a explica num relance, sem pedir clique.
 *
 * O vídeo é RENDERIZADO, não gravado: uma animação em HTML movida por um
 * relógio determinístico, fotografada quadro a quadro e codificada em H.264.
 * O código-fonte dele não mora aqui; o `.mp4` e o cartaz são o artefato.
 *
 * Antes do vídeo havia aqui uma conversa clicável, com respostas
 * roteirizadas. Está no git.
 */

/**
 * As medidas do aparelho, na grade do desenho do Magic UI (ver `Moldura`, no
 * fim do arquivo). A tela é posicionada em PORCENTAGEM delas, e não em pixel:
 * é o que mantém o conteúdo colado à moldura em qualquer largura. O vídeo é
 * 540×1170, a mesma proporção da tela (389,5×843,5).
 */
const LARGURA = 433
const ALTURA = 882
const TELA_X = 21.25
const TELA_Y = 19.25
const TELA_W = 389.5
const TELA_H = 843.5
const RAIO = 55.75

const pct = (parte: number, todo: number) => (parte / todo) * 100

export function AgentDemo() {
  const { eyebrow, video: descricao, note, pausar, continuar } = services.agente

  /* Movimento reduzido: só o cartaz, sem vídeo. Lido uma vez, como no `EthMark`. */
  const [parado] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const ref = useRef<HTMLVideoElement>(null)
  /* Pausado por quem olha — o observer abaixo não pode dar play por cima disso. */
  const [pausado, setPausado] = useState(false)
  const pausadoRef = useRef(false)

  /* Fora de quadro, pausa: vídeo rodando onde ninguém vê é bateria e CPU à toa. */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !pausadoRef.current) el.play().catch(() => {})
      else el.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Loop automático precisa de como parar (WCAG 2.2.2), e o movimento
     reduzido não cobre quem não sabe que a preferência existe. */
  const alternar = () => {
    const el = ref.current
    if (!el) return
    pausadoRef.current = !pausadoRef.current
    setPausado(pausadoRef.current)
    if (pausadoRef.current) el.pause()
    else el.play().catch(() => {})
  }

  const tela = {
    left: `${pct(TELA_X, LARGURA)}%`,
    top: `${pct(TELA_Y, ALTURA)}%`,
    width: `${pct(TELA_W, LARGURA)}%`,
    height: `${pct(TELA_H, ALTURA)}%`,
    /* `X% / Y%`: a tela não é quadrada, e com um valor só o canto sai oval. */
    borderRadius: `${pct(RAIO, TELA_W)}% / ${pct(RAIO, TELA_H)}%`,
  }

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
          {parado ? (
            <img
              src={poster}
              alt={descricao}
              className="absolute bg-black object-cover"
              style={tela}
            />
          ) : (
            <video
              ref={ref}
              src={video}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={descricao}
              className="absolute bg-black object-cover"
              style={tela}
            />
          )}

          <Moldura />
        </div>
      </div>

      {!parado && (
        <button
          type="button"
          onClick={alternar}
          className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55 transition-colors hover:text-ink"
        >
          {pausado ? continuar : pausar}
        </button>
      )}

      {/* FORA do telefone, de propósito: é o site falando com quem olha, e não
          o negócio fictício falando com o cliente dele. */}
      <p className="mt-9 max-w-md border-t border-white/8 pt-6 text-center text-[13px] leading-relaxed text-ink/60">
        {note}
      </p>
    </div>
  )
}

/**
 * A moldura do iPhone — porte do componente do Magic UI, como o `LightBeam` e
 * o `DriftWall` são portes do React Bits.
 *
 * O `furo` vaza o retângulo da tela do corpo do aparelho, e o vídeo aparece
 * por baixo. A ilhota é desenhada FORA do grupo mascarado, e por isso continua
 * por cima do vídeo, que é onde ela fica num telefone de verdade — o vídeo foi
 * desenhado com esse respiro no alto.
 *
 * `pointer-events-none`: o SVG cobre o aparelho inteiro, furo incluído, e
 * sem isso ele come o clique de botão direito e o "abrir vídeo" do navegador.
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

      {/* A ilhota, FORA da máscara: fica por cima do vídeo. */}
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
