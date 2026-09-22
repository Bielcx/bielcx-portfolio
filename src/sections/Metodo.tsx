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
       * Track alto + `sticky` dentro dele: é o que faz esta seção ser um
       * QUADRO em vez de um trecho de página rolando. Era a mesma armação que
       * o hero usava; hoje é a única da página, porque lá ela saiu.
       *
       * A diferença importa. Com o quadro parado, o conteúdo que sobe por
       * dentro tem contra o que se mover, e o olho lê uma chegada. Sem ele, o
       * conteúdo acompanha a rolagem e o olho lê só a página passando — foi o
       * que faltou nas tentativas anteriores, e é o que a narrativa antiga
       * tinha de graça por morar dentro do card fixo do hero.
       *
       * **Esta seção NÃO sobe mais por cima do hero.** Ela tinha um
       * `-mt-[80svh]` e um `z-10` que a faziam começar antes do fim do track do
       * hero e cobri-lo como cortina opaca — e aquela margem era um par com a
       * altura do track de lá (180svh) e com os dois fades do `useHeroScroll`.
       * Três números que só funcionavam juntos, e que erravam em silêncio.
       *
       * Saiu tudo. O hero é uma seção de uma tela, esta vem depois dele, e a
       * rolagem entre as duas é a do documento — sem nada preso na travessia e
       * sem sobreposição. A referência é o site do anime.js, que não prende
       * nenhuma seção. O palco preso DESTA seção continua (é o `sticky` de
       * dentro, com o track de 115svh abaixo): ele nunca teve a ver com o hero,
       * e é o que faz o conteúdo chegar em vez de só passar.
       *
       * **Não há aresta nenhuma no topo**, e isso é o ponto. Já houve uma
       * sombra escura (herdada do `Services`) e depois um fio claro, os dois
       * para desenhar a borda da cortina. Com o fundo da página atravessando as
       * duas seções, qualquer marca ali divide o que deveria ser contínuo.
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
      className="relative isolate md:h-[115svh]"
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
      <div className="relative flex px-4 py-5 md:sticky md:top-0 md:h-viewport md:items-center md:px-16 md:py-14">
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
              className="enter-rise relative md:self-stretch"
              style={{ '--d': 0.14, '--r': '128px' } as CSSProperties}
            >
              {/* A SOMBRA ATRÁS DA PAREDE.

                  Os prints têm cor própria — teal, laranja, branco — e a
                  parede cai justamente onde o `Fundo` da página tem o clarão
                  sage. O verde vaza pelos vãos entre os blocos e passa por
                  trás deles, e as duas cores brigam: o print deixa de ler como
                  print e vira mancha colorida no meio de outra.

                  Esta poça de preto isola a parede do clarão sem apagar o
                  clarão em volta dela. Vem ANTES do `DriftWall` no DOM e por
                  isso fica atrás — sem `z-index`, que aqui só criaria mais um
                  contexto de empilhamento para alguém tropeçar depois.

                  **É radial e transborda a caixa** (`-inset-12`): quadrada e
                  rente, ela seria um retângulo preto visível sobre o fundo
                  aceso — exatamente o tipo de borda reta que esta página já
                  cansou de produzir.

                  **Os raios são 50%/50% de propósito, e os stops foram
                  medidos.** Com a elipse na metade exata da caixa, ela chega em
                  transparente JUSTO na borda dela: maior que isso, o degradê é
                  cortado ainda aceso e volta o retângulo; menor, sobra caixa
                  sem sombra. Os 48px de folga do `-inset-12` são o que põe a
                  aresta da parede a ~88% do raio, e é por isso que o stop de
                  88% ainda vale 0,78 — uma primeira versão caía para 0,07 ali,
                  e o topo da parede, que é onde o clarão bate mais forte,
                  ficava sem sombra nenhuma. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-12 bg-[radial-gradient(50%_50%_at_50%_50%,#000_0%,rgba(0,0,0,0.95)_60%,rgba(0,0,0,0.78)_88%,transparent_100%)]"
              />
              <DriftWall className="relative h-[clamp(320px,52vh,560px)] rounded-xl md:h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
