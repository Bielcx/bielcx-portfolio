import { SpecularButton } from "../components/SpecularButton";
import { EthMark } from "../components/hero/EthMark";
import { LightBeam } from "../components/hero/LightBeam";
import { THREADS_FRAG } from "../components/hero/threadsShaders";
import { hero, whatsappUrl } from "../data/content";
import { useHeroScroll } from "../hooks/useHeroScroll";

/**
 * Corpo do nome. Amarra o tamanho à MENOR das duas medidas da tela: o `vw` é o
 * que faz dele um retrato de largura inteira e manda no celular, e o `vh` é o
 * teto que o impede de comer a altura de que os botões precisam em volta.
 *
 * O `6.2vw` é calibrado para "Gabriel Cavalcanti" em DUAS linhas na Bricolage
 * Grotesque, dentro de um bloco que ocupa ~60% da largura — é menor que o
 * `7vw` de quando o nome era uma linha só centralizada no card inteiro. O
 * número anda com a fonte E com o `max-w` do bloco: mexeu num, meça de novo.
 * Nada avisa quando vaza.
 */
const WORDMARK_SIZE = "text-[clamp(40px,min(6.2vw,13vh),104px)]";

/**
 * Hero centrada sobre o preto da página: nome, botões e, fechando o bloco, a
 * linha que diz o que o site faz.
 *
 * A linha é recente e conserta a falha mais cara que a página teve: por um
 * tempo a primeira tela mostrava só o nome e dois botões, sem nada respondendo
 * "serve para mim?" antes do primeiro scroll. Ela ocupa o lugar de um carimbo
 * em mono que saiu junto — ver a nota do `subtitle` no `content.pt.ts`.
 *
 * Atrás dela, os fios do `threadsShaders.ts` — um leque de senóides que aperta
 * atrás do nome, nas cores do rodapé e em opacidade baixa. **A opacidade é o
 * ponto do efeito**: o nó dos fios cai em cima das letras, e o número está
 * comentado lá com a medição. Quem separa a letra do fio é a sombra preta da
 * cópia de baixo do nome, não a opacidade.
 *
 * O fundo apaga junto com o texto, no mesmo `--hw`: o hero sai inteiro. Já foi
 * o contrário — o campo ficava aceso para o quadro não ficar preto e parado
 * entre o texto sair e a cortina da seção 02 cobrir —, e a troca foi pedida.
 *
 * O fundo já foi outros dois — um campo de filamentos e um ferrofluido —, os
 * dois removidos a pedido e depois APAGADOS do repositório: quem guarda caminho
 * de volta é o git. O que mudou com eles e não voltou atrás é o alinhamento: o
 * bloco era encostado à esquerda para deixar a metade direita livre para o
 * campo, e hoje é centrado. Estes fios foram escolhidos para um bloco no meio,
 * não ao lado.
 *
 * **O bloco de texto se despede antes de a seção 02 passar por cima dele.**
 * Quem faz isso é o `useHeroScroll`, que publica `--hw` (1→0) no track — e é
 * só o que sobrou daquele hook: o card que fechava as bordas não existe mais,
 * e o fade em dois tempos (moldura, depois o nome) também não, porque esta
 * composição é um bloco só. Nome e botões saem juntos.
 *
 * Sem isso a cortina do `Metodo` corta o bloco na horizontal, e como os dois
 * são pretos o que se vê é a costura de luz dela atravessando o nome — emenda
 * de página, não transição. O ferrofluido do fundo fica aceso: é ele que
 * segura o quadro no intervalo entre o texto sair e a cortina cobrir.
 *
 * **O que FICOU, e não é decoração:** o track alto com `sticky`. Ele não é do
 * hero, é da página — quem depende dele é o `-mt-[80vh]` do `Metodo`, que sobe
 * como cortina por cima deste bloco preso. Com o hero numa tela normal, aquela
 * margem negativa cobriria 70% dele já no carregamento.
 *
 * Os 180vh vêm daí, e não do hero: o `Metodo` começa a 180−80 = 100vh do topo
 * do track, ou seja a aresta dele já encosta no pé da tela no carregamento, e
 * o hero fica preso até 80vh. Mexeu aqui, confira o `-mt` de lá E o `FADE` do
 * `useHeroScroll` — os três descrevem a mesma travessia.
 */
export function Hero() {
  const { trackRef, contentRef } = useHeroScroll();

  return (
    <div ref={trackRef} id="topo" className="relative isolate h-[180vh] bg-frame">
      <div className="sticky top-0 flex h-viewport items-center bg-frame">
        <section className="relative flex h-full w-full items-center overflow-hidden bg-linear-[180deg,var(--color-hero-top)_0%,var(--color-hero-mid)_42%,var(--color-hero-bot)_78%] px-6 md:px-[8vw]">
          {/* O campo atrás de tudo. Cobre a tela inteira: ele É o fundo, não
              um objeto dentro da cena. Desenha em alfa sobre o preto, então o
              `inset-0` é a única coisa que diz até onde ele vai.

              Ele apaga com o MESMO `--hw` do bloco de texto, a pedido: o hero
              sai inteiro, fundo junto. O `opacity` vai na `className` porque o
              `LightBeam` não recebe `style` — e a `className` dele é o wrapper
              inteiro, não um acréscimo. A opacidade do wrapper multiplica a do
              canvas, que tem o fade de entrada próprio; as duas convivem. */}
          <LightBeam
            className="pointer-events-none absolute inset-0 z-[1] [opacity:var(--hw,1)]"
            frag={THREADS_FRAG}
          />

          {/* Bloco centralizado, e `mx-auto` além do `items-center` do pai:
              o pai centra na vertical, este centra na horizontal. O
              `max-w-[58ch]` continua sendo a medida do texto miúdo do rodapé
              do bloco — é ele, e não o nome, que decide se isto lê como um
              bloco ou como uma faixa atravessando a tela. */}
          {/* `--hw` é escrito no track pelo `useHeroScroll`. O bloco sobe um
              pouco enquanto apaga: parado, o fade lê como a luz caindo; com o
              deslocamento, lê como saída. O `will-change` porque isto anda a
              cada frame durante quase uma tela de rolagem. */}
          <div
            ref={contentRef}
            className="relative z-2 mx-auto flex w-full max-w-[58ch] flex-col items-center text-center will-change-[opacity,transform]"
            style={{
              opacity: "var(--hw, 1)",
              transform: "translate3d(0, calc((1 - var(--hw, 1)) * -48px), 0)",
            }}
          >
            <h1
              className={`font-display font-medium leading-[0.92] tracking-[-0.038em] text-ink-bright ${WORDMARK_SIZE}`}
            >
              {/* `relative` + as cópias em `absolute inset-0`: as três camadas
                  do nome precisam ocupar exatamente a mesma caixa, e com o
                  texto quebrando em duas linhas `left-0 top-0` já não basta —
                  a cópia herdaria a largura do pai, não a do texto. O `w-fit`
                  da versão centralizada saiu junto: aqui o bloco é ancorado à
                  esquerda e a caixa do h1 já é a caixa do nome. */}
              <span className="relative block">
                {/* A sombra vive AQUI, na cópia de baixo, e não no `h1`.
                    As outras duas camadas do nome são desenhadas com o texto
                    transparente (uma recorta um degradê, a outra é contorno), e
                    `text-shadow` não liga para isso: ele pinta a silhueta do
                    glifo de qualquer jeito. No pai, a mesma sombra sairia três
                    vezes empilhada.

                    Duas sombras, as duas pretas e sem deslocamento: a de 22px é
                    o vão que separa a letra do fio que passa atrás, e a de 55px
                    é o escurecimento largo que impede o nó do leque de subir o
                    fundo inteiro em volta do nome. Não é profundidade, é
                    recorte — por isso nenhuma tem offset. */}
                <span className="[text-shadow:0_0_22px_rgba(0,0,0,0.95),0_0_55px_rgba(0,0,0,0.8)]">
                  {hero.wordmark}
                </span>

                {/* Cópia que acende num pulso lento, a mesma do rodapé. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-breathe opacity-0 [-webkit-text-fill-color:rgba(225,222,218,0.05)] [-webkit-text-stroke-color:var(--color-stroke-glow)] [-webkit-text-stroke-width:clamp(1px,0.32vw,2.4px)]"
                >
                  {hero.wordmark}
                </span>

                {/* Facho varrendo o miolo das letras — ver `text-shine`. */}
                <span
                  aria-hidden="true"
                  className="text-shine absolute inset-0"
                >
                  {hero.wordmark}
                </span>
              </span>
            </h1>


            {/* Empilhados no celular, lado a lado a partir de `sm`. O `wrap` é
                herança de quando eram três e fica porque custa zero. */}
            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <SpecularButton
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                /* Transparente, e não `bg-surface-raised`: o botão vive DENTRO
                   do card, e qualquer cor própria virava um retângulo mais
                   claro flutuando sobre o fundo. Quem marca que este é o
                   primário é o contorno especular, que o link ao lado não tem. */
                className="rounded-xl border border-white/10 bg-transparent px-5 py-3 text-center text-sm text-ink hover:border-white/25"
              >
                {hero.actions.primary}
              </SpecularButton>
              {/* Sai do site, então abre em outra aba — o CTA ao lado fica
                  aqui dentro e não abre.

                  **Havia uma seta `↗` nesta ponta, e ela saiu a pedido**; o
                  losango tomou o lugar dela. Vale saber o que foi junto: com o
                  rótulo curto ("Web3", não mais "Portfólio web3"), a seta era a
                  única coisa dizendo que o clique LEVA PARA FORA do site. Hoje
                  não há sinal disso antes do clique — é decisão tomada, não
                  descuido.

                  A `perspective` fica AQUI, no pai, e serve ao DEGRAU DE
                  BAIXO do `EthMark`: sem WebGL2 o losango volta a ser o SVG
                  plano girando com o `eth-spin`, e `rotateY` sem perspectiva
                  num ancestral achata o giro. O caminho 3D não a usa — a
                  projeção dele é do shader. */}
              <a
                href={hero.actions.web3.href}
                target="_blank"
                rel="noreferrer"
                style={{ perspective: "200px" }}
                className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-transparent px-5 py-3 text-sm text-ink transition-colors hover:border-white/25"
              >
                {hero.actions.web3.label}
                <EthMark />
              </a>
            </div>

            {/* A única linha acima da dobra que diz o que o site faz, no lugar
                e no estilo do carimbo mono que morava aqui — mesmo mono, mesmo
                caixa alta, mesmo espacejamento.

                DUAS coisas do carimbo NÃO vieram junto, e as duas de
                propósito:

                1. **Não é `text-ink/45`.** Aquele tom valia para textura; isto
                   é a frase que responde "serve para mim?", e texto pequeno
                   abaixo de `/55` fica sob 4,5:1 de contraste — a regra está
                   no `AGENTS.md`.
                2. **Não é `hidden sm:block`.** O carimbo sumia no celular
                   porque era enfeite. Esta linha sumir no celular seria
                   exatamente o problema que ela existe para consertar, na tela
                   em que ele é mais grave. */}
            <p className="mt-10 max-w-[38ch] font-mono text-[11px] uppercase leading-[1.8] tracking-[0.08em] text-ink/60">
              {hero.subtitle}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
