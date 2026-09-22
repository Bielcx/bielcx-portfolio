import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * Parede de blocos derivando em 3D — porte do `DriftWall` do React Bits
 * (reactbits.dev/components/drift-wall), no lugar do painel-janela que provava
 * a afirmação da seção 02 com uma linha do tempo desenhada.
 *
 * **As imagens são os trabalhos de verdade**, os mesmos quatro arquivos que o
 * `WorkGrid` da seção 03 usa — resolvidos pelo mesmo glob, então publicar um
 * trabalho continua sendo soltar arquivo em `src/assets/trabalhos/`. Não
 * entrou imagem de banco, e é de propósito: a página inteira se sustenta em
 * não inventar prova.
 *
 * São SEIS arquivos, e cada bloco é um RECORTE (`object-position`) de um
 * deles: quatro colunas de seis blocos, e o mesmo trabalho com um recorte
 * diferente em cada coluna. O recorte existe porque um arquivo por bloco
 * repetiria na primeira volta do laço, e porque a 200×132 um site inteiro não
 * se lê de qualquer forma: o que lê nessa escala é cor e textura, e recorte lê
 * melhor que página encolhida.
 *
 * O `mirante` e o `sizr` entraram por último, de prints tirados do ar e
 * reduzidos a 900px de largura antes de virar `.jpg` — o print cru de 1440px
 * pesava mais do que o site inteiro, e o bloco nunca passa de 200px.
 *
 * **O que ficou de fora do original, e por quê:** o realce no hover (o bloco
 * subindo em `translateZ`, saindo do cinza, perdendo o véu) e o bloco como
 * `<a>`/`role="button"` focável. A regra da seção é que o painel é uma
 * imagem-argumento e não um componente — não o faça parecer clicável. Os
 * trabalhos têm nome, link e aba própria na seção 03, que é onde se clica.
 * Sem isso a parede é decorativa, e por isso vai inteira em `aria-hidden`:
 * tudo o que ela mostra está escrito adiante.
 *
 * ponytail: sobrou o que faz a parede ser a parede — o plano inclinado, as
 * colunas derivando em velocidades diferentes, a paralaxe do ponteiro e a
 * máscara que apaga as bordas.
 *
 * A máscara tem TRÊS camadas, compostas por `intersect` — o pixel só aparece
 * onde as três deixam:
 *
 * 1. a elipse do original, que arredonda o conjunto;
 * 2. a rampa vertical, aqui SIMÉTRICA (transparente nas duas pontas, cheia
 *    entre 32% e 68%). A do original apaga só o topo, e aí os blocos de baixo
 *    terminam numa aresta reta contra o preto — o laço infinito ganha um fim
 *    visível justamente onde não devia;
 * 3. a rampa da esquerda, que é nova: a parede encosta na coluna de texto
 *    daquele lado, e sem ela a borda dos blocos corre reta ao lado do
 *    parágrafo. Só à esquerda, de propósito — à direita a parede termina na
 *    margem da página, onde a aresta não disputa com nada.
 */

const SHOTS = import.meta.glob('../../assets/trabalhos/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const shot = (slug: string) =>
  Object.entries(SHOTS).find(([path]) => path.includes(`/${slug}.`))?.[1]

/**
 * Os trabalhos, e os recortes que sobram deles.
 *
 * `COLUNA` monta a coluna `c` como uma ROTAÇÃO desta lista: a coluna 0 começa
 * no primeiro, a 1 no segundo, e assim por diante. Isso resolve duas coisas de
 * uma vez.
 *
 * 1. **Nenhum trabalho aparece duas vezes seguidas**, nem no meio da coluna
 *    nem na emenda do laço — cada coluna mostra os seis, cada um uma vez, e o
 *    último é sempre diferente do primeiro. A versão anterior espalhava um
 *    array chapado por `i % COLUNAS` e repetia na volta.
 * 2. **Toda coluna tem o MESMO número de blocos.** Era o bug das engasgadas:
 *    com 18 blocos em 4 colunas, duas ficavam com 5 e duas com 4, mas o laço
 *    dava a volta em `ceil(18/4) = 5` para todas. As de 4 pulavam a altura de
 *    um bloco a cada volta, sempre no mesmo ponto.
 *
 * O recorte anda junto com a rotação, mas com passo diferente (`+ c * 2`), de
 * modo que o MESMO trabalho aparece com um recorte diferente em cada coluna.
 *
 * Trabalho novo é uma linha em `TRABALHOS` — ele entra nas quatro colunas
 * sozinho. `RECORTES` tem seis porque são seis trabalhos; a lista maior manda,
 * e o `%` cuida do resto.
 */
const TRABALHOS = ['fiveoout', 'voha', 'mirante', 'suga', 'oshima', 'sizr'].filter(shot)

const RECORTES = ['50% 0%', '0% 100%', '100% 50%', '50% 100%', '0% 0%', '100% 0%']

const COLUNA = (c: number) =>
  TRABALHOS.map((_, j) => ({
    slug: TRABALHOS[(j + c) % TRABALHOS.length],
    pos: RECORTES[(j + c * 2) % RECORTES.length],
  }))

const COLUNAS = 4
/** Blocos por coluna. Uniforme por construção — ver `COLUNA`. */
const POR_COLUNA = () => TRABALHOS.length
const TILE_W = 200
const TILE_H = 132
const GAP = 18
const UNIT = TILE_H + GAP

/** Inclinação do plano. São os valores da demo: o quadro olha a parede de viés. */
const TILT = 16
const TURN = -14
const DEPTH = 120

/** px/s da coluna. Ímpares sobem, pares descem — é o que faz a parede derivar. */
const VELOCIDADE = 42
/**
 * Espalha a velocidade por coluna a partir do índice, sem tabela e sem random
 * (que mudaria a cada render). O 0.618 é a razão áurea: iterar sobre ela é o
 * jeito barato de gerar uma sequência que não repete padrão visível.
 */
const fator = (i: number) => 1 + 0.45 * ((((i * 0.6180339887 + 0.35) % 1) * 2) - 1)

/**
 * **A PAREDE É EM PRETO E BRANCO, e isso resolve um conflito de cor.**
 *
 * Os prints têm cor própria — teal, laranja, branco — e a parede cai justamente
 * onde o `Fundo` da página tem o clarão sage. Duas cores no mesmo lugar, e o
 * print deixa de ler como print: vira mancha colorida no meio de outra.
 *
 * A primeira tentativa foi empilhar uma poça de preto atrás da parede para
 * isolá-la do clarão. Funcionava e ficou feia — uma mancha escura no meio de um
 * fundo aceso, e mais um objeto para calibrar. Tirar a cor dos prints ataca o
 * mesmo conflito pelo outro lado e não acrescenta camada nenhuma: a parede vira
 * TEXTURA, que é o papel dela (ela prova que há trabalho, não mostra qual), e a
 * cor da página passa a ser só o clarão do fundo e os acentos.
 *
 * O `contrast`/`brightness` acompanham o `grayscale`: dessaturar sozinho achata
 * os prints num cinza médio, e eles somem no fundo escuro.
 */
export function DriftWall({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const planeRef = useRef<HTMLDivElement>(null)
  const trackRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const plane = planeRef.current
    if (!container || !plane) return

    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /** Alvo e valor amortecido da paralaxe, em graus. */
    const alvo = { x: 0, y: 0 }
    const atual = { x: 0, y: 0 }
    const offsets = trackRefs.current.map((_, c) => UNIT * ((c * 0.37) % 1))
    const velocidades = trackRefs.current.map(() => 0)

    const desenhaPlano = () => {
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${TILT + atual.y}deg) rotateY(${TURN + atual.x}deg) ` +
        `translateZ(${-DEPTH}px)`
    }

    // Sem movimento: o plano desenha uma vez, as colunas ficam onde nasceram.
    if (parado) {
      desenhaPlano()
      return
    }

    let raf = 0
    let anterior = 0
    let visivel = true

    const frame = (now: number) => {
      if (!visivel) {
        raf = 0
        return
      }
      // dt limitado a 50ms: voltando de uma aba em segundo plano, um salto de
      // vários segundos jogaria as colunas para qualquer lugar de uma vez
      const dt = anterior ? Math.min(0.05, (now - anterior) / 1000) : 0
      anterior = now

      const damp = 1 - Math.exp(-dt / 0.12)
      atual.x += (alvo.x - atual.x) * damp
      atual.y += (alvo.y - atual.y) * damp
      desenhaPlano()

      trackRefs.current.forEach((track, c) => {
        if (!track) return
        // a volta do laço É a altura de uma cópia da coluna, senão ela salta
        const ciclo = Math.max(UNIT, POR_COLUNA() * UNIT)
        const destino = VELOCIDADE * fator(c) * (c % 2 === 0 ? 1 : -1)

        velocidades[c] += (destino - velocidades[c]) * (1 - Math.exp(-dt / 0.28))
        // o módulo duplo mantém positivo mesmo com a coluna descendo
        offsets[c] = ((((offsets[c] ?? 0) + velocidades[c] * dt) % ciclo) + ciclo) % ciclo
        track.style.transform = `translate3d(0, ${-offsets[c]}px, 0)`
      })

      raf = requestAnimationFrame(frame)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      alvo.x = ((e.clientX - rect.left) / rect.width - 0.5) * 4.8
      alvo.y = -((e.clientY - rect.top) / rect.height - 0.5) * 4.8
    }
    const onPointerLeave = () => {
      alvo.x = 0
      alvo.y = 0
    }
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)

    /* Fora da tela não anima — a seção 03 e o rodapé têm o que fazer com a
       GPU, e esta parede fica parada num track alto por várias telas. */
    const viewport = new IntersectionObserver(
      ([entry]) => {
        visivel = entry.isIntersecting
        if (visivel && !raf) {
          anterior = 0
          raf = requestAnimationFrame(frame)
        }
      },
      { rootMargin: '120px' },
    )
    viewport.observe(container)

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      viewport.disconnect()
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  // Quantas cópias da coluna empilhadas: o suficiente para, com o laço na pior
  // posição, o quadro continuar cheio. Duas bastariam para a caixa de hoje
  // (uma cópia tem ~900px e o quadro uns 700 já com o `scale`); a terceira é a
  // folga para o quadro crescer sem abrir buraco embaixo.
  const copias = 3

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`relative overflow-hidden [perspective:1200px] [perspective-origin:50%_50%] [mask-composite:intersect] [mask-image:radial-gradient(ellipse_78%_82%_at_50%_46%,#000_40%,transparent_100%),linear-gradient(to_top,transparent_0%,#000_32%,#000_68%,transparent_100%),linear-gradient(to_right,transparent_0%,#000_22%)] ${className}`}
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex flex-row [transform-style:preserve-3d]"
        style={{
          transform: `translate(-50%, -50%) scale(1.18) rotateX(${TILT}deg) rotateY(${TURN}deg) translateZ(${-DEPTH}px)`,
        }}
      >
        {Array.from({ length: COLUNAS }, (_, c) => (
          <div
            key={c}
            className="relative [transform-style:preserve-3d]"
            style={{ width: TILE_W + GAP }}
          >
            <div
              ref={(el) => {
                trackRefs.current[c] = el
              }}
              className="flex flex-col will-change-transform [transform-style:preserve-3d]"
            >
              {Array.from({ length: copias }, (_, copia) =>
                COLUNA(c).map((tile, i) => (
                  <span
                    key={`${copia}-${i}`}
                    className="relative block shrink-0"
                    style={{ height: UNIT }}
                  >
                    <span
                      className="absolute overflow-hidden rounded-[14px] bg-[#0b0b0b] opacity-55"
                      style={{ inset: GAP / 2 }}
                    >
                      <img
                        src={shot(tile.slug)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="block size-full select-none object-cover grayscale contrast-[1.08] brightness-[0.92]"
                        style={{ objectPosition: tile.pos } as CSSProperties}
                      />
                      {/* Véu: os blocos são fundo de uma coluna de texto, e o
                          print cru compete com ela.

                          **Preto, e não mais o `#060010` arroxeado.** Com os
                          prints em cinza, um véu com matiz devolve justamente o
                          que a dessaturação tirou — a parede inteira puxaria
                          para o roxo. */}
                      <span className="absolute inset-0 bg-black opacity-35" />
                    </span>
                  </span>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
