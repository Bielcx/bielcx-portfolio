import { SpecularButton } from '../components/SpecularButton'
import { useState, type MouseEvent } from 'react'

import { Cables, ancora } from '../components/hero/Cables'
import { EthMark } from '../components/hero/EthMark'
import { Portal } from '../components/hero/Portal'
import { hero, whatsappUrl } from '../data/content'
import { useHeroScroll } from '../hooks/useHeroScroll'

/**
 * OS DOIS BOTÕES SÃO O MESMO DO RODAPÉ — o `SpecularButton` com a classe do
 * "Tirar um projeto do papel" —, e isso contraria o handoff, que os desenha
 * como retângulo chapado (`#141518` com borda `#2a2b30`). Foi decisão do dono,
 * e o fundo é TRANSPARENTE: quem desenha o botão aqui é a borda e o contorno
 * especular, não a superfície. Isso nasceu por causa das duas luzes que havia
 * atrás — qualquer cor própria virava um retângulo cinza flutuando na frente
 * do clarão. As luzes saíram e a primeira tela hoje é preta, mas a escolha
 * continua valendo por outro motivo: sobre preto, superfície chapada devolve
 * a moldura que o handoff desenhava, e moldura foi o que tirou o card da 02.
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
 * pendura na PONTA DO FIO.**
 *
 * Antes cada um tinha `left/top` em % da tela enquanto os fios viviam na grade
 * do SVG (1240×700, escalada por `slice`). São duas grades diferentes: elas
 * coincidem numa proporção de janela e se afastam em todas as outras, e o
 * sintoma é o fio chegando no vazio ao lado do card. Agora os dois moram no
 * mesmo palco (ver `PALCO`), e o canto do card é o ponto onde o fio começa.
 *
 * `canto` diz QUAL canto encosta na ponta: o card fica do lado de fora, então
 * o de cima-esquerda pendura pelo canto inferior direito, e assim por diante.
 * O `data-plug` do `Card` marca esse canto para o `Cables` MEDIR onde ele caiu
 * — com a rotação já embutida.
 *
 * **O plug fica no CENTRO do card, e não no canto.** Foram três tentativas: no
 * vértice da caixa (o pior — com `rounded-[14px]` a borda pintada curva para
 * dentro e o vértice cai a uns 4px de qualquer traço, deixando o fio começando
 * no ar), depois 9px para dentro, que mede zero de distância e AINDA assim lê
 * como fresta: o traço termina exatamente em cima da borda de 1px, e o
 * antialias das duas coisas no mesmo pixel desenha uma linha clara entre elas.
 *
 * Do centro não há o que alinhar. O começo do fio fica escondido sob o card —
 * o SVG é desenhado antes dos cards no DOM, e o card é opaco —, e o que se vê
 * é a linha SAINDO de trás dele, cruzando a borda onde quer que ela caia. Isso
 * vale em qualquer ângulo, com qualquer raio de borda e a qualquer altura do
 * flutuar, que é o que as duas tentativas anteriores não davam.
 *
 * **Largura é o que sobrou aqui.** A inclinação e o compasso do flutuar
 * mudaram de casa: moram no `CABOS`, porque quem escreve o `transform` do card
 * agora é o loop do `Cables.tsx`, o mesmo que desenha o fio. Enquanto o
 * flutuar era um `@keyframes`, o card subia num relógio e a ponta do fio ficava
 * parada em outro — era isso que os descolava.
 *
 * O `scale-[0.86]` abaixo de 1100px usa a propriedade `scale` do Tailwind v4,
 * que COMPÕE com o `transform` escrito pelo loop; o `translate` do canto, pela
 * mesma razão, é propriedade própria e não `transform`.
 */
const CARDS: Record<string, { largura: string; canto: string; plug: string }> = {
  automacao: {
    largura: 'w-[232px]',
    canto: '[translate:calc(-100%-10px)_calc(-100%-10px)]',
    plug: 'left-1/2 top-1/2',
  },
  rodando: {
    largura: 'w-[246px]',
    canto: '[translate:calc(-100%-10px)_10px]',
    plug: 'left-1/2 top-1/2',
  },
  landing: {
    largura: 'w-[238px]',
    canto: '[translate:10px_calc(-100%-10px)]',
    plug: 'left-1/2 top-1/2',
  },
  atendimento: {
    largura: 'w-[250px]',
    canto: '[translate:10px_10px]',
    plug: 'left-1/2 top-1/2',
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
 * **A saída para a seção 02 acontece em dois tempos**, e é só isso — não há
 * mais travessia. Primeiro o bloco de texto (`--hw`), depois a cena — luzes,
 * fios e cards (`--hs`). O escalonamento virou profundidade: o texto vai, o
 * fundo o segue, e a hero se desfaz em duas camadas em vez de uma chapa só.
 *
 * **O que SAIU, e é a mudança grande.** Isto era um track de 180svh com 100svh
 * em `sticky`, e a seção 02 subia por cima como cortina opaca (o `-mt-[80svh]`
 * do `Metodo`). Três alturas acopladas, e os dois fades eram uma conta contra a
 * posição da aresta dessa cortina na tela — mexer numa exigia refazer as
 * outras, e os três erravam em silêncio.
 *
 * Hoje o hero é uma seção de UMA TELA e a página rola como documento, sem nada
 * preso e sem ninguém subindo por cima de ninguém. A referência é o site do
 * anime.js: nenhuma seção presa, rolagem nativa, e quem anima é cada bloco
 * conforme entra e sai de quadro. Os fades do `useHeroScroll` passaram a ser
 * frações de uma tela de rolagem, e não dependem mais de medida nenhuma de
 * fora deste componente.
 */
export function Hero() {
  const { trackRef, contentRef } = useHeroScroll()
  const [portal, setPortal] = useState(false)

  /**
   * O CLIQUE NO WEB3 — e o que ele NÃO intercepta.
   *
   * Ctrl/Cmd/shift/botão do meio continuam sendo do navegador: quem pede aba
   * nova quer a aba nova agora, não uma animação numa página que vai ficar
   * para trás. O mesmo vale para quem pediu movimento reduzido no sistema —
   * aí o link é um link, e o `Portal` nem chega a montar.
   *
   * Nos outros casos o portal abre e ele mesmo navega, na mesma aba. **Isso
   * contraria a decisão registrada de o botão abrir em outra aba**, e foi
   * pedido: animação de passagem só faz sentido se a passagem acontece aqui.
   */
  function abrirPortal(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    e.preventDefault()
    setPortal(true)
  }

  return (
    <div ref={trackRef} id="topo" className="relative isolate h-viewport">
        {/* **O `--hw` apaga SÓ O BLOCO DE TEXTO, e o `--hs` leva a cena
            depois.** Os dois tempos vêm da versão com cortina, mas a razão
            mudou: lá o nome precisava sair antes porque a aresta de uma chapa
            opaca o cortava na horizontal. Aqui não há chapa — o escalonamento
            ficou porque apagar tudo junto lê como a luz do quarto sendo
            desligada, e em duas camadas lê como a cena se afastando.

            Uma altura só (`h-viewport`), e é o que o `useHeroScroll` mede para
            calcular o progresso. Não há mais track, nem `sticky`, nem número
            combinado com o `Metodo`. */}
        <section className="relative h-full w-full overflow-hidden">
          {/* **AS DUAS LUZES SAÍRAM DAQUI**, e isso é estrutural, não arrumação.
              Elas moravam nesta seção, e o resto da página era preto chapado:
              dois fundos opacos encostando, e toda emenda entre eles virava
              listra. Agora existe UM fundo, no `components/Fundo.tsx`, atrás da
              página inteira — esta seção é transparente e flutua sobre ele.
              O clarão da primeira tela é o mesmo, com os números convertidos
              para uma caixa mais alta; a conta está lá. */}

          {/* O palco, com os fios e os cards dentro — os dois na mesma grade,
              que é o que os mantém plugados. Some inteiro abaixo de 820px:
              sem os cards não há o que os fios liguem. */}
          {/* A cena não só apaga: ela SOBE enquanto apaga. Parada, o que se via
              era uma aresta reta comendo quatro cards acesos de baixo para
              cima — a cortina cortando, não a hero saindo. Subindo, os cards
              saem de quadro por cima e a cortina só encontra o que já foi
              embora. É o mesmo par (deslocamento + fade) que o bloco de texto
              usa com o `--hw`, e pela mesma razão. */}
          <div
            style={{
              opacity: 'var(--hs, 1)',
              transform: 'translate3d(0, calc((1 - var(--hs, 1)) * -16vh), 0)',
            }}
            className={`${PALCO} pointer-events-none will-change-[opacity,transform] max-[820px]:hidden`}
          >
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
                rel="noreferrer"
                onClick={abrirPortal}
                /* Abre o TLS com o outro domínio enquanto o ponteiro está a
                   caminho: são ~50ms de TTFB que somem do meio da animação. */
                onPointerEnter={preconectar}
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
            style={{ opacity: 'var(--hs, 1)' }}
            className="role-desce pointer-events-none absolute inset-x-0 bottom-[26px] flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7d7a76]">
              {hero.cue}
            </span>
            <span className="h-[26px] w-px bg-linear-[180deg,#5a5c62,transparent]" />
          </div>
        </section>

      {portal && <Portal href={hero.actions.web3.href} />}
    </div>
  )
}

/**
 * Abre a conexão com o domínio do outro portfólio antes do clique. É uma tag
 * só, injetada uma vez: `preconnect` resolve DNS e faz o handshake TLS, que é
 * o grosso do custo de uma primeira visita a outra origem. Não baixa a página
 * — `prefetch` cross-origin sem `no-cors` não é confiável, e o destino já
 * responde em ~50ms.
 */
function preconectar() {
  const href = new URL(hero.actions.web3.href).origin
  if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) return

  const tag = document.createElement('link')
  tag.rel = 'preconnect'
  tag.href = href
  document.head.append(tag)
}

/** Um card de resultado, pendurado na ponta do cabo que o liga ao nome. */
function Card({ prova }: { prova: (typeof hero.provas)[number] }) {
  const tom = TONS[prova.tom]
  const c = CARDS[prova.id]

  return (
    <article
      data-card={prova.id}
      style={ancora(prova.id)}
      className={`absolute rounded-[14px] border border-hero-line bg-hero-card p-4 shadow-[0_26px_60px_rgba(0,0,0,0.6)] max-[1100px]:scale-[0.86] ${c.largura} ${c.canto}`}
    >
      {/* De onde o fio sai: o centro do card. Sem tamanho e sem pintura —
          existe só para o `Cables` medir o ponto já com a rotação e o flutuar
          aplicados, uma vez por resize. O trecho entre o centro e a borda fica
          coberto pelo próprio card, e é isso que faz a linha parecer vir de
          trás dele em vez de encostar nele. */}
      <span data-plug aria-hidden className={`absolute size-0 ${c.plug}`} />
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
