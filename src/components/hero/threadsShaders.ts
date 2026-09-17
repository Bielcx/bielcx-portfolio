/**
 * Fios atravessando a tela — WebGL2.
 *
 * Porte do `WebThreads` do React Bits (reactbits.dev/backgrounds/web-threads),
 * no mesmo casco dos outros (`LightBeam`): `uRes`/`uT` são o
 * `iResolution`/`iTime` de lá, e contexto, resize, observers, perda de contexto
 * e fade de entrada já existem. Sem `ogl`, como o ferrofluido que morou aqui
 * antes e como as ondas do rodapé.
 *
 * O desenho não tem geometria: cada fio é uma senóide em `uv`, e o que acende
 * o pixel é a DISTÂNCIA até ela elevada a uma potência (`glow`). Por isso o
 * fio tem núcleo fino e halo largo sem nenhum blur — a queda é a própria
 * função. Os fios se abrem em leque a partir do meio da tela: a amplitude de
 * cada um é proporcional à distância horizontal até o ponto de aperto, então
 * todos se cruzam no centro e se afastam para os lados.
 *
 * **As cores são as do rodapé**, a pedido: o frio e a menta do tema, os mesmos
 * do `wavesShaders.ts`. As duas pontas do site passam a falar a mesma língua, e
 * o miolo continua preto e branco.
 *
 * **A opacidade é baixa de propósito** — o nome mora exatamente onde os fios se
 * cruzam, que é a parte mais acesa do quadro. Ver a nota do `OPACIDADE`.
 *
 * **O que ficou de fora do original:** o mouse (`uMouse`, `uMouseStrength`),
 * que arrastava o ponto de aperto e acendia um halo sob o cursor — o casco não
 * tem uniform de ponteiro, e pôr um custaria um listener em todos os canvas
 * dele. E o `uLightMode`, um segundo caminho inteiro de cor para fundo claro:
 * este site não tem tema claro, e a nota do `AGENTS.md` explica que não é
 * pendência.
 *
 * O GLSL mora numa template string: NENHUMA crase dentro dela.
 */

/** `--color-accent-cool`, #4f9bf0 — o mesmo corpo das ondas do rodapé. */
const COR_1 = "vec3(0.310, 0.608, 0.941)";
/** `--color-accent-mint`, #74d6b4 — a mesma crista. */
const COR_2 = "vec3(0.455, 0.839, 0.706)";
/**
 * O núcleo onde os fios se somam. No original é BRANCO, e aqui não pode ser:
 * ele acende justamente no meio da tela, que é onde o leque aperta e onde o
 * nome mora. Branco ali é a única coisa da hero que não é nem o nome nem preto,
 * e o efeito deixava de ter a cor do rodapé no lugar em que mais se vê.
 * Virou a menta, a mesma crista das ondas de lá.
 */
const COR_3 = "vec3(0.455, 0.839, 0.706)";

const VELOCIDADE = "0.2";
/** Fios. O original aceita até 10; 6 é o padrão dele. */
const FIOS = 6;
const FREQUENCIA = "5.0";
/** Abertura do leque e quanto cada fio abre mais que o anterior. */
const ABERTURA = "0.18";
const PROGRESSAO = "1.0"; // taper
/**
 * Altura em que o leque aperta, em fração da tela contada DE BAIXO.
 *
 * 0.62 é o meio do bloco de texto: ele ocupa de 0.53 a 0.70, então o nó dos
 * fios fica atrás das letras, e não no vão entre o nome e os botões, que é
 * onde os 0.5 do original o deixavam. Foi pedido assim — o efeito atrás do
 * nome, não embaixo dele —, e é por isso que o nome ganhou sombra: sem ela o
 * ponto mais aceso do quadro passa a bater exatamente no texto.
 */
const POSICAO = "0.62";
const BRILHO_FIO = "0.02"; // glow
const QUEDA = "0.6"; // falloff
const ESPESSURA = "1.1";
const BRILHO = "0.6";
/**
 * O número que este efeito existe para acertar, e ele foi medido três vezes
 * antes de parar aqui.
 *
 * 0.28 era o valor cauteloso, e ficou INVISÍVEL na tela de verdade: pico de 61
 * em 255 e média 7,5 — um fio de 1px nessa intensidade some no preto, mesmo
 * aparecendo no print. Foi o mesmo erro que as ondas do rodapé cometeram, de
 * proteger o texto antes de saber se o efeito se via.
 *
 * 0.55 dá pico 111 e 0.80 dá 180. Ficou em 0.80 até o nó dos fios subir para
 * trás do nome (`POSICAO`), e aí veio descendo — 0.62, depois 0.45 — porque com
 * o ponto quente batendo no texto o mesmo valor deixou de ser o mesmo efeito.
 * 0.45 dá pico na casa dos 100, contra os ~240 do `text-ink-bright`.
 *
 * Quem segura o contraste do nome hoje NÃO é este número — é a sombra preta do
 * `Hero.tsx`, que abre um vão escuro em volta das letras. Este número decide só
 * quanto o fio se vê no preto. Mexeu num, olhe o outro.
 */
const OPACIDADE = "0.45";
const GRAO = "0.05";

export const THREADS_FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform float uT;

#define TAU 6.28318530718

// nucleo fino + halo largo sem blur: a queda e a propria funcao
float brilho(float x, float forca, float dist){
  return dist / pow(max(x, 1e-4), forca);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;

  // o leque aperta no meio da tela e abre para os lados
  float aperto = 0.5;
  float dx = ${ABERTURA} * abs(uv.x - aperto);
  float t = uT * ${VELOCIDADE};
  float passo = TAU / float(${FIOS});
  // espelha a fase de um lado para o outro: os fios se cruzam em vez de
  // correrem paralelos
  float espelho = sign(aperto - uv.x);
  float invEsp = 1.0 / max(${ESPESSURA}, 0.01);
  float xf = uv.x * ${FREQUENCIA};
  float dy = uv.y - ${POSICAO};

  vec3 col = vec3(0.0);
  float soma = 0.0;

  for (int i = 0; i < ${FIOS}; i++){
    float fi = float(i);
    float amp = dx * (1.0 + fi * ${PROGRESSAO});
    float fase = (t + fi * passo) * espelho;
    float sdf = abs(dy + sin(xf + fase) * amp) * invEsp;

    float g = brilho(sdf, ${QUEDA}, ${BRILHO_FIO});
    col += g * mix(${COR_1}, ${COR_2}, fi / float(${FIOS} - 1));
    soma += g;
  }

  // onde varios fios se sobrepoem, o feixe satura para o nucleo
  col = mix(col, ${COR_3} * soma, smoothstep(0.5, 2.2, soma) * 0.5);
  col *= ${BRILHO};

  float a = clamp(soma, 0.0, 1.0) * ${OPACIDADE};
  float gr = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uT) * 43758.5453) - 0.5) * ${GRAO};

  // o casco mistura com SRC_ALPHA/1-SRC_ALPHA, entao a cor sai NAO
  // pre-multiplicada — o original devolve col*alpha porque monta o seu proprio
  o = vec4(clamp(col + gr, 0.0, 1.0), clamp(a + gr, 0.0, 1.0));
}`;
