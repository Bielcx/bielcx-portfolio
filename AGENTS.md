# portfolios/comercial

Portfólio **comercial** de Gabriel Cavalcanti — desenvolvedor full stack. Página
única em português, fundo escuro, hero centrada sobre um canvas de automação —
o nome como nó, quatro cards de resultado plugados nele por cabos animados.

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

Este site atende em **`gabriel.doabridge.com`**, e o web3 em
`gabrielcavalcanti.vercel.app`.

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

**O painel da faixa de automação é o `AgentDemo`: uma conversa que funciona.**
A linha "Agente de IA" é a mais difícil de vender por escrito — quem lê imagina
um menu de robô —, então o painel deixa o visitante conversar com um, no lugar
do cliente DELE. Os quatro chips provam o que separa um agente de um menu: a
linha de passo ("consultando a agenda") mostra que ele consulta algo antes de
responder, a resposta é frase e não opção numerada, e a última pergunta cai no
caso em que ele chama uma pessoa.

**As respostas são roteiro, escritas à mão em `services.agente`, e a nota do
rodapé do painel diz isso** — sem ela é propaganda enganosa. Modelo de verdade
aqui é função serverless, chave de API, custo por visita e campo de texto
aberto para desconhecido, num site que não tem backend. Se um dia virar
modelo, o que muda é de onde `resposta` vem. **Sem campo de texto livre, de
propósito**: campo aberto convida a testar o que o roteiro não responde, e o
que o visitante leva embora é a falha.

O negócio é inventado. Nome de cliente real ali é promessa de que aquele agente
está no ar, e promessa que a página faz o cliente cobra.

**Toda resposta responde primeiro, com dado concreto, e só então oferece o
passo seguinte** — inclusive a que ele não resolve, que diz o que sabe antes de
chamar uma pessoa. A abertura já foi um cartão de visita ("sou o atendimento
do Estúdio Vélo, vejo horário, preço e agendo") logo depois de "vocês têm aula
hoje?": o cliente perguntou uma coisa e ouviu outra, que é o robô de menu que
este painel existe para desmentir. Resposta nova que não caiba nessa ordem está
errada.

**A moldura de iPhone é porte do Magic UI**, como o `LightBeam` e o
`DriftWall` são portes do React Bits — SVG, sem dependência e sem imagem. Ela
existe para a conversa ler como o WhatsApp DO CLIENTE do visitante, que é onde
o serviço roda, sem pôr o logo do WhatsApp numa faixa que proíbe logo de
ferramenta.

**O original só sabe pôr `src` ou `videoSrc` na tela**, e a nossa tela é HTML
vivo — botão, rolagem, `aria-live`. As duas props saíram e a máscara dele
mudou de função: o `furo` vaza o retângulo da tela do corpo do aparelho e a
conversa aparece por baixo; a ilhota fica fora do grupo mascarado e por isso
continua por cima dela. Três coisas quebram em silêncio se forem mexidas:

- **`pointer-events-none` no SVG.** Ele cobre o aparelho inteiro, furo
  incluído — sem isso os chips não recebem clique, e nada no visual acusa.
- **A tela é posicionada em % das constantes do desenho** (`LARGURA`,
  `TELA_X`…), nunca em pixel, e o raio vai em `X% / Y%`: com um valor só o
  canto sai oval, porque a tela não é quadrada.
- **O `pt-12` do cabeçalho é a ilhota** e o `pb-7` dos chips é a barra de
  gesto. São respiro de aparelho, não espaçamento à toa.

A largura de 272px é um TETO: os balões foram escritos para caber em linha de
celular, então alargar a moldura é reescrever a conversa. O halo por trás não é
enfeite — o aparelho é preto como a página, e sem ele some no fundo.

**Dentro do furo a paleta é a do WhatsApp no escuro** (`ZAP`, no componente), e
é a única coisa do site fora dos tokens do tema. É deliberado: o que está na
tela não é o site, é OUTRO aplicativo aberto no telefone do cliente — pintado
com o preto e o azul da página, o mockup vira mais um painel do portfólio. O
verde não vaza para fora do furo, e continua não havendo logo nem a palavra
WhatsApp na faixa; quem nomeia o canal é a nota em texto, embaixo do aparelho.

Duas coisas fazem a tela parar de parecer maquete, e as duas foram descobertas
olhando: **a conversa cresce de baixo para cima** (`min-h-full` + `justify-end`
no miolo do log) e **já começa em andamento**, com o oi do cliente e a resposta
do agente. Com um balão só no alto sobravam uns 400px de vazio, e aplicativo de
mensagem nenhum se parece com isso. O tique duplo é desenhado à mão pelo
`Tique`: o `check` do `Icon` é um certo dentro de um círculo, e dois círculos
sobrepostos viram um diagrama de Venn no canto do balão.

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

**A hero é um CANVAS DE AUTOMAÇÃO: o nome é o nó central e quatro cards de
resultado ficam plugados nele por cabos com pulsos correndo dentro.** Veio de
um handoff de design em HTML, recriado componente a componente e com os valores
exatos dele (cores, curvas, keyframes). O motivo é comercial: a hero anterior
era nome, dois botões e uma linha, e nada nela dava MOTIVO para rolar. Aqui as
duas frentes aparecem em dois segundos — dois cards em `sky` (automação) e dois
em `sage` (landing page), que é como a primeira tela diz que são dois serviços
sem escrever isso.

**OS NÚMEROS DOS CARDS SÃO RASCUNHO DO DESIGN e não podem ir ao ar assim.**
"18h por semana", "142 tarefas hoje", "7 dias", "4,8% de conversão" e o "3
rodaram enquanto você lia" saíram do protótipo, que diz por escrito que são
placeholders. Promessa que a primeira tela faz é a que o cliente cobra na
reunião, e esta faz quatro. A nota está por extenso em `hero.provas`.

**O fundo é só LUZ.** Preto sólido com duas radiais nascendo abaixo da borda
de baixo (`116%`): azul à esquerda (automação) e sage à direita (landing), as
mesmas cores dos cards, mais um véu frio que costura as duas num clarão só.
Nascer do rodapé é o que puxa o olho para baixo, que é para onde esta hero
existe para mandar. A primeira versão do handoff tinha uma grade quadriculada
de 56px no lugar; a segunda a tirou, e se ela voltar é NO LUGAR das luzes —
juntas, empastelam o miolo onde o nome mora.

As camadas, de baixo para cima: preto, luzes, véu frio, cabos (SVG), cards,
vinheta e o bloco central. **A vinheta é o que faz os cabos SAÍREM do nome**:
os quatro terminam por volta de 50% da largura, atrás das letras, e se
chegassem acesos até lá o desenho leria como linhas passando POR CIMA do nome.
Ela foi aberta de 34%×38% para 44%×48% e o centro desceu para 52% justamente
para apagar o tracejado antes das letras e em volta dos botões. O
`text-shadow` não substitui isso: ele recorta o glifo, mas não escurece o vão
entre uma letra e outra, que é por onde o tracejado passa. A sombra do nome
tem três raios pelo mesmo motivo — 26px cola na letra, 70px (o do handoff) é o
corpo, 130px é o escurecimento largo.

Aumentar mais o alcance da vinheta começa a comer os cards nos cantos; é o
teto desse número.

**Os dois botões são o mesmo do rodapé** (`SpecularButton` com a classe do
"Tirar um projeto do papel"), e isso contraria o handoff, que os desenha como
retângulo chapado. Foi decisão do dono, com duas diferenças para o rodapé:

- **fundo transparente**, e não `bg-surface-raised`: sobre as duas luzes do
  fundo, superfície própria vira um retângulo cinza flutuando na frente do
  clarão. Quem desenha o botão aqui é a borda e o contorno especular;
- **`idleGlow` (prop nova do `SpecularButton`, padrão 0)**: o contorno nasce
  aceso no estado "mouse começando a chegar" em vez de esperar o ponteiro
  entrar na `proximity`. É piso, não soma — de perto o brilho continua indo a
  1. No rodapé o piso segue zero: lá o botão chega no fim da leitura e acender
  na aproximação é o convite; na hero ele é a primeira coisa que se olha, e
  apagado é um retângulo de borda fina. É também o que o celular passa a ver,
  onde não há ponteiro e a varredura já rodava sobre brilho zero.

O preço são dois contextos WebGL a mais na primeira tela — quatro com o
losango e o rodapé; se pesar em celular fraco, o primeiro a virar `<a>` chapado
é o Web3, que é saída e não CTA.

**Cabos e cards vivem no MESMO palco, e o card não tem posição própria: ele
pendura na ponta do cabo.** É a correção de um desalinhamento que era
estrutural — os cabos moravam na grade do SVG (1240×700, escalada por `slice`)
e os cards em `%` da tela, duas grades que coincidem numa proporção de janela
e se afastam em todas as outras. O sintoma era o cabo chegando no vazio ao
lado do card.

**Os fios e o flutuar dos cards correm no MESMO relógio**, e isso não é
elegância — é o que os mantém grudados. Enquanto o flutuar era um
`@keyframes` (card subindo e descendo 10px) e o fio nascia num ponto fixo do
desenho, a ponta descolava do card: animação CSS começa quando o elemento
monta, o `requestAnimationFrame` conta de outro zero, e os dois se afastam. É
o mesmo erro que a rede de nós teve entre SMIL e CSS. Hoje o loop do
`Cables.tsx` calcula a boia uma vez por card e usa o número nos dois lugares —
escreve o `transform` do card e soma na ponta do fio.

De onde o fio sai é **medido**, não calculado: um `[data-plug]` de tamanho
zero no CENTRO do card é lido uma vez por resize, já com a rotação e o flutuar
aplicados. Em trigonometria seria preciso a altura do card, que depende do
texto.

**O centro, e não o canto** — foram três tentativas. No vértice da caixa o fio
começava no ar, porque com `rounded-[14px]` a borda pintada curva para dentro
e o vértice cai a uns 4px de qualquer traço. Recuado 9px a distância mede zero
e ainda assim lê como fresta: o traço termina em cima da borda de 1px e o
antialias das duas coisas no mesmo pixel desenha uma linha clara entre elas.
Do centro não há o que alinhar — o trecho inicial fica coberto pelo card
(opaco, e desenhado depois do SVG), e o que se vê é a linha saindo de trás
dele. Vale em qualquer ângulo, raio de borda e altura do flutuar.

Hoje o `PALCO` é uma caixa com a proporção exata do `viewBox`, e daí sai tudo:
o SVG encaixa nela sem distorcer e uma coordenada do desenho vira porcentagem
do palco por uma conta só (`ancora`). Cada card recebe essa porcentagem e
encosta nela pelo canto que olha para o centro (`canto`, com 10px de folga).
Mexer num cabo move o card junto, de graça.

Dois números mandam nisso e não são estilo:

- **O palco usa `min()`, não `max()`.** Com `max()` ele COBRE a tela como o
  `slice` do handoff — e numa janela alta (1200×1000) fica meia tela mais
  largo que a viewport, levando os cards plugados para fora da borda. Com
  `min()` ele CABE: a cena encolhe e se aproxima do nome, ao preço de margem
  preta nas laterais em monitor ultralargo.
- **O palco assume que a seção ocupa a viewport inteira** (os `vw`/`svh` dos
  tamanhos). É o que o `h-viewport` do pai garante hoje; se a hero ganhar
  margem um dia, estes viram unidades de container (`cqw`/`cqh`), senão o
  palco descola da seção e o alinhamento erra de novo — em silêncio.

**Abaixo de 820px os cabos e os cards somem** e entra uma grade 2×2 com os
mesmos quatro ganchos (`curto`, na copy). Sem ela a primeira tela do celular
volta a ser nome e dois botões, que é o problema que esta hero resolve. Entre
820 e 1100 os cards encostam nas bordas e encolhem com `scale-[0.86]` — a
propriedade `scale` do Tailwind v4, que COMPÕE com o `transform` do keyframe;
um `transform: scale()` ali seria apagado pela animação no primeiro quadro.

**O hero sai em DOIS TEMPOS, e os dois existem por um erro oposto.** O `--hw`
leva o bloco de texto quando a aresta da cortina chega nele; o `--hs` leva a
cena — luzes, fios e cards — depois, e ela SOBE 16vh enquanto apaga.

- apagando tudo junto (e cedo), sobrava meia tela de preto parado esperando a
  cortina, que também é preta até prender e mostrar o conteúdo dela;
- não apagando a cena, a chapa opaca subia cortando quatro cards acesos no ar
  — com o nome já fora, era isso que lia como defeito;
- apagando a cena sem movimento, ela ainda era "comida" pela aresta: o que
  conserta é ela sair de quadro por cima, e a cortina encontrar o vazio.

Os três números (`FADE`, `CENA` e o `-mt-[80svh]` do `Metodo`) são um par só.
Mexeu num, refaça a conta dos outros.

**O nome da hero é `font-display` (Bricolage Grotesque), a mesma do h2 da seção
02**, em duas linhas — e a quebra é da copy (`hero.wordmark` é um array), não
do navegador. A ÚLTIMA LETRA da última linha sai no azul do acento, e quem
fatia é o `Hero.tsx`: um `<span>` no meio de uma string de conteúdo é marcação
disfarçada de texto. O `WORDMARK_SIZE` é `clamp(44px,8.4vw,96px)`, do design;
já foi `9.5vw` com a Instrument Serif numa linha só, `7vw` e `6.2vw` com a
Bricolage. Trocar a fonte do nome é sempre remedir o clamp.

**O que a hero antiga levou embora:** o campo de fios WebGL
(`threadsShaders.ts`, apagado — o `LightBeam` continua no rodapé e no losango),
as três camadas do nome (sombra, contorno respirando e o facho) e, com elas, o
`text-shine`, o `breathe` e os tokens `--color-stroke*` do `index.css`. O nome
de hoje é uma camada só com sombra preta larga. Está tudo no git.

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

## Armadilhas conhecidas

**O corpo do nome no hero é calibrado ao comprimento dele.** O `WORDMARK_SIZE`
é `clamp(44px, 8.4vw, 96px)`, do handoff, e vale para "Cavalcanti" — a maior das
duas linhas de `hero.wordmark` — na Bricolage. O número anda com a fonte E com o
comprimento da linha; o sintoma de descalibragem não é mais vazar da tela, é o
nome comer a altura de que os botões e a grade 2×2 do celular precisam embaixo.
Mexeu num dos dois, meça de novo.

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
`frag` é OBRIGATÓRIO — não há shader padrão. São DOIS na página: o
`WAVES_FRAG` no rodapé (porte do React Bits, sem `ogl`) e o `ETH_FRAG` no
losango do botão da hero. Dá para contar os contextos no log do headless.

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
