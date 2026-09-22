import { Icon } from '../components/Icon'
import { SpecularButton } from '../components/SpecularButton'
import { LightBeam } from '../components/hero/LightBeam'
import { WAVES_FRAG } from '../components/footer/wavesShaders'
import { footer } from '../data/content'

/**
 * Rodapé em RETÂNGULO: um cartão de cantos arredondados dentro da página, com
 * as ondas em degradê (`wavesShaders.ts`) desenhadas atrás do conteúdo.
 *
 * Ele não é mais uma faixa de largura inteira colada no pé: tem a largura da
 * seção acima (`max-w-6xl` e o mesmo `px` do `Services`), e o preto da página
 * aparece em volta como moldura, e é essa moldura que faz o rodapé ler como um
 * OBJETO que fecha a leitura, e não como a página acabando sem aviso. Foi
 * também o que permitiu o fundo animado: numa faixa sangrada, uma onda azul
 * atravessando a tela de ponta a ponta é uma segunda página; contida num
 * retângulo, é o fecho.
 *
 * **A linha de links e o copyright ficam FORA do cartão**, no preto da página,
 * e é onde eles pertencem: são a etiqueta da página, não o convite. Dentro do
 * retângulo mora só o que convida — título, lede e os dois contatos. Foi a
 * saída deles que deixou o cartão encolher; antes ele precisava de altura só
 * para a linha de links não encostar no botão.
 *
 * Em três camadas, de baixo para cima:
 *   1. o preto do cartão (`bg-frame`), que é o que a onda tem por trás
 *   2. o canvas das ondas, cobrindo o cartão inteiro
 *   3. o conteúdo: CTA, e-mail, linha de links e copyright
 *
 * O `overflow-hidden` do cartão é quem recorta a onda no arredondado — o
 * canvas é um retângulo reto e não sabe do raio.
 *
 * A palavra gigante em contorno que já morou aqui virou o H1 do hero. Repetida
 * nas duas pontas ela deixava de ser o retrato da marca e virava textura.
 */
export function Footer() {
  return (
    /* O padding do <footer> é a moldura preta. Ele fica FORA do cartão, e não
       como margem do cartão, para o `id="contato"` do menu continuar levando
       ao topo da moldura e não a um ponto dentro dela. */
    /* `px-6 sm:px-10` e `max-w-6xl` são as MEDIDAS DA SEÇÃO 03, repetidas:
       o cartão fecha exatamente na mesma coluna em que as faixas de serviço
       terminam. Mexeu lá, mexa aqui — são dois arquivos dizendo a mesma
       largura, e o desalinhamento não aparece em nenhum dos dois sozinho. */
    <footer id="contato" className="px-6 pt-3 sm:px-10 md:pt-5">
      <div className="relative isolate mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-[28px] border border-white/8 bg-frame px-6 py-[clamp(34px,5vh,64px)] md:rounded-[36px] md:px-12">
        <LightBeam
          className="pointer-events-none absolute inset-0 z-0"
          frag={WAVES_FRAG}
        />

        {/* Véu no pé do cartão. A onda é mais clara justamente embaixo, que é
            onde mora a linha de links — sem ele aquele texto miúdo em
            `text-ink/50` caía em cima da parte mais acesa do degradê. Aquela
            linha saiu do cartão, mas o véu fica: é ele que assenta a onda na
            borda de baixo em vez de ela ser cortada acesa pelo arredondado.
            Fica ENTRE o canvas e o conteúdo. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-24 bg-linear-[180deg,transparent,rgba(0,0,0,0.75)]"
        />

        <div className="relative z-2 max-w-[820px] text-center">
          <h2 className="mb-5 font-serif text-[clamp(24px,3vw,38px)] font-normal leading-[1.08] text-ink-bright">
            {/* a segunda linha em itálico: o serifado do rodapé é o único lugar
                do site com esse contraste */}
            {footer.title.map((line, i) => (
              <span key={line} className={`block ${i === 1 ? 'italic' : ''}`}>
                {line}
              </span>
            ))}
          </h2>

          <p className="mb-7 text-[13px] leading-relaxed text-ink/60">
            {footer.lede.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <SpecularButton
            href={footer.cta.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/8 bg-surface-raised px-5 py-2.5 text-[13px] text-ink hover:border-white/25"
          >
            <Icon name="whatsapp" className="size-4" />
            {footer.cta.label}
          </SpecularButton>

          {/* Link de texto, e não um segundo botão — a razão está no
              `content.pt.ts`, junto da copy. */}
          <p className="mt-4 text-[12px] text-ink/60">
            {footer.email.prefix}{' '}
            <a
              href={`mailto:${footer.email.address}`}
              className="text-ink/70 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/50"
            >
              {footer.email.address}
            </a>
          </p>
        </div>

      </div>

      {/* Fora do cartão, direto no preto da página: etiqueta, não convite.
          Sem véu e sem onda atrás, então volta a ser texto claro sobre preto e
          dispensa o reforço de contraste que precisava lá dentro. */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-7 gap-y-2 py-7 text-[11px] uppercase tracking-[0.1em] text-ink/55">
        {footer.links.map((link) => {
          const external = link.href.startsWith('http')

          return (
            <a
              key={link.label}
              href={link.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          )
        })}
        <span>{footer.legal}</span>
      </div>
    </footer>
  )
}
