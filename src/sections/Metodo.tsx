import type { CSSProperties } from 'react'

import { DriftWall } from '../components/metodo/DriftWall'
import { metodo } from '../data/content'
import { useStageProgress } from '../hooks/useStageProgress'

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
  const trackRef = useStageProgress()

  return (
    <section
      ref={trackRef}
      /*
       * Track alto + `sticky` dentro dele: é a mesma armação do hero, e é o que
       * faz esta seção ser um QUADRO em vez de um trecho de página rolando.
       *
       * A diferença importa. Com o quadro parado, o conteúdo que sobe por
       * dentro tem contra o que se mover, e o olho lê uma chegada. Sem ele, o
       * conteúdo acompanha a rolagem e o olho lê só a página passando — foi o
       * que faltou nas tentativas anteriores, e é o que a narrativa antiga
       * tinha de graça por morar dentro do card fixo do hero.
       *
       * Esta seção sobe POR CIMA do hero em vez de empurrá-lo para fora: a
       * margem negativa a faz começar antes do fim do track dele, o `z-10` a
       * põe na frente e o fundo opaco cobre.
       *
       * **Os 80svh decidem QUANDO este card aparece**, e são o único número que
       * controla isso: o card fica visível quando o track dele encosta no pé da
       * tela, ou seja `altura do track do hero − 80svh − uma tela` de rolagem.
       * Com os 180vh de lá, isso dá ZERO: a aresta já está encostada no pé da
       * tela quando a página abre, e começa a subir no primeiro pixel de
       * rolagem. Aumentar mais faria a cortina aparecer JÁ COBRINDO um pedaço
       * da tela no carregamento.
       *
       * Eram 70vh, e a cortina levava 10vh de rolagem só para encostar. Isso
       * somado ao fade do hero — que apaga texto E fundo — deixava a tela preta
       * e parada esperando a cortina chegar. Subiu para 80vh junto com o atraso
       * do `FADE` no `useHeroScroll`: a cortina sai antes e o hero fica mais
       * tempo, e os dois se cruzam no meio da tela em vez de haver um vão entre
       * um e outro.
       *
       * **Estes dois números são um par.** Mexeu aqui, refaça a conta de lá, e
       * vice-versa — o sintoma de desencontrar é ou o preto de volta, ou a
       * cortina cortando o nome ainda aceso.
       *
       * A aresta de cima é um fio claro, e não a sombra escura que o `Services`
       * usava: a sombra funcionava quando o card do hero era um degradê cinza,
       * e hoje é preto sobre preto — sem o fio, a cortina sobe invisível.
       *
       * **A altura do track é o que sobra de scroll preso depois que o card
       * enche a tela**, e é o número que evita rolagem em falso. 115vh dão uma
       * tela de card mais ~135px de palco preso, e é aí que o conteúdo termina
       * de assentar: o scroll devolve algo até o fim.
       *
       * Foram 190vh (585px parados) e 135vh (315px). Nos dois a rolagem em
       * falso foi sentida. O engano da primeira vez foi achar que o `hold` do
       * hook resolvia: com o `easeOutCubic`, o grosso do movimento já acontece
       * enquanto o card SOBE, então quando ele prende quase não resta o que
       * animar — palco comprido é palco morto, e não só a folga do fim.
       *
       * No celular não há palco preso: a tela é curta demais para prender e
       * ainda sobrar percurso.
       */
      className="relative isolate z-10 -mt-[80svh] bg-frame md:h-[115svh]"
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
        site todo, e o que separa esta seção da anterior passou a ser só a
        costura de luz do topo e o vazio.

        **E não há luz colorida saindo do conteúdo.** Houve uma tentativa: o
        halo do card reancorado no topo do bloco, subindo. Não funciona, e o
        motivo é que o halo nunca teve forma própria — quem a dava era o fio de
        2px de cor cheia na aresta, e o halo só punha o brilho atrás dele. Sem o
        fio sobra um borrão colorido de 1240px atravessando o alto da seção.
        Devolver o fio resolveria o borrão e traria de volta uma divisória
        horizontal, que é o que o card tinha de errado.
      */}
      <div className="relative flex px-4 py-5 md:sticky md:top-0 md:h-viewport md:items-center md:px-16 md:py-14">
        {/*
          A luz que marca a chegada da seção: ocupa o alto do palco e some para
          cima. O `beam-dock` a apaga conforme a seção assenta — ela é a
          CHEGADA, e não o efeito permanente da seção.

          **Ela é branca, e não mais um degradê frio-para-quente.** A cor
          vinha do `sopa-agency`, onde esta faixa é a costura com um feixe de
          luz do hero que tem aberração cromática — ali o azul e o laranja
          continuavam o feixe. Este hero não tem feixe: tem o ferrofluido, que
          desenha em branco puro. A aresta que sobe por cima dele é a mesma luz
          que ele emite, então é branca, e o degradê só controla a intensidade
          — apagada nas pontas, cheia no meio.

          Sem ela e sem o campo de estrelas que saiu, esta seção encostaria na
          anterior sem nada entre as duas.
        */}
        <span
          aria-hidden
          className="beam-dock pointer-events-none absolute inset-x-4 top-0 h-5 bg-linear-[90deg,transparent,rgba(255,255,255,0.10)_22%,rgba(255,255,255,0.26)_50%,rgba(255,255,255,0.10)_78%,transparent] blur-[12px] [mask-image:linear-gradient(0deg,#000_0%,transparent_100%)] md:inset-x-16 md:h-14"
        />

        <div
          /*
           * O bloco inteiro sobe 18vh enquanto o quadro está parado, e por cima
           * disso cada elemento tem o seu próprio curso e atraso. São duas
           * camadas de movimento: esta é a que faz a composição ENTRAR no
           * quadro, e a de cima é a que dá profundidade entre as partes.
           */
          className="relative mx-auto w-full max-w-[1240px] will-change-transform"
          style={{
            transform: 'translate3d(0, calc((1 - var(--enter, 1)) * 18vh), 0)',
          }}
        >
          <div className="flex flex-col gap-7 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-14 lg:gap-24">
            {/* `contents` no celular: os filhos viram itens do flex de fora,
                  e aí o `order-last` do rodapé mono consegue jogá-lo para depois
                  do painel — que é a ordem do desenho. No desktop a coluna volta
                  a existir e o rodapé volta para o lugar dele. */}
            <div className="contents md:flex md:flex-col md:gap-[34px]">
              <p
                className="enter-rise font-mono text-[11px] uppercase tracking-[0.18em] text-accent-warm md:text-[13px]"
                style={{ '--d': 0, '--r': '72px' } as CSSProperties}
              >
                {metodo.eyebrow}
              </p>

              <h2
                className="enter-rise font-display text-[clamp(38px,9vw,74px)] font-medium leading-[0.96] tracking-[-0.038em] text-ink-bright"
                style={{ '--d': 0.05, '--r': '64px' } as CSSProperties}
              >
                {metodo.title}
              </h2>

              {/* Os dois parágrafos vão ao DOM e o CSS escolhe: media query não
                    troca texto, e um listener de resize seria caro para isso. */}
              <p
                className="enter-rise max-w-[460px] text-[17px] leading-[1.55] text-ink/70 [text-wrap:pretty] md:text-[21px] md:leading-[1.6]"
                style={{ '--d': 0.1, '--r': '56px' } as CSSProperties}
              >
                <span className="md:hidden">{metodo.paragraphCurto}</span>
                <span className="hidden md:inline">{metodo.paragraph}</span>
              </p>

              <div
                className="enter-rise order-last flex flex-col gap-3 border-t border-[#1e1d1b] pt-6 md:order-none font-mono text-[11px] uppercase leading-[1.2] tracking-[0.1em] text-[#6f6b67] md:gap-3 md:pt-[26px] md:text-[12px]"
                style={{ '--d': 0.16, '--r': '48px' } as CSSProperties}
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
              className="enter-rise md:self-stretch"
              style={{ '--d': 0.14, '--r': '128px' } as CSSProperties}
            >
              <DriftWall className="h-[clamp(320px,52vh,560px)] rounded-xl md:h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
