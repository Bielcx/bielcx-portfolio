# gabriel-comercial

Portfólio **comercial** de Gabriel Cavalcanti — desenvolvedor full stack. Página
única em português, fundo escuro, hero em WebGL conduzido por scroll.

## Por que este repositório existe

Existem dois portfólios, e a divisão é de **público**, não de tecnologia:

| | público | onde |
|---|---|---|
| **este** | cliente comercial — quem contrata site, loja, painel, automação | `C:\Users\bielc\Dev\gabriel-comercial` |
| **web3** | dev e gente de cripto — quem já sabe o que é blockchain | `C:\Users\bielc\Dev\portfolio` (Next.js) |

O portfólio web3 converte bem com quem é do meio e afasta quem não é: a estética
e o vocabulário (Hive, PRs on-chain, terminal) filtram o cliente comercial na
primeira tela. Este site é a porta desse público, e o outro continua vivo,
intacto, para quem sabe o que procura — linkado discretamente no rodapé daqui
(`footer.links`, e a URL no `src/data/contact.ts`).

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

Este projeto é um fork do `C:\Users\bielc\Dev\Sopa\sopa-agency`, o site da
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
  `src/assets/trabalhos/`. Os `TODO` do `index.html` marcam o que falta repor.

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
`metodo`, `services`, `faq`, `footer`). Componentes não têm texto embutido — nem
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
contato — hero e rodapé. Três CTAs dizendo "Entre em contato" é a repetição da
frase, não a quantidade de botões, que faz a página soar insistente. O ícone do
WhatsApp fica só no rodapé: repetido em todos vira textura, e no rodapé — último
ponto, de quem leu a página inteira — saber o canal ajuda quem está decidindo.
Ao acrescentar um CTA: o rótulo diz o que acontece a seguir e nunca é igual ao de
outro botão da página.

**O menu é só navegação.** Quatro links do mesmo padrão, sem CTA no meio —
"Contato" aponta para o `id="contato"` do rodapé, e é lá que está o botão.

**O e-mail é link de texto ao pé do CTA do rodapé, não um segundo botão.**
`mailto:` como botão principal é aposta ruim: quem não tem cliente de e-mail
configurado clica e nada acontece.

**O número do WhatsApp tem 13 dígitos** (55 + DDD + 9). Conte antes de trocar:
faltando um, o `wa.me` não reclama, só abre conversa vazia, e todo CTA do site
vira link morto sem aviso.

**A cortina é de quem vem logo depois do hero.** A margem negativa `-mt-[40vh]`,
o `z-10`, o fundo opaco e a sombra para cima moram no `Metodo`. Mudou a ordem das
seções, a cortina anda junto.

**O tema vive no `@theme` de `src/index.css`**, não há `tailwind.config`. Cores,
fontes e keyframes entram lá. Utilitários próprios usam `@utility` (e não
`@layer utilities`), senão não aceitam variantes como `md:`.

**Uma seção por arquivo** em `src/sections/`, montadas em `App.tsx`.

**As meta tags moram no `index.html`.** Sem framework para gerar `<head>`, o
title, a description, o OG e o JSON-LD são escritos à mão — e os robôs de preview
de link não executam JS, então o que eles leem sai de lá, não do React.

**Sem tema claro, e não é pendência.** O `LightBeam` acumula cor partindo de
`vec3(0.0)` e soma luz, com blend `SRC_ALPHA`: sobre fundo claro ele não clareia,
pinta um retângulo escuro com riscos. O `Starfield` tem o mesmo problema, e o
`--color-stroke` da palavra gigante está calibrado para o degradê do card. Tema
claro é reescrever os shaders, não trocar tokens.

**O card do hero é preto, e três coisas ficaram calibradas para o cinza que ele
era:** o efeito de "soltar das bordas" ficou invisível (o `--color-frame` atrás
também é preto), e os alfas do `Starfield` e do `--color-stroke` estão altos
porque foram subidos para vencer o degradê. A lista está por extenso no
`index.css`. Não são bugs a consertar de surpresa — são decisões pendentes.

## Armadilhas conhecidas

**A palavra gigante do hero tem quatro letras, e não é escolha estética.** O
`WORDMARK_SIZE` é `clamp(96px, min(36vw,30vh), 380px)`, calibrado para palavra
curta — por isso "BIEL" e não "GABRIEL", que nesse corpo vaza da tela no celular.
O nome inteiro entra logo abaixo, no `hero.label`. Trocar por palavra mais longa
é recalibrar o clamp.

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

**O feixe não se dirige por variável CSS.** O `useHeroScroll` publica `--p`,
`--hc` e `--hw` no track, mas a abertura do feixe viaja num ref (`beamRef`) até o
`LightBeam`: quem desenha é um shader, e um uniform não lê `--var`. O rodapé não
passa o ref — é assim que o feixe de lá fica em repouso.
