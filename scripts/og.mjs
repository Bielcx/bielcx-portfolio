// Gera o `public/og.jpg` — a imagem que WhatsApp, LinkedIn e Slack mostram
// quando o link do site é colado.
//
// Existe porque a imagem é um PRINT DA HOME, e print envelhece em silêncio:
// mexeu no hero, o preview passa a mostrar um site que não existe mais e nada
// acusa. Rodar `pnpm og` é mais barato que perceber isso seis meses depois.
//
//   pnpm og                        # usa o dev server em :5173
//   pnpm og http://localhost:5175
//
// **Precisa do dev server (ou do `pnpm preview`) no ar** — o script não sobe
// nada sozinho de propósito: subir e derrubar servidor daqui é mais código para
// manter do que valor entregue, e quem roda isto está com o site aberto.
//
// Duas armadilhas que este arquivo existe para não deixar acontecer de novo:
//
// 1. **O nome do arquivo tem de bater com o `og:image` do `index.html`.** Já
//    houve aqui um `OGimage.png` que nunca foi usado porque a meta tag pedia
//    `og.jpg`: o preview colava vazio e nada acusava.
// 2. **JPEG, não PNG.** O mesmo quadro sai com 244 KB em PNG e 43 KB em JPEG, e
//    o WhatsApp costuma desistir do preview acima de uns 300 KB.
//
// O print é tirado em escala 1. Já foi tentado em 2x para ter mais resolução, e
// o resultado veio SEM os canvas WebGL: em resolução dobrada o renderizador por
// software não termina dentro do orçamento de tempo. Daí a conferência de pixel
// antes de publicar, em vez de confiar que deu certo.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const SAIDA = join(RAIZ, 'public', 'og.jpg')

/**
 * Os intermediários. O `.gitignore` ignora `scripts/.og-*`, que cobre os três.
 *
 * O JPEG é escrito no PROVISORIO e só vira `public/og.jpg` se a conferência
 * passar. A primeira versão salvava direto no destino e conferia depois: na
 * primeira execução de verdade o print saiu sem os shaders e o script
 * substituiu uma imagem boa por um retângulo preto, avisando só no fim.
 * Ferramenta que corrompe o que deveria manter é pior que não ter ferramenta.
 */
const BRUTO = join(RAIZ, 'scripts', '.og-bruto.png')
const PROVISORIO = join(RAIZ, 'scripts', '.og-provisorio.jpg')
const PERFIL = join(RAIZ, 'scripts', '.og-perfil')

const URL_SITE = process.argv[2] ?? 'http://localhost:5173'
const LARGURA = 1200
const ALTURA = 630
/** Abaixo disto a página está preta: os canvas não desenharam a tempo. */
const PICO_MINIMO = 40

const NAVEGADORES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
]

const navegador = NAVEGADORES.find((caminho) => existsSync(caminho))
if (!navegador) {
  console.error('Nenhum Edge ou Chrome encontrado nos caminhos conhecidos.')
  process.exit(1)
}

/**
 * Confere que a URL responde E que é o site certo, ANTES de abrir o navegador.
 *
 * Sem isto o script fotografa o que estiver ali. Aconteceu: o dev server tinha
 * caído, o Edge printou a página de "não consigo chegar a esta página", e a
 * conferência de pixel APROVOU — o erro do navegador é cinza com botão azul,
 * cheio de pixel aceso. O `og.jpg` foi publicado com a tela de erro.
 *
 * Medir brilho responde "desenhou alguma coisa?", não "desenhou o site". Só o
 * HTML responde isso.
 */
const conferirSite = async () => {
  let html
  try {
    const r = await fetch(URL_SITE)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    html = await r.text()
  } catch (erro) {
    console.error(
      `Não consegui carregar ${URL_SITE} (${erro.message}).
` +
        'Suba o site antes: `pnpm dev` ou `pnpm preview`.',
    )
    process.exit(1)
  }
  if (!html.includes('Gabriel Cavalcanti')) {
    console.error(
      `${URL_SITE} respondeu, mas não é este site — o HTML não tem o nome.
` +
        'Confira a porta: outro projeto pode estar ocupando essa URL.',
    )
    process.exit(1)
  }
}

await conferirSite()

const limpar = () => {
  rmSync(BRUTO, { force: true })
  rmSync(PERFIL, { recursive: true, force: true })
}

mkdirSync(join(RAIZ, 'scripts'), { recursive: true })
limpar()

console.log(`print de ${URL_SITE} em ${LARGURA}x${ALTURA}…`)
execFileSync(
  navegador,
  [
    '--headless=old',
    '--disable-gpu',
    // obrigatório: sem ele o WebGL não renderiza no headless e o print sai preto
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--no-sandbox',
    `--user-data-dir=${PERFIL}`,
    // alto porque os shaders têm fade de entrada e o renderizador por software é
    // lento — e mais alto ainda porque 16s já falhou numa máquina ocupada
    '--virtual-time-budget=24000',
    `--window-size=${LARGURA},${ALTURA}`,
    `--screenshot=${BRUTO}`,
    URL_SITE,
  ],
  { stdio: 'ignore' },
)

if (!existsSync(BRUTO)) {
  limpar()
  console.error('O navegador não gerou o print. O site está no ar nessa URL?')
  process.exit(1)
}

/**
 * Converte para JPEG e mede o pixel mais aceso do quadro.
 *
 * A conversão vai por PowerShell (System.Drawing) porque o Node não codifica
 * JPEG sem dependência, e uma dependência só para isso não se paga num
 * repositório que recusou `ogl` e `three`. É o único trecho preso ao Windows, e
 * está isolado aqui.
 */
const ps = `
Add-Type -AssemblyName System.Drawing
$b = New-Object System.Drawing.Bitmap "${BRUTO.replace(/\\/g, '/')}"
$pico = 0
for ($y = 0; $y -lt $b.Height; $y += 6) {
  for ($x = 0; $x -lt $b.Width; $x += 6) {
    $c = $b.GetPixel($x, $y)
    $v = [math]::Max($c.G, $c.B)
    if ($v -gt $pico) { $pico = $v }
  }
}
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$par = New-Object System.Drawing.Imaging.EncoderParameters(1)
$par.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90L)
$b.Save("${PROVISORIO.replace(/\\/g, '/')}", $enc, $par)
$b.Dispose()
Write-Output $pico
`

const pico = Number(
  execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], {
    encoding: 'utf8',
  }).trim(),
)

limpar()

if (pico < PICO_MINIMO) {
  rmSync(PROVISORIO, { force: true })
  console.error(
    `\nO print saiu sem os fundos WebGL (pico de cor ${pico}, esperado > ${PICO_MINIMO}).\n` +
      'Nada foi alterado: o public/og.jpg que já existia está intacto.\n' +
      'Rode de novo — numa máquina ocupada o renderizador por software às vezes\n' +
      'não termina dentro do orçamento de tempo.',
  )
  process.exit(1)
}

renameSync(PROVISORIO, SAIDA)
console.log(`public/og.jpg gerado — pico de cor ${pico}, os shaders desenharam.`)
