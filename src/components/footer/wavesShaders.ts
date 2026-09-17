/**
 * Ondas em degradê — WebGL2.
 *
 * Porte do `GradientWaves` do React Bits
 * (reactbits.dev/backgrounds/gradient-waves), que lá é um componente com `ogl`
 * e ~20 props. Aqui é só o fragment shader, no mesmo casco que o ferrofluido
 * do hero usa (`LightBeam`): contexto, resize, observers, perda de contexto e
 * fade de entrada já existem, e os uniforms `uRes`/`uT` são os
 * `iResolution`/`iTime` do original com outro nome. Sem dependência nova, pelo
 * mesmo motivo de sempre — o repositório desenha em WebGL2 puro.
 *
 * O desenho é um RAYMARCH: para cada pixel sai um raio da câmera e ele avança
 * até esbarrar numa superfície definida por duas senóides cruzadas (`plasma`).
 * O que dá o volume não é textura, é a distância percorrida — quanto mais
 * longe o raio anda, mais o `uFogDepth` puxa a cor para a do horizonte. É daí
 * que vem o degradê, e é por isso que ele acompanha a forma da onda em vez de
 * ser um gradiente por cima dela.
 *
 * **As cores são as do site, não as da demo.** Lá o padrão é roxo com rosa
 * (`#5227FF`/`#FF9FFC`), que não existe em lugar nenhum daqui. O horizonte é o
 * preto da página, para a onda nascer do fundo em vez de flutuar sobre ele, e
 * o corpo e a crista são os dois acentos que o tema já tem — o frio e a menta.
 * O quente fica de fora: ele é da primeira faixa da seção 03, e trazê-lo para
 * o rodapé o transformaria em cor de página.
 *
 * **O que ficou de fora do original:** o mouse (`uMouse`, `uParallax`), que
 * girava a câmera com o ponteiro. O casco do `LightBeam` não tem uniform de
 * ponteiro, e acrescentá-lo custaria um listener em todos os canvas dele,
 * inclusive o losango de 18px do botão do hero. O grão FICOU: é uma linha, e
 * sem ele o degradê exibe banding nas faixas largas de cor escura.
 *
 * ponytail: as props viraram constantes com os valores da demo, menos as
 * cores e o brilho. Mexer no visual é mexer aqui.
 *
 * O GLSL mora numa template string: NENHUMA crase dentro dela.
 */

/** Cor do fundo distante. Preto: a onda nasce da página. */
const HORIZONTE = "vec3(0.0, 0.0, 0.0)";
/** Corpo da onda — `--color-accent-cool`, #4f9bf0. */
const ONDA = "vec3(0.310, 0.608, 0.941)";
/** Crista — `--color-accent-mint`, #74d6b4. */
const CRISTA = "vec3(0.455, 0.839, 0.706)";

const VELOCIDADE = "0.4";
const AMPLITUDE = "2.5";
/** `freq` = (escala/7, escala × razão/3), com escala 0.6 e razão 0.9. */
const FREQ = "vec2(0.6 / 7.0, (0.6 * 0.9) / 3.0)";
const ONDULACAO = "35.0"; // swell
const TURBULENCIA = "20.0";
const INCLINACAO = "1.11"; // tilt
const ZOOM = "1.0";
const ALTURA = "5.5";
const NEVOA = "48.0"; // fogDepth
/**
 * Passos do raymarch. 70 é o `detail: medium` da demo, e o `high` dela é 110.
 * Testei os 110: o quadro sai IDÊNTICO. O serrilhado da crista não vem de
 * passos de menos — vem da tolerância `abs(d) < 0.1`, que quantiza a distância
 * onde o raio chega raspando a superfície. Subir daqui é pagar GPU por nada.
 */
const PASSOS = 70;
/**
 * Teto da proporção usada na lente, e é o que faz a onda ENCOSTAR nas pontas
 * de baixo do cartão.
 *
 * O original faz `uv.x *= largura/altura` e depois curva o raio por `ulen`, a
 * distância do pixel ao centro. Numa tela de proporção normal isso é a lente
 * esférica que dá o horizonte curvo. No cartão do rodapé, que é uma tira de
 * quase 4:1, `uv.x` chega a ±1.9 e `ulen` a quase 2 nos cantos: o raio gira
 * mais de 150° e sai apontando para cima, longe da superfície. Escapa, a
 * névoa não tem distância para trabalhar e o canto fica PRETO — medido, era
 * 0,0,0 nos dois cantos inferiores.
 *
 * Limitando a proporção, os cantos voltam para dentro do alcance da lente. O
 * preço é que a cena estica na horizontal numa tira muito larga, e num fundo
 * abstrato isso não tem como ser percebido.
 */
const ASPECTO_MAX = "1.7";
/**
 * Brilho e opacidade, os dois abaixo do padrão (1.0 nos dois). O rodapé é o
 * fecho de uma página preta: no valor cheio a onda vira a coisa mais clara do
 * site e engole o "Bom trabalho continua rendendo" que mora por cima dela.
 */
const BRILHO = "0.55";
const OPACIDADE = "1.0";
const GRAO = "0.05";

export const WAVES_FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform float uT;

const float MAX_DIST = 20000.0;

float hash21(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// A superficie: duas senoides cruzadas, cada uma arrastada no tempo por um
// termo proprio. O retorno e a distancia (com sinal) do ponto ate ela.
float plasma(vec3 r, vec4 tc){
  float mx = r.x + tc.x;
  mx += ${ONDULACAO} * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += ${TURBULENCIA} * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * ${FREQ}.x) * ${AMPLITUDE}
              + sin(my * ${FREQ}.y) * ${AMPLITUDE}
              + ${ALTURA});
}

float raymarch(vec3 pos, vec3 dir, vec4 tc){
  float dist = 0.0;
  for (int i = 0; i < ${PASSOS}; i++){
    float d = plasma(pos + dist * dir, tc);
    if (abs(d) < 0.1) break;
    // 0.9 e nao 1.0: passo cheio ultrapassa a superficie em rampa inclinada
    dist += 0.9 * d;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main(){
  float T = uT * ${VELOCIDADE};
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;

  float vfov = (3.14159 / 2.3) / max(${ZOOM}, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / uRes) - 0.5;
  uv.x *= min(uRes.x / uRes.y, ${ASPECTO_MAX});
  uv.y *= -1.0;

  // A direcao do raio: inclina pelo raio do pixel ate o centro, gira para o
  // angulo dele e por fim deita a camera pelo tilt. E uma lente esferica, e e
  // o que curva o horizonte nas bordas.
  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(${INCLINACAO}); s = sin(${INCLINACAO});
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  float dist = raymarch(cam, dir, tc);
  vec3 pos = cam + dist * dir;

  // quanto mais longe o raio andou, mais a cor vira horizonte: e o degrade
  float t = clamp(${NEVOA} / max(dist, 0.001), 0.0, 1.0);
  vec3 corpo = mix(${ONDA}, ${CRISTA}, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = clamp(mix(${HORIZONTE}, corpo, t) * ${BRILHO}, 0.0, 1.0);

  float a = clamp(t, 0.0, 1.0) * ${OPACIDADE};
  // grao: sem ele as faixas largas de cor escura exibem banding
  a += (hash21(gl_FragCoord.xy + mod(uT, 64.0) * 11.0) - 0.5) * ${GRAO};

  // alfa NAO pre-multiplicado: o casco mistura com SRC_ALPHA/1-SRC_ALPHA, e
  // devolver col*a aqui multiplicaria duas vezes e escureceria tudo
  o = vec4(col, clamp(a, 0.0, 1.0));
}`;
