# Gabriel Cavalcanti — portfólio comercial

Página única em português, fundo preto, com três fundos WebGL escritos à mão e
nenhuma biblioteca de animação. Fala com quem contrata site, loja, painel e
automação.

É um de dois portfólios. O outro, de web3 e blockchain, é um projeto Next.js
separado e entra aqui em dois lugares: um botão na hero e um link no rodapé. O
porquê da divisão está no `AGENTS.md` — e ela é de PÚBLICO, não de tecnologia.

## Stack

| Pacote | Papel |
|---|---|
| Vite 8 | build e dev server |
| React 19 | UI |
| TypeScript | tipos em tudo |
| Tailwind CSS v4 | estilo, via `@tailwindcss/vite` (sem arquivo de config — o tema mora no `@theme` do `src/index.css`) |
| oxlint | lint |
| WebGL2 | os fios do hero, as ondas do rodapé e o losango 3D do botão — shaders à mão, sem `ogl` nem `three` |

Sem roteador, sem CMS, sem backend: tudo é estático e o conteúdo vem de um
módulo TypeScript.

## Rodar

Requer **Node >= 20.19** e **pnpm** (fixado em `packageManager`; se não estiver
instalado, `corepack enable` resolve).

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc -b && vite build  -> dist/
pnpm preview    # serve o dist/ para conferir o build
pnpm lint
```

## Mexer no conteúdo

Toda a copy está em `src/data/content.pt.ts`, por seção. Os canais de contato —
WhatsApp, e-mail e a URL do portfólio web3 — estão em `src/data/contact.ts`.
Componente nenhum tem texto embutido.

Para publicar um trabalho na grade, salve a imagem em
`src/assets/trabalhos/<slug>.png` usando o `slug` que está em `services.works`.
Um `.mp4` de mesmo slug faz o trabalho aparecer em movimento.

A parede de trabalhos da seção 02 usa os mesmos arquivos, mas tem lista própria
(`TRABALHOS`, no `components/metodo/DriftWall.tsx`): lá cada trabalho aparece em
recortes, e acrescentar um é uma linha. A grade e a parede são curadas à mão e
não precisam bater — a grade tem quatro de propósito, para não quebrar.

## O que falta

- [ ] revisar a copy: os prazos e os preços são rascunho e precisam bater com o
      que é praticado de verdade antes de o site ir ao ar
- [ ] a primeira tela não diz o que o site faz — hoje é só o nome e dois botões
- [ ] domínio próprio. A URL do deploy aparece em **seis lugares acoplados**:
      `canonical`, `og:url`, `og:image` e o `url` do JSON-LD no `index.html`,
      mais o `Sitemap:` do `public/robots.txt` e o `<loc>` do
      `public/sitemap.xml`. Trocar num sem trocar nos outros é erro silencioso —
      o site fica no ar e só o preview de link e a indexação quebram.
