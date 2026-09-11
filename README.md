# Gabriel Cavalcanti — portfólio comercial

Página única em português, fundo escuro, com um hero em WebGL que conduz a
narrativa por scroll. Fala com quem contrata site, loja, painel e automação.

É um de dois portfólios. O outro, de web3 e blockchain, vive em
`Dev/portfolios/web3` (Next.js) e entra aqui como um link no rodapé. O porquê da
divisão está no `AGENTS.md`.

## Stack

| Pacote | Papel |
|---|---|
| Vite 8 | build e dev server |
| React 19 | UI |
| TypeScript | tipos em tudo |
| Tailwind CSS v4 | estilo, via `@tailwindcss/vite` (sem arquivo de config — o tema mora no `@theme` do `src/index.css`) |
| oxlint | lint |
| WebGL2 | o feixe de luz do hero e do rodapé, sem biblioteca |

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

## O que falta

- [ ] revisar a copy: os prazos, os preços e as respostas do FAQ são rascunho
- [ ] prints ou clipes dos quatro trabalhos (hoje aparecem como placeholder)
- [ ] `public/favicon.png` e `public/og.jpg` — ver os `TODO` no `index.html`
- [ ] domínio próprio, e trocar as URLs absolutas do `index.html`,
      `public/robots.txt` e `public/sitemap.xml`
