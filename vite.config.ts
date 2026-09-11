import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /**
   * Uma página só, e nenhuma rota no cliente. Sem `mpa` o Vite trata o projeto
   * como SPA e devolve o `index.html` para qualquer caminho, então `pnpm dev`
   * responderia 200 numa URL que em produção é 404 — a Vercel serve arquivo
   * estático e não tem rewrite nenhum. `mpa` alinha os dois.
   */
  appType: 'mpa',
})
