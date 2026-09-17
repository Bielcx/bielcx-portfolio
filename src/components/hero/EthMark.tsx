import { useState } from "react";

import { Icon } from "../Icon";
import { LightBeam } from "./LightBeam";
import { ETH_FRAG } from "./ethShaders";

/**
 * Há WebGL2 neste navegador? Uma vez por carregamento, num canvas descartável.
 *
 * O `LightBeam` já falha sozinho quando não há contexto — ele avisa no console
 * e não desenha. Para as faixas decorativas isso basta; para o ÍCONE DENTRO DE
 * UM BOTÃO, não: "não desenhar" ali é o botão perder a marca que diz de que
 * site ele fala, e ninguém percebe que quebrou. Por isso a escolha é feita
 * ANTES de montar o canvas, e o SVG plano assume.
 *
 * O canvas é jogado fora sem `loseContext()`. A regra de nunca perder o
 * contexto (ver `LightBeam`) vale para canvas que vão ser reusados; este nasce
 * para a pergunta e morre com ela.
 */
let webgl2: boolean | null = null;
const hasWebgl2 = () => {
  if (webgl2 === null) {
    webgl2 = !!document.createElement("canvas").getContext("webgl2");
  }
  return webgl2;
};

/**
 * O losango do Ethereum do botão da hero, em três degraus:
 *
 *   1. **WebGL2 e movimento permitido** → o octaedro 3D do `ethShaders.ts`,
 *      girando com luz de verdade.
 *   2. **movimento reduzido** → o SVG plano, PARADO. Girar é exatamente o que
 *      `prefers-reduced-motion` pede para não acontecer, e trocar uma animação
 *      CSS que respeitava a preferência por um shader que a ignora seria
 *      regressão — foi o motivo de a decisão morar aqui e não no shader.
 *   3. **sem WebGL2** → o SVG plano com o `eth-spin` de sempre, que é o
 *      comportamento que o site tinha antes deste componente existir.
 *
 * O `eth-glow` vale nos três: é um `drop-shadow` sobre o que o elemento
 * desenhou, e não sabe se veio de um shader ou de um path. Ele existe porque
 * a 18px, dentro de um botão de contorno apagado, a cor própria do ícone quase
 * não aparecia — a nota inteira está no `index.css`.
 *
 * A preferência é lida no inicializador do `useState`, e não num efeito: lida
 * depois, o 3D apareceria por um frame antes de ser trocado pelo SVG, que é o
 * piscada que a preferência existe para evitar. Não há SSR aqui (Vite, SPA),
 * então `window` está sempre de pé. A troca em tempo real da preferência não é
 * ouvida de propósito: vale o que valia quando a página abriu, e quem muda a
 * configuração recarrega.
 */
export function EthMark() {
  const [still] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  if (still || !hasWebgl2()) {
    return (
      <Icon
        name="ethereum"
        className={`eth-glow size-[18px] text-accent-cool ${still ? "" : "eth-spin"}`}
      />
    );
  }

  // O canvas tem o tamanho exato do ícone que substitui. `shrink-0` porque ele
  // vive num flex ao lado do rótulo, e sem isso o botão o esmaga antes de
  // quebrar o texto. O fade de 1,8s das faixas viraria ícone faltando por
  // quase dois segundos dentro de um botão já visível.
  return (
    <LightBeam
      className="eth-glow block size-[18px] shrink-0"
      frag={ETH_FRAG}
      fade={420}
    />
  );
}
