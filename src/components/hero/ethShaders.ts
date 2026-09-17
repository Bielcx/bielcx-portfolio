/**
 * O losango do Ethereum em 3D de verdade — WebGL2, sem biblioteca.
 *
 * É um raymarch de octaedro: a `map` devolve a distância assinada até o sólido,
 * e o laço caminha ao longo do raio até encostar nele. Sessenta passos num
 * canvas de 18px é trabalho nenhum para a GPU, e o arquivo inteiro custa zero
 * byte de dependência — o three.js faria o mesmo desenho por ~120 KB gzip, que
 * é mais que o site todo.
 *
 * **Não é um octaedro regular.** O logo tem a pirâmide de baixo mais longa que
 * a de cima, e é essa assimetria que faz o desenho ser reconhecido de relance.
 * Ela entra dividindo `p.y` por um fator diferente de cada lado da cintura.
 *
 * Dividir um eixo antes de uma SDF quebra a garantia de que a distância é
 * exata — ela passa a ser uma SOBRE-estimativa em algumas direções, e um passo
 * cheio atravessaria a superfície. Por isso o laço anda `d * 0.7` e não `d`.
 * Diminuir esse fator custa passos; aumentar fura a face em ângulo raso.
 *
 * Quem gira é a CÂMERA em volta do objeto, não o objeto: assim a luz fica
 * parada no mundo e as faces acendem e apagam conforme passam por ela, que é
 * o que dá a leitura de volume. Girando o objeto com a luz colada nele, o
 * losango parece um adesivo girando.
 *
 * Roda no casco do `LightBeam`, como o feixe e o campo da hero. Usa `uRes` e
 * `uT`; não declara `uB`.
 *
 * O GLSL mora numa template string: NENHUMA crase abaixo daqui, nem em
 * comentário — a primeira fecha a string e o erro sai como sintaxe TypeScript.
 */

export const ETH_FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform float uT;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// 0.38 e o raio na cintura; 1.25 e 1.70 sao as alturas das duas piramides.
// A altura visivel do quadro em z=0 e 0.76 (ver o 1.7 do rd la embaixo), entao
// a base em 0.38*1.70 = 0.65 cabe com folga. Crescer estes numeros e conferir
// aquele: o corte nao avisa, so decepa a ponta.
float map(vec3 p){
  p.y /= (p.y > 0.0) ? 1.25 : 1.70;
  p = abs(p);
  return (p.x + p.y + p.z - 0.38) * 0.5773;
}

vec3 normalAt(vec3 p){
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

// um raio; devolve rgb no .xyz e cobertura (0 ou 1) no .w
vec4 shoot(vec2 uv){
  vec3 ro = vec3(0.0, 0.0, -2.6);
  vec3 rd = normalize(vec3(uv, 1.70));

  float a = uT * 0.75;
  ro.xz *= rot(a);
  rd.xz *= rot(a);

  float t = 0.0;
  bool hit = false;
  for(int i = 0; i < 64; i++){
    vec3 p = ro + rd * t;
    float d = map(p);
    if(d < 0.0012){ hit = true; break; }
    t += d * 0.7;
    if(t > 6.0) break;
  }
  if(!hit) return vec4(0.0);

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);

  // Luz parada no mundo, vinda de cima e da esquerda — a mesma direcao de onde
  // o campo de filamentos da hero clareia.
  vec3 key = normalize(vec3(-0.55, 0.80, -0.55));
  float diff = max(dot(n, key), 0.0);

  // Preenchimento frio por baixo: sem ele a face oposta a luz fica preta e o
  // losango perde metade do contorno contra o fundo preto do botao.
  float fill = max(dot(n, normalize(vec3(0.5, -0.6, -0.4))), 0.0);

  // Borda acesa: e o que separa a silhueta do preto do card a 18px, onde o
  // sombreamento sozinho nao da contraste suficiente.
  float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.2);

  // Os tres numeros sao o BRILHO A 18px, nao a fisica. Calibrados com o SVG
  // plano que este losango substituiu aberto ao lado: o sombreamento honesto
  // (ambiente 0.22) desenha um volume bonito a 200px e um borrao azul-escuro
  // no tamanho real, porque a face virada para longe da luz ocupa metade de um
  // icone que ja tem so 18 pixels. Mexeu, confira no tamanho real, nao ampliado.
  vec3 base = vec3(0.31, 0.61, 0.94);   // --color-accent-cool
  vec3 col = base * (0.38 + 0.95 * diff) + base * fill * 0.42;
  col += vec3(0.75, 0.88, 1.0) * rim * 0.75;

  return vec4(col, 1.0);
}

void main(){
  // SUPERAMOSTRAGEM 2x2. O canvas tem 18px de CSS (36 de buffer a dpr 2), e um
  // raio por pixel deixa a silhueta em escada — num icone desse tamanho a
  // escada e metade do desenho. Quatro raios por pixel em 36x36 sao ~5 mil
  // raios no total, que e nada.
  vec4 acc = vec4(0.0);
  for(int j = 0; j < 2; j++){
    for(int i = 0; i < 2; i++){
      vec2 sub = (vec2(float(i), float(j)) + 0.25) * 0.5;
      vec2 uv = (gl_FragCoord.xy + sub - 0.5 - 0.5 * uRes) / uRes.y;
      acc += shoot(uv);
    }
  }
  acc *= 0.25;

  // Sem pre-multiplicar: o contexto e criado com premultipliedAlpha: false.
  // acc.rgb ja e a media ponderada pela cobertura, entao dividir por acc.w
  // devolve a cor cheia e deixa o alfa fazer a borda macia sozinho.
  if(acc.w < 0.001) discard;
  o = vec4(acc.rgb / acc.w, acc.w);
}`;
