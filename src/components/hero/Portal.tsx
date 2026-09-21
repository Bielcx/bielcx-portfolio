import { useEffect, useRef } from 'react'

import { LightBeam } from './LightBeam'
import { PORTAL_FRAG } from './portalShaders'

/**
 * O PORTAL, e as três decisões que ele carrega.
 *
 * **1. Ele navega no MEIO da animação, não no fim.** A navegação entre origens
 * diferentes não é instantânea: o navegador continua mostrando esta página até
 * o destino pintar o primeiro quadro. Disparando em `NAVEGA` (72% do percurso),
 * os últimos quadros do portal rodam DURANTE esse intervalo, e o que seria
 * espera vira parte do efeito. O destino responde em ~50ms e pinta `#111111`,
 * a mesma cor que o miolo do portal já está mostrando.
 *
 * **2. Ele é curto.** 900ms é o teto do que se pode cobrar de quem só queria
 * clicar num link. Quem já conhece o outro site vai clicar de novo, e aí a
 * animação vira pedágio — por isso não há nada aqui para "pular": ela acaba
 * antes de dar vontade.
 *
 * **3. Com movimento reduzido ele não existe.** Não é um portal mais lento: é
 * o link normal, e quem decide isso é o `Hero.tsx`, que nem chega a montar
 * este componente. Um redemoinho em tela cheia é exatamente o tipo de coisa
 * que a preferência do sistema está pedindo para não acontecer.
 */

/** Duração total, em ms. */
const DURACAO = 900
/** Fração do percurso em que a navegação dispara. */
const NAVEGA = 0.72

export function Portal({ href }: { href: string }) {
  /* O casco do `LightBeam` lê o progresso de um REF a cada quadro (vira o
     uniform `uB`), então nada aqui re-renderiza: o React monta uma vez e o
     resto é o loop do canvas. */
  const progresso = useRef(0)

  useEffect(() => {
    let raf = 0
    let foi = false
    const inicio = performance.now()

    const quadro = (agora: number) => {
      const t = Math.min((agora - inicio) / DURACAO, 1)
      // easeOutCubic: a boca abre rápido e assenta, em vez de crescer linear
      progresso.current = 1 - Math.pow(1 - t, 3)

      if (!foi && t >= NAVEGA) {
        foi = true
        window.location.href = href
      }

      if (t < 1) raf = requestAnimationFrame(quadro)
    }

    raf = requestAnimationFrame(quadro)
    return () => cancelAnimationFrame(raf)
  }, [href])

  return (
    <div
      aria-hidden
      /* `fixed` e não `absolute`: o portal é da TELA, não da hero — ele
         precisa cobrir o menu e o que já estiver rolado. O `z-[60]` é acima do
         botão do menu, que também é `z-50`: no empate quem vem depois no DOM
         ganha, e depender dessa ordem é o tipo de coisa que quebra quando
         alguém reordena o `App.tsx`. Sem `pointer-events`, para o clique não
         cair em nada enquanto a página está de saída. */
      className="pointer-events-none fixed inset-0 z-[60]"
    >
      {/* `fade` em 0: o portal já nasce visível. Os 1,8s do padrão são de uma
          faixa decorativa aparecendo, e aqui eles comeriam a animação
          inteira. */}
      <LightBeam
        className="block size-full"
        frag={PORTAL_FRAG}
        opening={progresso}
        fade={0}
      />
    </div>
  )
}
