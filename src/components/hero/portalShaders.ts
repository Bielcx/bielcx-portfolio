/**
 * O PORTAL — a passagem para o portfólio web3.
 *
 * Um anel verde girando que abre do meio da tela e engole o quadro. A
 * referência é o portal do Rick and Morty, e ela é DELIBERADA: o botão que o
 * dispara é o único do site que fala com quem é do meio, e é o lugar onde uma
 * piscadela dessas cabe sem confundir o visitante comercial, que nunca chega a
 * clicar ali.
 *
 * Roda no casco do `LightBeam`, como os outros: usa `uRes`, `uT` e — este é o
 * primeiro shader do site a usar — o `uB`, que o casco alimenta a partir de um
 * REF. É o que permite uma animação dirigida por progresso em vez de por
 * tempo: quem manda no `uB` é o `Portal.tsx`, que também decide a hora de
 * navegar.
 *
 * **O miolo é `#111111`, e isso não é escolha de cor.** É o fundo que o site
 * de destino pinta no primeiro quadro (medido no HTML dele). Quando o portal
 * enche a tela, o que está em quadro já é a cor da página que vai entrar — a
 * emenda entre os dois sites cai em escuro sobre escuro, que é o mesmo
 * raciocínio da cortina do `Metodo`.
 *
 * **As duas origens são diferentes**, então não há transição nativa entre os
 * documentos (`@view-transition` só funciona same-origin). A passagem é uma
 * ilusão em duas metades: esta, e um dia a chegada, do outro lado.
 *
 * O GLSL mora numa template string: NENHUMA crase abaixo daqui, nem em
 * comentário — a primeira fecha a string e o erro sai como sintaxe TypeScript.
 */

/** Verde ácido do portal, na borda. */
const VERDE = 'vec3(0.592, 0.839, 0.310)';
/** Menta do tema, no corpo do anel — o que amarra o efeito ao resto do site. */
const MENTA = 'vec3(0.455, 0.839, 0.706)';
/** O fundo do site de destino. Ver a nota acima: não é gosto, é medida. */
const DESTINO = 'vec3(0.067, 0.067, 0.067)';

export const PORTAL_FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform float uT;
uniform float uB;

// ruido de valor, o mesmo de sempre: hash + interpolacao suave
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  // centrado e corrigido pela proporcao: o portal e redondo em qualquer tela
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  // o centro desce um pouco: e de onde o botao esta, nao do meio geometrico
  uv.y += 0.06;

  float r = length(uv);
  float ang = atan(uv.y, uv.x);

  // O RAIO CRESCE COM O PROGRESSO. O 1.15 e a diagonal em unidades de
  // min(lado): com uB = 1 o anel ja saiu dos quatro cantos, e por isso a tela
  // fica inteira com a cor do destino antes de a navegacao acontecer.
  float R = uB * 1.15;

  // a turbulencia mora em coordenadas polares: o anel vira redemoinho, e nao
  // um circulo com ruido por cima. O termo em r faz as linhas se torcerem para
  // dentro, que e o que da o movimento de funil.
  float giro = fbm(vec2(ang * 1.6 + r * 3.0 - uT * 0.9, r * 2.4 - uT * 0.35));
  float borda = R * (1.0 + 0.16 * (giro - 0.5));

  // ANEL: uma faixa em volta do raio, mais grossa quanto maior o portal.
  float esp = 0.055 + 0.10 * uB;
  float anel = 1.0 - smoothstep(0.0, esp, abs(r - borda));
  anel = pow(anel, 1.7);

  // filamentos correndo dentro do anel
  float fio = fbm(vec2(ang * 5.0 - uT * 1.6, r * 6.0));
  anel *= 0.55 + 0.75 * fio;

  vec3 cor = mix(${MENTA}, ${VERDE}, clamp(fio * 1.2, 0.0, 1.0));

  // DENTRO: a cor do site que vai entrar, com o verde sangrando da borda para
  // dentro. E o que faz a tela ja estar na cor do destino quando ele carrega.
  float dentro = 1.0 - smoothstep(borda - esp * 1.4, borda, r);
  vec3 miolo = mix(${DESTINO}, cor * 0.55, dentro * (1.0 - dentro) * 1.6);

  vec3 col = mix(miolo, cor, clamp(anel, 0.0, 1.0));

  // FORA do portal nao se pinta nada: a hero continua aparecendo ate a aresta
  // chegar nela. O halo de 0.09 e o brilho que vaza para fora da boca.
  float alfa = clamp(dentro + anel, 0.0, 1.0);
  alfa = max(alfa, (1.0 - smoothstep(borda, borda + 0.09, r)) * anel);

  o = vec4(col * (0.85 + 0.5 * anel), alfa);
}
`;
