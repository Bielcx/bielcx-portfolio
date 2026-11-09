# portfolios/comercial

Portfólio **comercial** de Gabriel Cavalcanti — desenvolvedor full stack. Página
única em português, fundo escuro. A hero é limpa: o que é feito, um botão de
WhatsApp e três números com fonte.

## Por que este repositório existe

Existem dois portfólios, e a divisão é de **público**, não de tecnologia:

| | público | onde |
|---|---|---|
| **este** | cliente comercial — quem contrata site, loja, painel, automação | `Dev/portfolios/comercial` |
| **web3** | dev e gente de cripto — quem já sabe o que é blockchain | `Dev/portfolios/web3` (Next.js) |

O portfólio web3 converte bem com quem é do meio e afasta quem não é: a estética
e o vocabulário (Hive, PRs on-chain, terminal) filtram o cliente comercial na
primeira tela. Este site é a porta desse público, e o outro continua vivo,
intacto, para quem sabe o que procura.

**Este site não linka para o web3 em lugar nenhum (09/11/2026).** Já houve um
botão "Web3" na hero, com um portal animado ao clicar, e um "Web3 / blockchain"
no rodapé; os dois saíram a pedido. Quem liga os dois portfolios agora é o site
pessoal (`gabriel.doabridge.com`), que tem uma porta para cada um. Não traga a
palavra "web3" de volta para cá sem pedirem.

**Nunca traga projeto web3 para cá.** A lista de `services.works` é só web2. Foi
a mistura dos dois que criou o problema que este repositório resolve.

### Domínio

Este site atende em **`sites.gabriel.doabridge.com`**, e o web3 em
`web3.gabriel.doabridge.com`. O `gabriel.doabridge.com` (sem prefixo) é o site
pessoal desde 09/11/2026: ele é a porta de entrada e leva aos outros dois.

O subdomínio é do domínio da bridge (`doabridge.com`), e foi escolhido por ser
de graça: o domínio já é do dono e o DNS está na Cloudflare. **O acoplamento é
o preço** — se a bridge sair do ar ou o domínio mudar de dono, todo link já
divulgado morre junto. Domínio próprio é a primeira compra quando houver
orçamento.

O `bielcx-portfolio.vercel.app` continua servindo a mesma página, e é por isso
que o `canonical` aponta para o subdomínio: com dois endereços servindo o mesmo
conteúdo, ele é quem diz qual é o oficial.

**A URL aparece em SEIS lugares acoplados**: `canonical`, `og:url`, `og:image` e
o `url` do JSON-LD no `index.html`, o `Sitemap:` do `public/robots.txt` e o
`<loc>` do `public/sitemap.xml`. Trocar num sem trocar nos outros não derruba o
site — quebra só o preview de link e a indexação, em silêncio. Já aconteceu
duas vezes.

**Armadilha de DNS, se um dia mexer nisso:** o `doabridge.com` está na
Cloudflare, e o registro do subdomínio tem de ficar com **proxy desligado**
(nuvem cinza). Com a nuvem laranja a Vercel enxerga os IPs da Cloudflare, não
valida o domínio nem emite certificado, e fica em *Invalid Configuration* com o
registro aparentemente correto.

Quando houver domínio próprio, o plano continua o mesmo: raiz para este site,
`web3.dominio.com` para o Next.js.

## Origem do código

Este projeto é um fork do `Dev/Sopa/sopa-agency`, o site da
agência do mesmo dono — a identidade visual é deliberadamente a mesma família.
Herdou tokens, hero WebGL, Menu, seções e componentes; trocou a copy inteira.

Duas coisas foram **removidas** no fork, e a nota fica porque elas aparecem no
histórico do original:

- **a locale inglesa.** Lá são duas páginas estáticas (`/` e `/en/`) escolhidas
  pelo `lang` do documento. Aqui só existe português: sem `en/index.html`, sem
  `content.en.ts`, sem seletor de idioma no `Menu`, e o `vite.config.ts` voltou a
  ter uma entrada só. O `content.ts` virou um reexport, e é onde o caminho de
  volta está descrito, caso o inglês entre um dia.
- **os assets da agência** — logo, favicon, `og.jpg` e os clipes de
  `src/assets/trabalhos/`. Todos já foram repostos. O `og.jpg` é um print do
  hero em 1200x630, gerado à mão: **o nome do arquivo e o `og:image` do
  `index.html` são um par**, e já houve aqui um `OGimage.png` que nunca foi
  usado porque o nome não batia — o preview colava vazio e nada acusava.

O favicon é o MESMO do portfólio web3 — `web3/app/icon.png`, copiado à mão para
`public/favicon.png`. São dois repositórios e não há nada os sincronizando:
trocou lá, copie de novo aqui.

## Atribuição — REGRA ABSOLUTA

Nunca cite, mencione ou referencie Claude, Anthropic, "AI", "IA", "gerado por IA"
ou qualquer assistente em **nada** deste repositório. Isso vale para, sem exceção:

- mensagens de commit (sem `Co-Authored-By`, sem trailer de sessão, sem "Generated with")
- títulos e corpo de Pull Requests
- comentários de código, docstrings, TODOs
- CHANGELOG, release notes, documentação
- nomes de branch

O autor de todo o trabalho é o dono do repositório. Escreva como ele escreveria.
`includeCoAuthoredBy` já está desligado em `.claude/settings.json`; mantenha assim.

## Stack

Vite 8 + React 19 + TypeScript + Tailwind CSS v4. Gerenciador: **pnpm**
(fixado em `packageManager`). Lint: oxlint. Sem roteador, sem CMS, sem backend.

```bash
pnpm dev     # http://localhost:5173
pnpm build   # tsc -b && vite build
pnpm lint
```

## Deploy

Vercel, a partir do `vercel.json`. O `"framework": "vite"` de lá tem precedência
sobre o painel — se o projeto na Vercel for criado com outro preset, o conserto
mora no arquivo e não em quem apertar deploy.

## Convenções

**Toda a copy vive em `src/data/content.pt.ts`**, por seção (`nav`, `hero`,
`metodo`, `services`, `footer`). Componentes não têm texto embutido — nem
`aria-label`, nem placeholder. Para mudar qualquer palavra do site, mexa nesse
arquivo e em mais nada. O `content.ts` é só o reexport; os canais de contato
(WhatsApp, e-mail, URL do portfólio web3) moram no `contact.ts`, porque são
endereço e não texto.

**O texto de hoje é esqueleto.** A forma está certa; os números (prazos, preços,
o que está incluso) são rascunho e precisam bater com o que é praticado de
verdade antes de o site ir ao ar. A nota está no topo do `content.pt.ts`.

**Trabalho novo na grade é soltar arquivo na pasta.** O `WorkGrid` resolve por
`slug`: salve `src/assets/trabalhos/<slug>.png` (webp/jpg servem) ou um `.mp4` de
mesmo slug para ele rodar em movimento, com a imagem servindo de cartaz. Sem
arquivo, o slot mostra um placeholder hachurado com o domínio — é o estado atual
dos quatro.

**Cada CTA tem rótulo próprio, e só o do rodapé tem ícone.** São dois pontos de
contato — hero e rodapé. A hero tem UM botão ("Conversar no WhatsApp"); o do
rodapé é "Tirar um projeto do papel". Não traga para a hero o botão Web3 nem o
"Trabalhos no ar" de volta sem pedirem: a primeira tela é só para o visitante
comercial, e quem quiser os serviços tem o menu.

**O painel da faixa de automação é o `AgentDemo`: um celular rodando, em loop,
um vídeo de 15s** (`src/assets/automacao/agente.mp4` + `agente-poster.webp`) —
o cliente pergunta horário, o agente consulta a agenda, responde com dado
concreto, reserva, e do outro lado a agenda do Estúdio Vélo se preenche
sozinha. Substituiu a conversa clicável por decisão do dono: o vídeo explica
num relance, sem pedir clique. O negócio continua inventado e a nota embaixo
do aparelho diz que é simulação — sem ela é propaganda enganosa.

O vídeo é RENDERIZADO, não gravado: animação HTML com relógio determinístico,
fotografada quadro a quadro e codificada em H.264 (yuv420p, faststart, sem
áudio). O fonte da animação não mora no repo; refazer é refazer o vídeo. Ele
tem 540×1170, a proporção exata da tela, com respiro no alto para a ilhota e
embaixo para a barra de gesto. O último quadro é idêntico ao primeiro — é o
que faz o loop não ter emenda.

**A moldura de iPhone é porte do Magic UI**, SVG sem dependência: tela em % das
constantes (`TELA_X`…), raio em `X% / Y%` (com um valor só o canto sai oval),
e `pointer-events-none` no SVG. Com `prefers-reduced-motion` entra só o cartaz
(`<img>`), e fora de quadro o vídeo pausa (IntersectionObserver). A descrição
para leitor de tela vem de `services.agente.video`. O halo por trás não é
enfeite — o aparelho é preto como a página, e sem ele some no fundo.

**A moldura de painel saiu do `Services.tsx` e foi para o `WorkGrid`.** O
wrapper das faixas era `rounded-2xl border bg-card` para os dois painéis, e em
volta de um celular isso é moldura dentro de moldura. Quem precisa de borda
agora a traz; painel novo que precise dela, idem.

Antes disto o painel era o `ProcessSteps`: uma rede de nós — entradas, núcleo,
saídas — com um cometa de luz correndo pelos fios, que DESENHAVA a automação em
vez de demonstrá-la. Saiu inteiro, com a copy `services.process` e as
utilidades `onda-corre` e `beam-bead`, que eram só dele. Está no git. Antes da
rede houve ainda uma sequência de quatro passos com um facho descendo, que é o
que esta nota descrevia até aqui.

O ícone do WhatsApp fica só no rodapé: repetido em todo CTA vira textura, e no
rodapé — último ponto, de quem leu a página inteira — saber o canal ajuda quem
está decidindo. Ao acrescentar um CTA: o rótulo diz o que acontece a seguir e
nunca é igual ao de outro botão da página. O que faz a página soar insistente é
a repetição da frase, não a quantidade de botões.

**O menu é só navegação.** Links do mesmo padrão, sem CTA no meio —
"Contato" aponta para o `id="contato"` do rodapé, e é lá que está o botão.

**O e-mail é link de texto ao pé do CTA do rodapé, não um segundo botão.**
`mailto:` como botão principal é aposta ruim: quem não tem cliente de e-mail
configurado clica e nada acontece.

**O número do WhatsApp tem 13 dígitos** (55 + DDD + 9). Conte antes de trocar:
faltando um, o `wa.me` não reclama, só abre conversa vazia, e todo CTA do site
vira link morto sem aviso.

**Não há mais NADA preso na página** — nem a travessia do hero, nem o palco da
seção 02. O palco era um track de 115svh com um `sticky` de uma tela dentro, e
existia para o conteúdo subir por dentro de um quadro parado. Ele caiu junto com
a unificação do fundo, e por um motivo que dá para medir: com o fundo no
DOCUMENTO e o conteúdo preso na VIEWPORT, os dois referenciais brigam. Entre
`scrollY` 900 e 1020 o `h2` ficava congelado em y=205 enquanto a luz no mesmo
ponto da tela drenava de rgb(11,16,23) para rgb(1,1,2) — 120px de conteúdo
pregado com o fundo escorrendo por trás. Lê como fundo se mexendo sozinho.

**Enquanto o fundo for único, `sticky` volta a produzir isso.** O
`useStageProgress` saiu (o `Metodo` era a única chamadora), e depois dele o
`useEnterProgress` e o `enter-rise`: a entrada das seções é anime.js (ver
"O movimento de entrada" abaixo).

**Não há mais cortina.** A seção 02 subia opaca por cima do hero preso, com um
`-mt-[80vh]` e um `z-10` no `Metodo`. Saiu: o hero é uma seção de uma tela, a 02
vem depois dele e a rolagem entre as duas é a do documento. A referência foi o
site do anime.js, que não prende nenhuma seção — rolagem nativa, e quem anima é
cada bloco conforme entra e sai de quadro. O único `sticky` que sobra na página
é o palco do próprio `Metodo`, que nunca teve a ver com o hero.

**`--color-surface` não existe mais**, e as seções não têm fundo próprio: quem
pinta é o `Fundo` da página (ver "O fundo é só LUZ" abaixo). As duas exceções
são objetos, não seções — o cartão do rodapé, que precisa do preto atrás das
ondas, e a cobertura do `Menu`. Continua havendo `--color-surface-raised`, que
é de botão.

**A faixa do `beam-dock` no alto da 02 SAIU**, e o utilitário dela também —
era o último chamador. Ela era a aresta da cortina: enquanto a 02 subia como
chapa opaca por cima do hero, sem aquela luz a chapa subia invisível, preto
sobre preto. Sem cortina e com um fundo só, ela deixou de marcar chegada e
virou uma faca dividindo o que deveria ser contínuo — medida, era 2,5 vezes
mais clara que a vizinhança (49 contra 19 de luminância, num vão de 70px logo
abaixo da fronteira). Houve antes uma tentativa de salvá-la apagando a máscara
nas duas pontas; tirou a borda dura e manteve a barra. **O que separa uma seção
da outra agora é só o vazio — o fundo atravessa.**

**Não há campo de estrelas.** O `Starfield` rodava no hero e na seção 02 e saiu
do site inteiro a pedido. O `sopa-agency`, de onde esta base veio, ainda o tem
— não o traga de volta ao sincronizar com ele.

**A hero é LIMPA (09/11/2026): título, uma linha de apoio, um botão e três
números no pé.** O dono pediu "algo bem clean". Saíram o nome gigante no centro,
os quatro cards de resultado ligados ao nome por cabos animados, o botão Web3 com
o portal e o indicador de rolagem — com eles, os componentes `Cables`,
`EthMark`, `Portal`, os shaders do losango e do portal, e o hook
`useHeroScroll`. Está tudo no git.

- **O título diz o que é feito e para quem** ("Sites e sistemas para o seu
  negócio."). O nome não precisa estar na primeira tela: quem chega não o
  conhece, e ele aparece logo abaixo, na seção 02, onde vende.
- **Um botão só, o do WhatsApp** (`.cta-whats` no `index.css`): um brilho no
  azul `sky` atravessa o botão a cada 5s (branco sobre botão claro não
  aparece) e, no hover, ele sobe, ganha halo e a seta anda. Com movimento
  reduzido, nada corre.
- **Os números no pé têm fonte escrita** em `hero.provas`, como antes. Eram
  quatro; o "5 sistemas" saiu por ser o mais técnico. Promessa que a primeira
  tela faz é a que o cliente cobra na reunião.
- **O espaço vazio entre o botão e os números é o desenho**, não sobra. A seção
  tem `min-h-svh` e os números vão para o pé com `mt-auto`.

**O fundo é da PÁGINA, não da hero** — mora em `components/Fundo.tsx`, uma
camada `absolute inset-0 -z-10` sob o `<main>`, e todas as seções são
transparentes por cima dele. Hoje ele é preto sólido, e só a partir do pé da
primeira tela entra um eco em ladrilho: azul e sage bem fracos, as mesmas cores
dos cards, para a página não virar preto chapado.

**A PRIMEIRA TELA É PRETA, e isso foi pedido.** Havia ali duas radiais (azul à
esquerda, automação; sage à direita, landing) e um véu frio costurando as duas
num clarão só. O desenho original as fazia nascer ABAIXO da borda de baixo da
tela — 16% abaixo do pé —, o que puxava o olho para baixo mas deixava o pico do
gradiente dentro da seção 02 e o rabo por cima da parede de trabalhos. Isso foi
remendado quatro vezes, e as quatro trocaram o sintoma de nome em vez de
resolvê-lo:

| tentativa | o que virou |
|---|---|
| caixa de 150svh | o corte a faca no pé da hero |
| máscara linear de uma ponta | listra na borda de baixo |
| corte em 66/85% | borrão de cor atravessando a costura |
| centro trazido para 80%/26% | ainda "feio", e saiu |

**A lição, se um dia voltar:** gradiente cortado por uma reta tem borda reta, e
borda reta em fundo contínuo se vê — máscara linear não é solução. Voltando,
volta terminando dentro da hero por geometria: centro acima de 85% da caixa e
raio vertical curto o bastante para a parada do `transparent` cair antes do pé.

**O eco fica todo à esquerda**, e isso não é composição: da segunda seção para
baixo, IMAGEM MORA À DIREITA — a parede de trabalhos da 02 ocupa x=711..1340, a
grade da 03 começa em x=709, e o texto fica à esquerda nas duas. Cor de fundo
por trás de print é conflito de cor, e é o mesmo problema que a parede em preto
e branco ataca pelo outro lado. Havia uma bolha sage em x=86%, centrada em
x=1238: bem no meio da parede. As duas foram para 8% e 24%, com alcance real
terminando em x≈648. **Mudou a coluna das imagens de lado, mude as duas.**

**Por que é da página e não da hero.** As luzes moravam dentro da hero e o
resto era `#000`: dois fundos opacos encostando, e toda emenda entre eles
aparecia como listra — primeiro no corte a faca do pé da hero, depois na borda
de baixo do `beam-dock`. Esfumar cada emenda conserta o sintoma; o defeito é
ter dois fundos. Com um só, não existe borda entre seção e seção para cortar
nada.

E `absolute`, nunca `fixed`: preso na viewport o desenho se refaz a cada tela e
a página lê como escorregando sobre um papel de parede parado. A primeira versão
do handoff tinha uma grade quadriculada de 56px na primeira tela; a segunda a
tirou. Com a tela preta ela é a candidata óbvia a preencher o vazio — mas ela
sai do mesmo lugar de onde as luzes saíram, e o que empastelava o miolo onde o
nome mora era ter alguma coisa ali.

As camadas, de baixo para cima: o `Fundo` da página (preto, mais o eco abaixo
da primeira tela) e, por cima, as seções, transparentes. A hero não tem camada
própria: é só texto, um botão e a fileira de números.

**Se uma emenda entre seções voltar a aparecer, procure o fundo opaco novo**,
não o esfumado que falta. Já houve aqui uma faixa de 72px esfumando o pé da
hero antiga; era remendo de ter dois fundos, e saiu junto com o problema.

**Ícone de marca é preenchido; o resto é traço.** O `Icon` decide pelo conjunto
`FILLED` — `whatsapp`, `ethereum`, `github` e `linkedin`. Eram dois e cabiam numa
comparação dupla; `github` e `linkedin` entraram para uma fileira de ícones
sociais no rodapé que não está mais lá — ficaram no conjunto, sem uso. Quem
desenha
o losango do Ethereum são quatro paths do mesmo `currentColor` em opacidades
diferentes — é assim que o logo oficial separa os planos, e é o que o mantém
legível a 18px.

**Texto pequeno não desce de `text-ink/55`.** O `--color-ink` é `#e9e7e4` sobre
preto, e o alfa da classe decide o contraste: `/25` dá 1,84:1, `/35` dá 2,64 e
`/45` dá 3,77 — todos abaixo dos 4,5:1 que texto pequeno exige. `/55` dá 5,2 e
`/60` dá 6,1. Houve uma passagem em que rótulo de 9px, nome de trabalho e links
do rodapé estavam todos entre `/25` e `/45`; foram subidos de uma vez.

Não é só norma: o público deste site abre o link no celular, no sol. As duas
exceções conscientes são a barra `/` que separa rótulo e contador na seção 03 e
o carimbo mono do canto do hero — pontuação e textura, não texto para ler; o do
hero está em `/45` e é o primeiro a rever se alguém reclamar de legibilidade.

**O tema vive no `@theme` de `src/index.css`**, não há `tailwind.config`. Cores,
fontes e keyframes entram lá. Utilitários próprios usam `@utility` (e não
`@layer utilities`), senão não aceitam variantes como `md:`.

**A seção 03 abre só com o rótulo "serviços".** O título em duas linhas e a
linha de apoio saíram a pedido, e com eles o `SectionHeading` — era o único
chamador. O componente ficou no repositório sem uso, como o `useHeroScroll`
ficou: se o título não voltar, ele sai.

**Uma seção por arquivo** em `src/sections/`, montadas em `App.tsx`.

**O lado direito da seção 02 é o `DriftWall`**, porte do componente do React
Bits: uma parede de blocos derivando em 3D, com as imagens vindas dos MESMOS
quatro arquivos de `src/assets/trabalhos/` que o `WorkGrid` usa. Quatro
arquivos repetiriam na primeira volta, então cada bloco é um recorte
(`object-position`) — doze blocos de quatro arquivos, sem asset novo. A lista
mora no componente e não na copy: recorte é configuração, não texto. Trabalho
novo na pasta não entra sozinho ali; acrescente as linhas.

**Ele é em PRETO E BRANCO**, e isso resolve um conflito de cor. Os prints têm
cor própria — teal, laranja, branco — e a parede cai justamente onde o `Fundo`
da página tem o clarão sage: duas cores no mesmo lugar, e o print deixa de ler
como print para virar mancha colorida no meio de outra.

Houve uma tentativa de empilhar uma poça de preto atrás da parede para isolá-la
do clarão. Funcionava e ficou feia — uma mancha escura no meio de um fundo
aceso, e mais um objeto para calibrar. Tirar a cor ataca o mesmo conflito pelo
outro lado e não acrescenta camada nenhuma: a parede vira TEXTURA, que é o papel
dela (prova que há trabalho, não mostra qual). O `contrast`/`brightness`
acompanham o `grayscale` porque dessaturar sozinho achata tudo num cinza médio
que some no fundo escuro, e o véu por cima virou preto — com os blocos em cinza,
véu com matiz (era `#060010`) devolve justamente o que a dessaturação tirou e
puxa a parede inteira para o roxo.

Ele é DECORATIVO e vai inteiro em `aria-hidden`: o hover que levanta o bloco e
o `role="button"` do original ficaram de fora, porque a regra da seção é que o
painel não pareça clicável — os trabalhos têm nome, link e aba própria na 03.

No lugar dele havia um painel-janela com uma linha do tempo de três paradas.
Saiu a pedido, e com ele o `metodo.painel` da copy — as três promessas que
aquela linha fazia (escopo e preço fechados, link para acompanhar, domínio e
hospedagem) não estão mais escritas em lugar nenhum do site. As utilidades
`linha-traca`, `bead-lit` e `trail-fill` do `index.css` eram só dela e ficaram
sem uso, como caminho de volta.

**O rodapé é um RETÂNGULO, e o conteúdo dele é o do fork.** O `<footer>` só
dá o padding que vira moldura preta; quem tem forma é o cartão arredondado
dentro dele, com as ondas em degradê (`footer/wavesShaders.ts`) desenhadas no
fundo. A moldura é o que faz o rodapé ler como objeto que fecha a leitura, e é
o que permitiu o fundo animado — numa faixa sangrada, uma onda azul de ponta a
ponta é uma segunda página.

Dentro do cartão mora só o que CONVIDA — título, lede, CTA com o ícone do
WhatsApp e o e-mail como link de texto. A linha de links e o copyright ficam
fora, no preto da página: são etiqueta, não convite. Foi a saída deles que
deixou o cartão encolher, porque antes ele precisava de altura só para aquela
linha não encostar no botão.

O texto é o do fork, com a lede encurtada de três linhas para duas. Ele já foi reescrito uma
vez na composição do "footer 8" do React Bits — ícones sociais e duas colunas —
e isso foi desfeito a pedido. Não o reescreva de novo sem pedirem: o retângulo
e as ondas são embalagem, e foram pedidos; a copy não.

**As meta tags moram no `index.html`.** Sem framework para gerar `<head>`, o
title, a description, o OG e o JSON-LD são escritos à mão — e os robôs de preview
de link não executam JS, então o que eles leem sai de lá, não do React.

**Sem tema claro, e não é pendência.** Os shaders do site nascem de preto e
somam luz, com blend `SRC_ALPHA`: sobre fundo claro nenhum deles clareia, cada
um pinta um retângulo escuro. Vale para o ferrofluido do hero e para as ondas
do rodapé, que ainda por cima têm o preto da página como cor de horizonte. Tema
claro é reescrever shader, não trocar token.

## Armadilhas conhecidas

**Translate no Tailwind v4 compõe com `transform` inline.** Os utilitários de
translate usam a propriedade CSS `translate`, que soma ao `transform` em vez de
substituí-lo. Em elemento posicionado por JS, não use `-translate-x-1/2` — o
deslocamento sai dobrado.

**Não perca o contexto WebGL no cleanup.** `canvas.getContext('webgl2')` devolve
sempre o mesmo objeto para aquele canvas. Chamar `loseContext()` na limpeza do
efeito quebra a remontagem no StrictMode: o shader não compila mais e a árvore
React cai inteira. O `LightBeam` libera shaders, programa e buffer, e nunca o
contexto.

**Efeitos de scroll leem a posição a cada frame** e devem funcionar nos dois
sentidos — nada de estado acumulado que só avança.

**O movimento de entrada das seções 02, 03 e do cartão do rodapé é anime.js
v4** (`hooks/useScrollMotion.ts`): cada bloco tem uma timeline amarrada à
rolagem (`naRolagem`, `onScroll` com `sync: 0.35`), nos dois sentidos, montada
num `createScope` cujo `revert()` desfaz animações, observadores e o
`splitText` dos títulos. Com `prefers-reduced-motion` o hook nem monta, e nada
no CSS esconde conteúdo.

- **Toda timeline nova termina com `assentar(tl)`.** O anime só escreve o valor
  inicial de um tween quando o progresso chega ao começo dele; até lá o
  elemento fica visível e "pisca ao contrário" (a palavra aparece e some quando
  a vez dela chega).
- **Sem `splitText` com `wrap: 'clip'` nos títulos**: com o `leading` apertado
  o recorte come as descendentes ("ç", "g").
- **O `transform` de elemento com `transition`** (ex.: `SpecularButton`) não se
  anima por quadro — use opacidade e `filter`.

**O `LightBeam` virou casco genérico, e o feixe é só um dos shaders.** A prop
`frag` é OBRIGATÓRIO — não há shader padrão. Hoje é UM na página: o
`WAVES_FRAG` no rodapé (porte do React Bits, sem `ogl`). O `ETH_FRAG` (o
losango do botão Web3) e o `PORTAL_FRAG` saíram com a hero antiga, em 09/11/2026.

Já existiram outros quatro, guardados "como caminho de volta": o `BEAM_FRAG`
(feixe do rodapé antigo, que era o valor padrão desta prop), o `NEURO_FRAG`, o
`FERROFLUID_FRAG` (os dois primeiros fundos do hero) e o `THREADS_FRAG` (o
terceiro deles, o leque de fios, que saiu com a hero nova). Saíram todos numa
limpeza, junto com o `ScrambleText` — cinco módulos sem chamador acumulados em
sessões diferentes viram um segundo site fantasma dentro do repositório. O
histórico deles está no git; **guardar caminho de volta é o que o git faz.** Contexto, resize, observers e recuperação de contexto perdido são os
mesmos para todos — qualquer shader que use os uniforms `uRes`/`uT` entra por
ali. Não duplique este arquivo para acrescentar um efeito.

**A `className` do `LightBeam` é o wrapper INTEIRO**, e não um acréscimo a um
wrapper fixo. Era fixa em `absolute left-1/2 w-screen -translate-x-1/2`, o que
só servia a quem atravessa a tela — `w-screen` não se desfaz por outra classe,
porque a ordem das props não decide quem ganha no CSS. As duas faixas de
largura cheia repetem essas classes no call site. A prop `fade` é a duração do
fade de entrada: 1,8s numa faixa é uma coisa grande aparecendo.

A prop `opening` continua lá, sem ninguém passando — é o que o feixe precisaria
se voltasse a ser dirigido por scroll, já que um uniform de shader não lê `--var`.

