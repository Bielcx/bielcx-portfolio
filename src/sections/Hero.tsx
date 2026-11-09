import { hero, whatsappUrl } from '../data/content'

/**
 * A primeira tela, limpa: título, uma linha de apoio, um botão e três números
 * no pé. Nada animado além do brilho do botão (`.cta-whats`, no `index.css`).
 *
 * Substituiu, em 09/11/2026, a hero com o nome gigante no centro, os quatro
 * cards ligados por cabos e o botão Web3 com o portal — o dono quis algo "bem
 * clean". Tudo aquilo está no git (Cables, EthMark, Portal, useHeroScroll).
 *
 * A seção é transparente: o fundo e a luz da primeira tela vêm do
 * `components/Fundo.tsx`, atrás da página inteira. `id="topo"` é o alvo do
 * "Início" no menu.
 */
export function Hero() {
  return (
    <section id="topo" className="relative flex min-h-svh flex-col justify-center px-6 pb-16 pt-28 md:px-[8vw]">
      <h1 className="max-w-[14ch] font-display text-[clamp(44px,7.4vw,108px)] font-bold leading-[0.98] tracking-[-0.04em] text-ink-bright">
        {hero.title}
      </h1>
      <p className="mt-7 max-w-[46ch] text-[clamp(17px,1.5vw,21px)] leading-[1.5] text-ink/70">
        {hero.subtitle}
      </p>
      <div className="mt-10">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-whats inline-flex items-center gap-3 rounded-full bg-ink-bright px-7 py-4 text-[15px] font-medium text-black"
        >
          {hero.cta} <span className="cta-seta" aria-hidden="true">→</span>
        </a>
      </div>

      {/* Os números ficam no pé da tela, longe do botão: o espaço vazio entre
          os dois é o que deixa a tela limpa. Texto pequeno não desce de /55
          (4,5:1 de contraste sobre o preto). */}
      <ul className="mt-auto grid grid-cols-3 gap-6 border-t border-white/10 pt-6 md:max-w-[760px]">
        {hero.provas.map((p) => (
          <li key={p.numero}>
            <b className="block text-[clamp(20px,2vw,28px)] font-bold tracking-[-0.03em] text-ink-bright">{p.numero}</b>
            <span className="mt-1 block text-[13px] leading-[1.4] text-ink/55">{p.legenda}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
