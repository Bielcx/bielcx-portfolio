import { useEffect, useRef, useState } from "react";

/**
 * O vertex shader é o mesmo para QUALQUER shader de tela cheia daqui: um
 * triângulo que cobre o viewport, sem transformação. Morava num arquivo ao
 * lado junto com o `BEAM_FRAG` (o feixe de luz do rodapé antigo); o fragment
 * saiu quando o rodapé virou ondas, e um arquivo para duas linhas de GLSL
 * deixou de se justificar.
 */
const BEAM_VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

/**
 * Faixa horizontal com o feixe de luz renderizado em WebGL2.
 * O canvas entra com fade suave assim que o primeiro frame é desenhado.
 *
 * `className` é o wrapper INTEIRO, não um acréscimo a um wrapper fixo. Era
 * fixo (`absolute left-1/2 w-screen -translate-x-1/2`), o que só servia a quem
 * atravessa a tela; o losango do botão da hero é um canvas de 18px no fluxo, e
 * `w-screen` não se desfaz por outra classe — a ordem das props não decide
 * quem ganha no CSS. Quem chama passa a posição toda, e as duas faixas de
 * largura cheia repetem as classes de antes.
 *
 * Se o WebGL2 não estiver disponível (ou o shader falhar), o componente apenas
 * não desenha nada. Para as faixas decorativas isso basta — a seção segue de
 * pé. Para um ÍCONE não basta, e por isso o `EthMark` decide fora daqui, antes
 * de montar, se há WebGL2: um botão sem a sua marca é defeito, não degradação.
 *
 * `fade` é a duração do fade de entrada. As faixas entram em 1,8s, que é o
 * tempo de uma coisa grande aparecendo; num ícone dentro de um botão isso lê
 * como carregamento travado.
 *
 * `frag` troca o fragment shader sem duplicar nada deste arquivo — o casco
 * (contexto, resize, observers, perda de contexto) é o mesmo para qualquer
 * shader de tela cheia que use os uniforms `uRes`/`uT`. É por aqui que entram
 * os fios do hero, as ondas do rodapé e o losango do botão. Não há valor
 * padrão: o feixe que era o padrão saiu do site, e um padrão que ninguém passa
 * é só um shader a mais no bundle. Uniform que o shader não
 * declarar vira `null` no `getUniformLocation`, e `uniform1f(null, …)` é
 * no-op — por isso o `uB` continua sendo setado a cada frame sem condicional.
 *
 * `opening` é a abertura do feixe (0→1), e chega como REF, não como prop de
 * valor: quem a escreve é o loop do `useHeroScroll`, a cada frame, e um estado
 * de React aqui significaria uma re-renderização por frame. O loop daqui lê o
 * `.current` na hora de montar o uniform. Sem ela — o caso do rodapé — o feixe
 * fica em zero e desenha o de sempre.
 */
export function LightBeam({
  className = "pointer-events-none absolute left-1/2 top-[6vh] z-[1] h-[88vh] w-screen -translate-x-1/2",
  frag,
  fade = 1800,
  opening,
}: {
  className?: string;
  /** Obrigatório: não há mais shader padrão. */
  frag: string;
  fade?: number;
  opening?: { current: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      console.warn("WebGL2 indisponível — hero segue sem o feixe de luz.");
      return;
    }

    const shaders: WebGLShader[] = [];
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let observer: ResizeObserver | null = null;
    let viewport: IntersectionObserver | null = null;
    let raf = 0;
    let fadeIn = 0;
    let last = 0;
    let elapsed = 0;

    /** Libera o que foi criado, mas NUNCA perde o contexto: `getContext` devolve
     *  sempre o mesmo objeto para este canvas, e um contexto perdido não
     *  compila mais nada no remount (StrictMode monta o efeito duas vezes). */
    const dispose = () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fadeIn);
      observer?.disconnect();
      viewport?.disconnect();
      shaders.forEach((shader) => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };

    /**
     * Monta shaders, buffer e observers. É chamada de novo quando o navegador
     * devolve o contexto: o que existia antes foi invalidado junto com ele.
     */
    const build = () => {
      try {
        const compile = (type: number, src: string) => {
          const shader = gl.createShader(type);
          if (!shader) throw new Error("não foi possível criar o shader");
          shaders.push(shader);
          gl.shaderSource(shader, src);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(
              gl.getShaderInfoLog(shader) || "shader não compilou",
            );
          }
          return shader;
        };

        program = gl.createProgram();
        if (!program) throw new Error("não foi possível criar o programa");
        gl.attachShader(program, compile(gl.VERTEX_SHADER, BEAM_VERT));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(
            gl.getProgramInfoLog(program) || "programa não linkou",
          );
        }
        gl.useProgram(program);

        // um triângulo que cobre o viewport inteiro
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 3, -1, -1, 3]),
          gl.STATIC_DRAW,
        );
        const loc = gl.getAttribLocation(program, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const uRes = gl.getUniformLocation(program, "uRes");
        const uT = gl.getUniformLocation(program, "uT");
        const uB = gl.getUniformLocation(program, "uB");

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let bufW = 0;
        let bufH = 0;

        /**
         * O canvas é medido pela viewport (`w-screen` + `vh`), não pelo card: o
         * padding do card cresce com o scroll e, se o elemento acompanhasse, o
         * buffer de desenho seria realocado a cada frame — era isso que fazia o
         * feixe piscar. Quem recorta o feixe nas bordas continua sendo o
         * `overflow-hidden` do card, então o efeito é o mesmo.
         *
         * Sobrando só o redimensionamento real da janela, o buffer pode ter o
         * tamanho exato do elemento.
         */
        const resize = (cssW: number, cssH: number) => {
          const w = Math.round(cssW * dpr);
          const h = Math.round(cssH * dpr);
          if (!w || !h || (w === bufW && h === bufH)) return;
          bufW = w;
          bufH = h;
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        };

        // `contentRect` já vem medido pelo observer: ler `clientWidth` aqui
        // forçaria um novo cálculo de layout a cada notificação.
        observer = new ResizeObserver(([entry]) => {
          resize(entry.contentRect.width, entry.contentRect.height);
        });
        observer.observe(canvas);
        resize(canvas.clientWidth, canvas.clientHeight);

        let visible = true;

        const frame = (now: number) => {
          if (!visible) {
            raf = 0;
            return;
          }
          // tempo acumulado em vez de (agora - início): ao voltar de uma pausa o
          // feixe continua de onde parou em vez de saltar adiante
          if (last) elapsed += Math.min(now - last, 100);
          last = now;

          gl.uniform2f(uRes, bufW, bufH);
          gl.uniform1f(uT, elapsed / 1000);
          gl.uniform1f(uB, opening?.current ?? 0);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          raf = requestAnimationFrame(frame);
        };

        /** Fora da tela não desenha: o feixe do rodapé não disputa GPU com o do hero. */
        viewport = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible && !raf) {
              last = 0;
              raf = requestAnimationFrame(frame);
            }
          },
          { rootMargin: "120px" },
        );
        viewport.observe(canvas);

        raf = requestAnimationFrame(frame);
        fadeIn = requestAnimationFrame(() => setReady(true));
      } catch (error) {
        console.warn("Feixe de luz desativado:", error);
        dispose();
      }
    };

    /**
     * O sistema recolhe a memória de vídeo quando a aba vai para segundo plano
     * — no celular, trocar de app já basta. Sem isto o feixe sumiria de vez ao
     * voltar. `preventDefault` no evento de perda é o que autoriza o navegador
     * a devolver o contexto depois.
     */
    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      observer?.disconnect();
      viewport?.disconnect();
    };

    const onRestored = () => {
      shaders.length = 0;
      program = null;
      buffer = null;
      last = 0; // sem isto o primeiro frame contaria o tempo todo em que ficou fora
      build();
    };

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    build();

    return dispose;
    // `opening` é um ref estável (nasce de um `useRef`), então isto roda uma
    // vez só — está na lista para não segurar um ref antigo se um dia o
    // componente passar a receber outro.
  }, [frag, opening]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{ transitionDuration: `${fade}ms` }}
        className={`block h-full w-full transition-opacity ease-[cubic-bezier(.22,1,.36,1)] ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
