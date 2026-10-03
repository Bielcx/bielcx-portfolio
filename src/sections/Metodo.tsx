import { splitText, stagger } from 'animejs'

import { DriftWall } from '../components/metodo/DriftWall'
import { metodo } from '../data/content'
import { assentar, naRolagem, useScrollMotion } from '../hooks/useScrollMotion'

/**
 * Seção 02 — "Mostramos antes de explicar".
 *
 * Duas colunas: a afirmação à esquerda, e à direita uma parede de trabalhos
 * derivando em 3D (`DriftWall`) que a PROVA. O vazio da tela é preenchido por
 * um objeto, não por mais texto, que era o defeito da narrativa que morava
 * aqui antes.
 *
 * Ali já esteve um painel-janela com uma linha do tempo de três paradas, do
 * começo da conversa ao projeto no ar — argumento desenhado. A parede troca
 * desenho por prova: são os quatro trabalhos de verdade, os mesmos da seção
 * 03. Saiu a pedido, com a copy dele (`metodo.painel`) junto.
 *
 * As cores desta seção são hexadecimais soltos e não tokens do `@theme`: são
 * nove tons de cinza que só existem aqui, e nove tokens de uso único poluiriam
 * o tema mais do que o organizariam. Os acentos (`f0863c`, `4f9bf0`, `74d6b4`)
 * são os do projeto e estão em variável.
 *
 * Nada aqui é interativo: sem hover, sem clique, sem CTA. O painel é uma
 * imagem-argumento, não um componente — não o faça parecer clicável. E a regra
 * dos dois pontos de contato (hero e rodapé) vale aqui: ver a nota no
 * `data/content.ts`.
 */
export function Metodo() {
  const trackRef = useScrollMotion(entrada)

  return (
    <section
      ref={trackRef}
      /*
       * **O PALCO PRESO SAIU, e o motivo é um bug que dava para medir.**
       *
       * Esta seção era um track de 115svh com um `sticky` de uma tela dentro:
       * o quadro parava e o conteúdo subia por dentro dele, para o olho ler uma
       * chegada em vez de a página passando. Isso valia enquanto cada seção
       * tinha o seu próprio fundo.
       *
       * Com o fundo passando a ser UM SÓ, do documento, os dois referenciais
       * brigaram: o conteúdo preso na viewport e o fundo rolando com a página.
       * Medido, entre `scrollY` 900 e 1020 o `h2` ficava congelado em y=205
       * enquanto a luz no mesmo ponto da tela drenava de rgb(11,16,23) para
       * rgb(1,1,2) — 120px em que o conteúdo está pregado e o fundo escorre por
       * trás dele. Lê como fundo se mexendo sozinho, e é exatamente isso.
       *
       * Enquanto houver `sticky` numa página de fundo único, esse descolamento
       * volta. **Não reintroduza o palco preso sem resolver isso antes.**
       *
       * O que se perde é pequeno e estava documentado: o palco só segurava
       * ~135px, a nota antiga já dizia que palco comprido é palco morto, e no
       * celular ele nunca existiu. O `useStageProgress` saiu junto — esta era a
       * única chamadora. A entrada hoje é a timeline `entrada`, no fim deste
       * arquivo, dirigida pela rolagem.
       */
      className="relative isolate"
    >
      {/*
        O palco. As medidas laterais são as MESMAS que o hero usa quando o card
        dele termina de fechar: 16/20px no celular e 64/56px daí para cima. Os
        números estão escritos aqui e lá, e não num token, porque no hero eles
        são multiplicados pelo `--p` a cada frame — ali são uma conta, aqui um
        valor parado.

        **Não há mais card aqui.** Eram um retângulo de 40px de raio, borda de
        1px, degradê e sombra azul — o mesmo objeto do hero subindo no lugar
        dele. Ele saiu: preto sobre preto, o que a borda desenhava era a
        moldura, não o objeto, e a seção lia como um slide dentro da página em
        vez de a página continuando. Com ele foram embora o `overflow-hidden`,
        o fio de 2px da aresta e o halo que descia dela; o `items-center` era
        do card e virou do palco.

        **E não há mais campo de estrelas atrás.** Ele ocupava a seção inteira,
        num invólucro com `overflow-hidden` que existia só para cortá-lo — o
        canvas tinha `w-screen`, e `100vw` conta a barra de rolagem. Saiu do
        site todo, e o que separa esta seção da anterior passou a ser só o
        vazio: o fundo da página atravessa as duas sem costura.

        **E não há luz colorida saindo do conteúdo.** Houve uma tentativa: o
        halo do card reancorado no topo do bloco, subindo. Não funciona, e o
        motivo é que o halo nunca teve forma própria — quem a dava era o fio de
        2px de cor cheia na aresta, e o halo só punha o brilho atrás dele. Sem o
        fio sobra um borrão colorido de 1240px atravessando o alto da seção.
        Devolver o fio resolveria o borrão e traria de volta uma divisória
        horizontal, que é o que o card tinha de errado.
      */}
      <div className="relative flex px-4 py-16 md:items-center md:px-16 md:py-28">
        {/* **A FAIXA DE LUZ DO ALTO SAIU.** Era o `beam-dock`: uma barra
            branca borrada, de 56px, colada na borda de cima da seção, que
            apagava conforme ela assentava. Fazia sentido enquanto esta seção
            era uma CORTINA subindo por cima do hero — a faixa era a aresta da
            chapa, e sem ela a chapa subia invisível, preto sobre preto.

            Não há mais cortina, e o fundo agora é um só, da página inteira:
            hero e seção 02 são o mesmo material continuando. Uma barra de luz
            na costura entre as duas deixou de marcar chegada e passou a ser
            uma faca dividindo o que deveria ser contínuo — medida, a faixa era
            2,5 vezes mais clara que a vizinhança (49 contra 19 de luminância,
            num vão de 70px logo abaixo da fronteira).

            O utilitário `beam-dock` do `index.css` saiu junto: este era o
            único chamador. */}

        <div
          /*
           * O bloco inteiro sobe enquanto a seção entra, e por cima disso cada
           * elemento tem o seu próprio curso e atraso. São duas camadas de
           * movimento: esta é a que faz a composição ENTRAR no quadro, e a de
           * dentro é a que dá profundidade entre as partes. Ver `entrada`.
           */
          data-m="bloco"
          className="relative mx-auto w-full max-w-[1240px] will-change-transform"
        >
          <div className="flex flex-col gap-7 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-14 lg:gap-24">
            {/* `contents` no celular: os filhos viram itens do flex de fora,
                  e aí o `order-last` do rodapé mono consegue jogá-lo para depois
                  do painel — que é a ordem do desenho. No desktop a coluna volta
                  a existir e o rodapé volta para o lugar dele. */}
            <div className="contents md:flex md:flex-col md:gap-[34px]">
              <p
                data-m="eyebrow"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-warm md:text-[13px]"
              >
                {metodo.eyebrow}
              </p>

              <h2
                data-m="titulo"
                className="font-display text-[clamp(38px,9vw,74px)] font-medium leading-[0.96] tracking-[-0.038em] text-ink-bright"
              >
                {metodo.title}
              </h2>

              {/* Os dois parágrafos vão ao DOM e o CSS escolhe: media query não
                    troca texto, e um listener de resize seria caro para isso. */}
              <p
                data-m="texto"
                className="max-w-[460px] text-[17px] leading-[1.55] text-ink/70 [text-wrap:pretty] md:text-[21px] md:leading-[1.6]"
              >
                <span className="md:hidden">{metodo.paragraphCurto}</span>
                <span className="hidden md:inline">{metodo.paragraph}</span>
              </p>

              <div
                data-m="notas"
                className="order-last flex flex-col gap-3 border-t border-[#1e1d1b] pt-6 md:order-none font-mono text-[11px] uppercase leading-[1.2] tracking-[0.1em] text-[#6f6b67] md:gap-3 md:pt-[26px] md:text-[12px]"
              >
                {metodo.notas.map((nota, i) => (
                  <p
                    key={nota}
                    // a do meio é a que o celular dispensa: em 390px as três viram
                    // um bloco, e ela é a menos decisiva das três
                    className={`${i === 1 ? 'hidden md:block' : ''} ${
                      i === metodo.notas.length - 1 ? 'text-ink' : ''
                    }`}
                  >
                    {nota}
                  </p>
                ))}
              </div>
            </div>

            {/* A parede é um laço sem fim: sem caixa de altura definida, o
                plano inclinado não teria contra o que ser recortado.

                No desktop essa altura NÃO é um número — o `self-stretch` faz a
                célula ocupar a linha inteira do grid, e a linha é a altura da
                coluna de texto ao lado. Ou seja a parede se alinha sozinha com
                o bloco da esquerda, e continua alinhada quando a copy mudar de
                tamanho. O `items-center` do grid vale para a outra célula.

                No celular não há grid, e aí vale o `clamp`. */}
            <div
              data-m="parede"
              className="md:self-stretch"
            >
              <DriftWall className="h-[clamp(320px,52vh,560px)] rounded-xl md:h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * A entrada da seção, amarrada à rolagem: de quando o topo dela encosta no pé
 * da janela até ele chegar a 45% da altura da tela. As posições na timeline
 * (0, 80, 260…) são fração desse curso, não tempo.
 *
 * Profundidade é velocidade diferente: o bloco sobe 120px, e cada parte anda
 * um pouco mais por dentro dele. O título entra palavra por palavra — o
 * `splitText` parte o `h2` em `<span>`s e o `revert()` do escopo o devolve
 * inteiro. Sem `wrap: 'clip'`: com o `leading-[0.96]` o recorte comeria as
 * descendentes ("ç", "g").
 *
 * A parede abre por `clip-path` em vez de crescer: escalar o plano 3D dela
 * mexeria na perspectiva, e o recorte só revela.
 */
function entrada(root: HTMLElement) {
  const q = (m: string) => root.querySelector<HTMLElement>(`[data-m="${m}"]`)!
  const { words } = splitText(q('titulo'), { words: true })

  const tl = naRolagem(root)
    .add(q('bloco'), { translateY: [120, 0], duration: 1000, ease: 'outCubic' }, 0)
    .add(q('eyebrow'), { opacity: [0, 1], translateX: [-24, 0] }, 0)
    .add(
      words,
      {
        opacity: [0, 1],
        translateY: ['0.45em', '0em'],
        filter: ['blur(10px)', 'blur(0px)'],
        delay: stagger(45),
      },
      80,
    )
    .add(q('texto'), { opacity: [0, 1], translateY: [40, 0], filter: ['blur(6px)', 'blur(0px)'] }, 260)
    .add(q('notas').children, { opacity: [0, 1], translateX: [-20, 0], delay: stagger(70) }, 400)
    .add(
      q('parede'),
      {
        opacity: [0.2, 1],
        translateY: [80, 0],
        clipPath: ['inset(12% 10% 12% 10% round 24px)', 'inset(0% 0% 0% 0% round 12px)'],
        duration: 800,
        ease: 'outCubic',
      },
      120,
    )

  assentar(tl)
}
