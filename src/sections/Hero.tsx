import { SpecularButton } from '../components/SpecularButton'
import { Cables, ancora } from '../components/hero/Cables'
import { EthMark } from '../components/hero/EthMark'
import { hero, whatsappUrl } from '../data/content'
import { useHeroScroll } from '../hooks/useHeroScroll'

/**
 * OS DOIS BOTÕES SÃO O MESMO DO RODAPÉ — o `SpecularButton` com a classe do
 * "Tirar um projeto do papel" —, e isso contraria o handoff, que os desenha
 * como retângulo chapado (`#141518` com borda `#2a2b30`). Foi decisão do dono,
 * e o fundo é TRANSPARENTE: sobre as duas luzes do fundo, qualquer cor própria
 * vira um retângulo cinza flutuando na frente do clarão. Quem desenha o botão
 * aqui é a borda e o contorno especular, não a superfície.
 *
 * O preço são dois contextos WebGL a mais na primeira tela, que sobem para
 * quatro com o losango e o rodapé. Se um dia pesar em celular fraco, o
 * primeiro a virar `<a>` chapado é o Web3, que é saída e não CTA.
 */
const BOTAO =
  'rounded-xl border border-white/8 bg-transparent px-5 py-2.5 text-[13px] text-ink hover:border-white/25'

/**
 * O brilho de base do contorno, com o ponteiro longe — o estado "mouse
 * começando a chegar", ligado desde o primeiro quadro em vez de esperar
 * alguém passar perto. No rodapé o piso continua sendo zero: lá o botão chega
 * no fim da leitura, e acender na aproximação é o convite; aqui ele é a
 * primeira coisa que se olha, e apagado vira um retângulo de borda fina.
 */
const IDLE_GLOW = 0.32

/**
 * Corpo do nome. Amarra o tamanho à MENOR das duas medidas da tela: o `vw` é o
 * que faz dele um retrato de largura inteira e manda no celular, e o `vh` é o
 * teto que o impede de comer a altura de que os botões e os quatro cards
 * precisam em volta.
 *
 * Os `8.4vw` são do design e valem para "Cavalcanti" — a maior das duas linhas
 * de `hero.wordmark` — na Bricolage Grotesque. O número anda com a fonte E com
 * o comprimento da linha: mexeu num, meça de novo. Nada avisa quando vaza.
 */
const WORDMARK_SIZE = 'text-[clamp(44px,8.4vw,96px)]'

/**
 * As cores das duas frentes de trabalho. `sky` é automação, `sage` é landing
 * page — dois cards de cada, que é como a primeira tela diz que há DOIS
 * serviços sem escrever isso em lugar nenhum.
 */
const TONS = {
  sky: {
    ponto: 'bg-accent-sky',
    label: 'text-[#8fa4c4]',
    unidade: 'text-[#9fb4d4]',
  },
  sage: {
    ponto: 'bg-accent-sage',
    label: 'text-[#9aab84]',
    unidade: 'text-accent-sage',
  },
} as const

/**
 * ONDE CADA CARD FICA — e a regra é: **o card não tem posição própria, ele
 * pendura na PONTA DO CABO.**
 *
 * Antes cada um tinha `left/top` em % da tela enquanto os cabos viviam na
 * grade do SVG (1240×700, escalada por `slice`). São duas grades diferentes:
 * elas coincidem numa proporção de janela e se afastam em todas as outras, e
 * o sintoma é o cabo chegando no vazio ao lado do card. Agora os dois moram
 * no mesmo palco (ver `PALCO`), e o canto do card é o ponto onde o cabo
 * começa — por construção, em qualquer tela.
 *
 * `canto` diz QUAL canto encosta na ponta: o card fica do lado de fora, então
 * o de cima-esquerda pendura pelo canto inferior direito, e assim por diante.
 * O recuo de 10px é a folga para o traço não entrar por baixo da borda.
 *
 * **As durações e os atrasos são todos diferentes de propósito.** Em fase, os
 * quatro cards sobem e descem juntos e o quadro inteiro lê como um GIF; fora
 * de fase, lê como quatro coisas acontecendo sozinhas.
 *
 * O `scale-[0.86]` abaixo de 1100px usa a propriedade `scale` do Tailwind v4,
 * que COMPÕE com o `transform` do keyframe — um `transform: scale()` ali
 * seria apagado pela animação no primeiro quadro. O `translate` do canto pela
 * mesma razão: é propriedade própria, não `transform`.
 */
const CARDS: Record<
  string,
  { largura: string; giro: string; canto: string; duracao: string; atraso: string }
> = {
  automacao: {
    largura: 'w-[232px]',
    giro: '[--r:-6deg]',
    canto: '[translate:calc(-100%-10px)_calc(-100%-10px)]',
    duracao: '[animation-duration:10s]',
    atraso: '[animation-delay:0s]',
  },
  rodando: {
    largura: 'w-[246px]',
    giro: '[--r:5deg]',
    canto: '[translate:calc(-100%-10px)_10px]',
    duracao: '[animation-duration:12s]',
    atraso: '[animation-delay:1.2s]',
  },
  landing: {
    largura: 'w-[238px]',
    giro: '[--r:7deg]',
    canto: '[translate:10px_calc(-100%-10px)]',
    duracao: '[animation-duration:9s]',
    atraso: '[animation-delay:0.6s]',
  },
  atendimento: {
    largura: 'w-[250px]',
    giro: '[--r:-5deg]',
    canto: '[translate:10px_10px]',
    duracao: '[animation-duration:11s]',
    atraso: '[animation-delay:1.6s]',
  },
}

/**
 * O PALCO: a caixa que cabos e cards dividem.
 *
 * Tem exatamente a proporção do `viewBox` (1240×700). Com a caixa na
 * proporção do desenho, o `preserveAspectRatio` padrão encaixa sem distorcer,
 * e uma coordenada do SVG vira uma porcentagem do palco por uma conta só
 * (`ancora`).
 *
 * **O `min()` é o que segura os cards dentro da tela**, e substituiu o `max()`
 * que imitava o `slice` do handoff. Cobrindo, numa janela alta (1200×1000) o
 * palco fica meia tela mais largo que a viewport e leva os cards junto: eles
 * continuam plugados no cabo, e os dois saem pela borda. Cabendo, o palco
 * encolhe e a cena inteira se aproxima do nome — que é o que se quer numa
 * tela estreita. O preço é margem preta nas laterais em monitor ultralargo,
 * onde os cards deixam de encostar na borda.
 *
 * **Isto assume que a seção ocupa a viewport inteira** (`100vw` × `100svh`),
 * que é o que o `h-viewport` do pai garante. Se um dia a hero ganhar margem,
 * estes `vw`/`svh` viram unidades de container (`cqw`/`cqh`) — sem isso o
 * palco descola da seção e o alinhamento volta a errar em silêncio.
 */
const PALCO =
  'absolute left-1/2 top-1/2 h-[min(56.452vw,100svh)] w-[min(100vw,177.143svh)] -translate-x-1/2 -translate-y-1/2'

/**
 * Hero — o canvas de automação.
 *
 * O nome é o nó central e quatro cards de resultado ficam plugados nele por
 * fios ondulando, com um pulso correndo dentro de cada um. O tracejado do
 * handoff virou filamento a pedido, para a linha ler como os fios do hero
 * antigo — o porquê de não ser o shader daquele efeito está no `Cables.tsx`. A cena existe por um motivo comercial e
 * não estético: a hero anterior mostrava nome, dois botões e uma linha, e
 * nada dela dava MOTIVO para rolar a página. Aqui os dois serviços — automação
 * e landing page — aparecem em dois segundos, cada um com a sua cor e o seu
 * número.
 *
 * **Os números são rascunho do design e não podem ir ao ar sem conferência.**
 * A nota está por extenso em `hero.provas`, no `content.pt.ts`.
 *
 * As camadas, de baixo para cima: preto sólido, duas luzes nascendo do
 * rodapé (azul à esquerda, sage à direita), o véu frio que as costura, os
 * cabos (SVG), os cards, a vinheta que escurece o miolo e o bloco central. A
 * vinheta não é enfeite: sem ela o nome cai em cima dos cabos e do clarão, e
 * o `text-shadow` sozinho não dá conta de recortá-lo.
 *
 * Saiu daqui, com esta hero, o campo de fios WebGL (`threadsShaders.ts`,
 * apagado) e as três camadas do nome — sombra, contorno respirando e o facho
 * do `text-shine`. O nome de hoje é uma camada só com sombra preta larga, que
 * é o que o design pede; o `text-shine` e o `breathe` do `index.css` saíram
 * junto, sem chamador. Está tudo no git.
 *
 * **A saída para a seção 02 é uma cortina, não um corte.** As luzes, os cabos
 * e os cards ficam acesos e a seção 02 sobe por cima deles; só o bloco de
 * texto apaga, e apaga no instante em que a aresta da cortina chega nele. Ver
 * o `FADE` do `useHeroScroll` — os números são uma conta contra essa aresta,
 * não gosto.
 *
 * **O que FICOU, e não é decoração:** o track alto com `sticky` e o `--hw`.
 * Eles não são do hero, são da página — quem depende deles é o `-mt-[80svh]`
 * do `Metodo`, que sobe como cortina por cima deste bloco preso. Com o hero
 * numa tela normal, aquela margem negativa cobriria 70% dele já no
 * carregamento. Os 180vh vêm daí: o `Metodo` começa a 180−80 = 100svh do topo
 * do track, e o hero fica preso até 80vh, apagando no caminho. Mexeu aqui,
 * confira o `-mt` de lá E o `FADE` do `useHeroScroll` — os três descrevem a
 * mesma travessia, e os três erram em silêncio.
 */
export function Hero() {
  const { trackRef, contentRef } = useHeroScroll()

  return (
    <div ref={trackRef} id="topo" className="relative isolate h-[180svh] bg-frame">
      <div className="sticky top-0 h-viewport bg-frame">
        {/* **O `--hw` apaga SÓ O BLOCO DE TEXTO**, e isto já foi o contrário.

            Apagando a cena inteira, o que se via na travessia para a seção 02
            era uma tela PRETA de quase 500px de rolagem: o hero terminava de
            sumir por volta de 385px e a cortina do `Metodo` só tem conteúdo
            para mostrar quando prende, a 860px — no meio, cortina preta vazia
            sobre hero apagado, sem nada em quadro.

            Luzes, cabos e cards ficam acesos e são COBERTOS pela cortina, que
            é o que uma cortina faz. Quem precisa se despedir antes é só o
            nome: ele é grande, centrado, e a aresta de luz da cortina o corta
            na horizontal — é disso que o fade nasceu. Um card sendo encoberto
            lê como objeto atrás de um painel; uma palavra cortada ao meio lê
            como emenda de página. */}
        <section className="relative h-full w-full overflow-hidden bg-[#030304]">
          {/* AS DUAS LUZES, e elas são o argumento do fundo inteiro.

              Nascem ABAIXO da borda de baixo (`116%` de altura), então o que
              se vê é só o topo delas subindo — uma azul à esquerda
              (automação) e uma sage à direita (landing page). As mesmas duas
              cores dos cards e dos cabos, agora do tamanho da tela: quem olha
              de longe já lê "duas frentes" antes de ler qualquer palavra.

              Nascer do rodapé não é escolha estética: é o que puxa o olho
              para baixo, que é para onde a hero inteira existe para mandar.

              No lugar delas havia uma grade quadriculada de 56px, da primeira
              versão do handoff. Saiu na segunda: **o fundo agora é só luz.**
              Se a grade voltar, ela entra AQUI, e não somada às luzes — as
              duas juntas empastelam o miolo onde o nome mora. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(58%_48%_at_16%_116%,rgba(84,116,168,0.34),transparent_70%),radial-gradient(58%_48%_at_84%_116%,rgba(122,154,92,0.26),transparent_70%)]"
          />

          {/* O véu frio por cima das duas: é ele que costura o azul e o sage
              num clarão só no meio do rodapé, em vez de dois holofotes
              separados. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_34%_at_50%_112%,rgba(170,200,245,0.10),transparent_72%)]"
          />

          {/* O palco, com os fios e os cards dentro — os dois na mesma grade,
              que é o que os mantém plugados. Some inteiro abaixo de 820px:
              sem os cards não há o que os fios liguem. */}
          <div className={`${PALCO} pointer-events-none max-[820px]:hidden`}>
            <Cables />

            {hero.provas.map((prova) => (
              <Card key={prova.id} prova={prova} />
            ))}
          </div>

          {/* O VÉU, e ele é o que faz os cabos SAÍREM do nome.

              Os quatro terminam por volta de 50% da largura, atrás das letras.
              Se o tracejado chegasse aceso até lá, o desenho leria como quatro
              linhas passando por cima do nome; apagando antes, lê como cabo
              entrando por trás dele. Quem faz isso é este degradê, não o
              `text-shadow` — a sombra recorta o glifo, mas não escurece o vão
              entre uma letra e outra, que é justo por onde o tracejado passa.

              Cresceu de 34%×38% para 44%×48% e desceu o centro de 47% para
              52%: o primeiro par é o alcance (pega as duas linhas do nome e o
              par de botões, que era onde o cabo ainda chegava visível), e a
              descida é porque o bloco de texto tem botões e a linha mono
              embaixo — o miolo ótico dele não é a altura das letras.

              **A parada dos 72% é o que segura o resto.** Sem ela o véu vira
              um disco cinza sobre as luzes do fundo; com ela, a queda é lenta
              no meio e rápida na borda, e o clarão do rodapé continua vivo. Se
              alguém aumentar o alcance de novo, some primeiro os cards nos
              cantos — é o teto deste número. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(44%_48%_at_50%_52%,rgba(3,3,4,0.97)_0%,rgba(3,3,4,0.86)_38%,rgba(3,3,4,0.45)_72%,rgba(3,3,4,0)_88%)]"
          />

          {/* `--hw` também move o bloco: parado, o fade lê como a luz caindo;
              com o deslocamento, lê como saída. */}
          <div
            ref={contentRef}
            className="relative flex h-full flex-col items-center justify-center gap-[clamp(20px,3vh,30px)] px-6 pb-[120px] pt-24 text-center will-change-[opacity,transform] max-[820px]:px-5 max-[820px]:pb-[110px] max-[820px]:pt-20"
            style={{
              opacity: 'var(--hw, 1)',
              transform: 'translate3d(0, calc((1 - var(--hw, 1)) * -48px), 0)',
            }}
          >
            {/* A sombra é larga e sem deslocamento: não é profundidade, é
                recorte — é ela, com o véu atrás, que separa o nome dos cabos
                que passam por baixo. São TRÊS raios: 26px é o vão colado na
                letra, 70px (o do handoff) é o corpo da sombra, e 130px é o
                escurecimento largo que mata o tracejado antes de ele encostar
                no nome. Nenhuma tem deslocamento — sombra com offset aqui
                viraria relevo, e o nome não está em cima de nada.

                A última letra da última linha sai no azul, e quem a fatia é
                isto aqui: a copy guarda o nome, não a marcação. Só a ÚLTIMA
                linha é fatiada, e `slice(0, -1)` com `slice(-1)` continua
                correto para qualquer nome de uma letra ou mais. */}
            <h1
              className={`font-display font-bold leading-[0.96] tracking-[-0.035em] text-ink-bright [text-shadow:0_0_26px_rgba(3,3,4,0.95),0_0_70px_rgba(3,3,4,0.95),0_0_130px_rgba(3,3,4,0.85)] ${WORDMARK_SIZE}`}
            >
              {hero.wordmark.map((linha, i) => {
                const ultima = i === hero.wordmark.length - 1

                return (
                  <span key={linha} className="block">
                    {ultima ? linha.slice(0, -1) : linha}
                    {ultima && <span className="text-accent-sky">{linha.slice(-1)}</span>}
                  </span>
                )
              })}
            </h1>

            <div className="flex flex-wrap justify-center gap-3">
              <SpecularButton
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                idleGlow={IDLE_GLOW}
                className={BOTAO}
              >
                {hero.actions.primary}
              </SpecularButton>

              {/* Sai do site, então abre em outra aba — o CTA ao lado não abre.
                  Nada aqui avisa que o clique leva para fora: a seta `↗` que
                  fazia isso saiu a pedido, e o losango tomou o lugar dela. É
                  decisão registrada no `AGENTS.md`, não descuido.

                  A `perspective` fica no ANCESTRAL e serve ao degrau de baixo
                  do `EthMark`: sem WebGL2 o losango volta a ser o SVG plano
                  girando, e `rotateY` sem perspectiva num pai achata o giro. O
                  caminho 3D não a usa — a projeção dele é do shader.

                  O `.btn__icon` do protótipo é este slot de 20px: o `EthMark`
                  entra inteiro, com os três degraus que ele já resolve. */}
              <SpecularButton
                href={hero.actions.web3.href}
                target="_blank"
                rel="noreferrer"
                style={{ perspective: '200px' }}
                idleGlow={IDLE_GLOW}
                className={BOTAO}
              >
                {hero.actions.web3.label}
                <span className="inline-flex size-5 items-center justify-center">
                  <EthMark />
                </span>
              </SpecularButton>
            </div>

            {/* A grade 2×2 do celular: os mesmos quatro ganchos dos cards, sem
                a cena. Só existe abaixo de 820px, que é onde os cards e os
                cabos somem — sem ela, a primeira tela do celular volta a ser
                nome e dois botões, que é exatamente o problema que esta hero
                foi desenhada para resolver. */}
            <div className="hidden w-full max-w-[380px] grid-cols-2 gap-2.5 max-[820px]:grid">
              {hero.provas.map((prova) => (
                <div
                  key={prova.id}
                  className="rounded-xl border border-hero-line bg-hero-card p-3 text-left"
                >
                  <span
                    className={`block font-mono text-[9px] uppercase tracking-[0.14em] ${TONS[prova.tom].label}`}
                  >
                    {prova.curto.label}
                  </span>
                  <b className="mt-0.5 block text-[22px] font-bold tracking-[-0.03em]">
                    {prova.curto.valor}
                  </b>
                </div>
              ))}
            </div>

            {/* A linha que responde "serve para mim?" — a única acima da dobra
                que diz o que o site faz. Não é `text-ink/45`: texto pequeno
                abaixo de `/55` cai sob 4,5:1 de contraste, e a regra está no
                `AGENTS.md`. A quebra manual do protótipo virou `max-w`: a
                medida faz o mesmo desenho e não quebra torto quando a copy
                mudar. */}
            <p className="max-w-[420px] font-mono text-[12px] uppercase leading-[1.9] tracking-[0.16em] text-ink/60">
              {hero.subtitle}
            </p>
          </div>

          {/* O indicador de rolagem, colado no pé da tela e fora do bloco
              centrado: ele pertence à BORDA do quadro, não à coluna. */}
          <div
            aria-hidden
            className="role-desce pointer-events-none absolute inset-x-0 bottom-[26px] flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7d7a76]">
              {hero.cue}
            </span>
            <span className="h-[26px] w-px bg-linear-[180deg,#5a5c62,transparent]" />
          </div>
        </section>
      </div>
    </div>
  )
}

/** Um card de resultado, pendurado na ponta do cabo que o liga ao nome. */
function Card({ prova }: { prova: (typeof hero.provas)[number] }) {
  const tom = TONS[prova.tom]
  const c = CARDS[prova.id]

  return (
    <article
      style={ancora(prova.id)}
      className={`flutua absolute rounded-[14px] border border-hero-line bg-hero-card p-4 shadow-[0_26px_60px_rgba(0,0,0,0.6)] max-[1100px]:scale-[0.86] ${c.largura} ${c.giro} ${c.canto} ${c.duracao} ${c.atraso}`}
    >
      <div className="flex items-center gap-2">
        <i className={`no-pulsa size-[7px] rounded-full ${tom.ponto}`} />
        <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${tom.label}`}>
          {prova.label}
        </span>
      </div>

      {/* `flex-wrap` com `items-baseline`: sem isso o número de 38px e a
          unidade de 13px disputam a mesma linha num card de 232px, e a unidade
          é empurrada para cima do texto de baixo. Está no handoff como
          armadilha conhecida. */}
      <div className="mt-3 flex flex-wrap items-baseline gap-x-[7px] gap-y-0.5 leading-[1.1]">
        <span className="whitespace-nowrap text-[38px] font-bold leading-[1.1] tracking-[-0.04em]">
          {prova.numero}
        </span>
        {'unidade' in prova && prova.unidade && (
          <span className={`whitespace-nowrap text-[13px] ${tom.unidade}`}>{prova.unidade}</span>
        )}
      </div>

      {'legenda' in prova && prova.legenda && (
        <p className="mt-2 text-[13px] leading-[1.45] text-[#a9aeb8]">{prova.legenda}</p>
      )}

      {'barra' in prova && prova.barra !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#1b1e24]">
          <i
            className="block h-1.5 rounded-full bg-accent-sage"
            style={{ width: `${prova.barra}%` }}
          />
        </div>
      )}
    </article>
  )
}
