# portfolios/comercial

Portfólio **comercial** de Gabriel Cavalcanti — desenvolvedor full stack. Página
única em português, fundo escuro, hero alinhada à esquerda sobre um campo
WebGL animado.

## Por que este repositório existe

Existem dois portfólios, e a divisão é de **público**, não de tecnologia:

| | público | onde |
|---|---|---|
| **este** | cliente comercial — quem contrata site, loja, painel, automação | `Dev/portfolios/comercial` |
| **web3** | dev e gente de cripto — quem já sabe o que é blockchain | `Dev/portfolios/web3` (Next.js) |

O portfólio web3 converte bem com quem é do meio e afasta quem não é: a estética
e o vocabulário (Hive, PRs on-chain, terminal) filtram o cliente comercial na
primeira tela. Este site é a porta desse público, e o outro continua vivo,
intacto, para quem sabe o que procura — linkado daqui em DOIS lugares: um botão
na hero (`hero.actions.web3`) e um link no rodapé (`footer.links`). A URL mora
num lugar só, `web3Url` no `src/data/contact.ts`.

O botão da hero é recente e contraria a regra original, que mantinha a palavra
"web3" fora da primeira tela para não confundir o visitante comercial. Foi
decisão do dono, não descuido: se um dia o site voltar a soar técnico demais de
cara, é o primeiro candidato a descer de volta para o rodapé.

**Nunca traga projeto web3 para cá.** A lista de `services.works` é só web2. Foi
a mistura dos dois que criou o problema que este repositório resolve.

### Domínio

Hoje os dois estão em `*.vercel.app`, que **não aceita subdomínio aninhado** —
cada projeto ganha um nome plano. O plano, quando houver domínio próprio:

- raiz (`dominio.com`) → este site
- `web3.dominio.com` → o portfólio Next.js

Até lá, quem define a porta de entrada é qual link é divulgado, não a URL. As
URLs absolutas a trocar quando o domínio existir estão marcadas com `TODO` no
`index.html`, e mais em `public/robots.txt` e `public/sitemap.xml`.

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
contato — hero e rodapé. A hero tem UM CTA ("Começar uma conversa") mais o botão
do "Web3", que não é contato: é saída para outro site, e por isso vem em
`text-ink/60` e com `target="_blank"`.

**Nada no botão avisa que ele sai do site, e isso é decisão, não esquecimento.**
O rótulo era "Portfólio web3" e encolheu para "Web3"; havia uma seta `↗` na
ponta direita e ela saiu, com o losango do Ethereum tomando aquele lugar. Os
dois pedidos foram do dono, em momentos diferentes, e o efeito somado é que o
único sinal de saída — a seta — não existe mais. Se um dia aparecer gente
achando que era uma seção deste site, é aqui que se mexe.

O "Trabalhos no ar", que levava a `#servicos`, saiu da hero — quem quiser chegar
lá tem o menu. Não o traga de volta sem pedirem.

**O losango do Ethereum é 3D de verdade, e tem três degraus.** O `EthMark`
escolhe antes de montar: com WebGL2 e movimento permitido, um octaedro
raymarcado (`ethShaders.ts`) girando com luz; com `prefers-reduced-motion`, o
SVG plano PARADO; sem WebGL2, o SVG plano com a `eth-spin` de sempre, que é o
comportamento antigo. O ícone é o único do site com cor própria
(`text-accent-cool`) — os outros herdam o `currentColor` de quem os contém.

A escolha mora no componente, e não no shader, por duas razões que não são
estilo: um shader não tem como respeitar `prefers-reduced-motion`, e o
`LightBeam` falha em silêncio quando não há contexto — o que serve a uma faixa
decorativa e não a um ícone, porque botão sem a sua marca é defeito que ninguém
percebe. Por isso o `EthMark` testa o WebGL2 num canvas descartável, uma vez.

**A `perspective` do botão continua lá, e serve só ao terceiro degrau**:
`rotateY` sem perspectiva num ancestral achata o giro do SVG. O caminho 3D não
a usa — a projeção é do shader.

**O facho do painel de automação é CSS, não o `AnimatedBeam` do Magic UI.**
Aquele componente desenha um SVG entre dois `ref` quaisquer, com bézier,
`ResizeObserver` e uma dependência de animação (`motion`). Aqui os dois pontos
— "Conversa" e "No ar" — estão na mesma coluna vertical: a curva entre eles é
uma reta, e o que sobra do componente é um degradê andando. São as utilidades
`beam-run` e `beam-bead` do `index.css`.

Os três trechos de fio e as quatro bolinhas são elementos separados; o que os
encadeia num percurso só é o ATRASO (`ATRASO` no `ProcessSteps.tsx`, 1,2s por
passo) casado com os 6s do ciclo, de que a parte acesa ocupa 20% — ou seja
1,2s. **Os dois números andam juntos**: mexeu num, mexa no outro, senão o facho
some antes de a bolinha acender. O resto do ciclo é pausa, de propósito: sem
ela o painel pisca sem parar ao lado do texto que se veio ler.

**Nada de three.js.** Ele foi considerado e recusado para este losango: ~120 KB
gzip contra os 77 KB do site inteiro, para desenhar um ícone de 18px que o
casco WebGL2 daqui já desenha de graça.

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

**A cortina é de quem vem logo depois do hero.** A margem negativa `-mt-[80vh]`,
o `z-10` e o fundo opaco moram no `Metodo`, e esse `-mt` é o ÚNICO número que
decide quando a seção 02 chega — o hero não tem mais contrapartida a manter em
dia. Mudou a ordem das seções, a cortina anda junto.

**A página é toda preta, e `--color-surface` não existe mais.** O cinza que
separava a seção de serviços do resto saiu: quem separa uma seção da outra é a
luz — a faixa do `beam-dock` no alto da 02 e o campo de estrelas atrás dela.
Continua havendo `--color-surface-raised`, que é de botão e não de seção.

**Não há campo de estrelas.** O `Starfield` rodava no hero e na seção 02 e saiu
do site inteiro a pedido. O `sopa-agency`, de onde esta base veio, ainda o tem
— não o traga de volta ao sincronizar com ele.

**A hero é centrada e não tem fundo.** Ela já foi alinhada à esquerda sobre um
campo WebGL — filamentos, depois o ferrofluido —, e os dois saíram a pedido. O
alinhamento à esquerda saiu junto porque existia para deixar a metade direita
livre para o campo; sem campo, ele não tinha motivo.

**O hero sai inteiro no scroll.** O `--hw` do `useHeroScroll` apaga o bloco de
texto E o canvas dos fios, os dois no mesmo valor — o canvas recebe
`[opacity:var(--hw,1)]` na `className`, porque o `LightBeam` não aceita `style`.
O fade existe porque a seção 02 sobe como cortina opaca por cima do hero preso,
e sem ele a aresta corta o nome ao meio.

**O efeito colateral, decidido a pedido:** com o fundo apagando junto, o quadro
fica PRETO E PARADO entre o texto sair e a cortina cobrir. Manter o campo aceso
naquele intervalo era o que evitava isso, e foi trocado de propósito. Se um dia
incomodar, a saída é atrasar o `FADE` do hook — não tirá-lo.

**O nome da hero é `font-display` (Bricolage Grotesque), a mesma do h2 da seção
02.** Era `font-serif` (Instrument Serif) e a troca não é só de família: a
Bricolage é bem mais larga, e o `WORDMARK_SIZE` caiu de `9.5vw` para `7vw` junto
(e depois para `6.2vw`, quando o nome passou a quebrar em duas linhas num bloco
alinhado à esquerda). Trocar a fonte do nome é sempre remedir o clamp.

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

**O card do hero é preto, e o `--color-stroke` ficou calibrado para o cinza que
ele era:** está em 0.42 porque foi subido para o contorno do nome vencer o
degradê, e no preto de hoje isso é exagero. A lista está por extenso no
`index.css`, e o outro item dela — o card "soltando das bordas" com o `--p` do
scroll — deixou de existir junto com a coreografia da hero antiga. Não é bug a
consertar de surpresa, é decisão pendente.

## Armadilhas conhecidas

**O corpo do nome no hero é calibrado ao comprimento dele.** O `WORDMARK_SIZE`
é `clamp(40px, min(6.2vw,13vh), 104px)`, calculado para "Gabriel Cavalcanti" em
DUAS linhas dentro do bloco de `max-w-[58ch]` alinhado à esquerda. Já foi `9.5vw`
com a Instrument Serif numa linha só, e `7vw` com a Bricolage — o número anda com
a fonte, com o comprimento do nome E com a largura do bloco. Não há mais
`whitespace-nowrap` segurando uma linha só, então o sintoma de descalibragem
mudou: em vez de vazar da tela, o nome quebra em três linhas e come a altura dos
botões. Mexeu num dos três, meça de novo.

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

**O `LightBeam` virou casco genérico, e o feixe é só um dos shaders.** A prop
`frag` é OBRIGATÓRIO — não há shader padrão. São três na página: o
`THREADS_FRAG` no hero, o `WAVES_FRAG` no rodapé (os dois portes do React Bits,
sem `ogl`) e o `ETH_FRAG` no botão do hero. Dá para contar os contextos no log
do headless.

Já existiram outros três, guardados "como caminho de volta": o `BEAM_FRAG`
(feixe do rodapé antigo, que era o valor padrão desta prop), o `NEURO_FRAG` e o
`FERROFLUID_FRAG` (os dois primeiros fundos do hero). Saíram todos numa
limpeza, junto com o `ScrambleText` — cinco módulos sem chamador acumulados em
sessões diferentes viram um segundo site fantasma dentro do repositório. O
histórico deles está no git; **guardar caminho de volta é o que o git faz.** Contexto, resize, observers e recuperação de contexto perdido são os
mesmos para todos — qualquer shader que use os uniforms `uRes`/`uT` entra por
ali. Não duplique este arquivo para acrescentar um efeito.

**A `className` do `LightBeam` é o wrapper INTEIRO**, e não um acréscimo a um
wrapper fixo. Era fixa em `absolute left-1/2 w-screen -translate-x-1/2`, o que
só servia a quem atravessa a tela — `w-screen` não se desfaz por outra classe,
porque a ordem das props não decide quem ganha no CSS. As duas faixas de
largura cheia repetem essas classes no call site; o losango de 18px passa
`block size-[18px] shrink-0`. A prop `fade` é a duração do fade de entrada:
1,8s numa faixa é uma coisa grande aparecendo, e num ícone é botão quebrado.

A prop `opening` continua lá, sem ninguém passando — é o que o feixe precisaria
se voltasse a ser dirigido por scroll, já que um uniform de shader não lê `--var`.

**O `useHeroScroll` voltou, reduzido a uma variável.** Ele publica `--hw`
(1→0) no track do hero, e o bloco de texto apaga e sobe um pouco com ela. Existe
por causa da cortina: a seção 02 sobe opaca por cima do hero preso, e sem o fade
ela corta o bloco na horizontal — com os dois pretos, o que se vê é só a costura
de luz da aresta atravessando o nome, que lê como emenda de página. O fundo
ferrofluido NÃO apaga junto, senão sobra tela preta esperando.

O `--p` (o card fechando as bordas) e o fade em dois tempos (`--hc` para a
moldura, `--hw` para o nome) saíram: não há mais card, e a composição de hoje é
um bloco só.

**O `-mt-[80vh]` do `Metodo` e o `FADE` do `useHeroScroll` são UM PAR**, e a
conta está comentada nos dois. Com 180vh de track e 80vh de margem, a aresta da
cortina já está no pé da tela no carregamento e sobe 1vh por vh de rolagem; o
fade termina em 0.56 do percurso preso, que é 45vh de rolagem, com a cortina a
55vh do topo. Os dois se cruzam no meio da tela.

Desencontrar tem DOIS sintomas opostos, os dois silenciosos: fade cedo demais
(ou cortina tardia) deixa meia tela de preto parado esperando — pior desde que
o fundo animado passou a apagar junto com o texto; fade tarde demais deixa a
cortina cortar o nome ainda aceso, que é o motivo de o fade existir.
