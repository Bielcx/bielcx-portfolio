import type { CSSProperties } from 'react'

import { DriftWall } from '../components/metodo/DriftWall'
import { metodo } from '../data/content'
import { useEnterProgress } from '../hooks/useEnterProgress'

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
  const trackRef = useEnterProgress()

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
       * única chamadora — e o `useEnterProgress`, que o `Services` usa, publica
       * no mesmo `--enter`, então os `enter-rise` não mudam.
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
