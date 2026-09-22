/**
 * O FUNDO DA PÁGINA INTEIRA — uma camada só, atrás de tudo.
 *
 * **Por que existe.** As luzes moravam dentro da hero e o resto da página era
 * `#000` chapado: dois materiais diferentes encostando, e a emenda entre eles
 * aparecia como listra. Consertar a emenda com uma faixa de esfumado conserta o
 * sintoma; o defeito é ter DOIS fundos opacos. Dois fundos opacos sempre
 * produzem uma costura em algum lugar — foi assim com a cortina da seção 02, e
 * foi assim de novo quando a cortina saiu.
 *
 * Aqui há um fundo só. A hero, a 02, a 03 e o rodapé são transparentes e
 * flutuam sobre ele, então não existe borda entre seção e seção para cortar
 * nada. É o mesmo desenho, continuando.
 *
 * **`absolute`, nunca `fixed`.** Preso na viewport, um gradiente deste tamanho
 * se refaz a cada tela: o clarão volta ao mesmo lugar em todo screenful e o
 * olho lê a página escorregando por cima de um papel de parede parado. Esticado
 * no documento, ele é o papel, e a página anda por cima.
 *
 * O `-z-10` e o `isolate` do `<main>` são um par: sem o isolamento, este
 * elemento negativo escaparia para trás do `<body>` e sumiria.
 */
export function Fundo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-frame">
      {/*
        AS DUAS LUZES DA PRIMEIRA TELA, e os números foram CONVERTIDOS, não
        redesenhados.

        Na hero elas viviam numa caixa de 100svh, com centro em `116%` e raio
        vertical de `48%` — ou seja, o centro 16% abaixo do pé da caixa. Isso é
        o que faz o clarão nascer do rodapé e puxar o olho para baixo, e é a
        razão do fundo inteiro. Também era o que produzia o corte: o gradiente
        seguia vivo quando a caixa acabava, e o `overflow-hidden` o cortava a
        faca.

        A caixa aqui é de 150svh para o gradiente TERMINAR dentro dela. Com
        isso as porcentagens mudam de denominador, e só por isso:

          centro   116% de 100svh = 1,16 tela  →  1,16 / 1,5 = 77,33%
          raio     48% de 100svh  = 0,48 tela  →  0,48 / 1,5 = 32%
          véu      112% e 34%     →  74,67% e 22,67%

        Nos primeiros 100svh o desenho é o MESMO de antes, pixel a pixel — é a
        mesma geometria absoluta. O que muda é que abaixo disso ele se apaga
        sozinho em vez de ser cortado. **Mexeu na altura da caixa, refaça as
        três divisões.**
      */}
      <div className="absolute inset-x-0 top-0 h-[150svh] bg-[radial-gradient(58%_32%_at_16%_77.33%,rgba(84,116,168,0.34),transparent_70%),radial-gradient(58%_32%_at_84%_77.33%,rgba(122,154,92,0.26),transparent_70%)]" />

      {/* O véu frio que costura o azul e o sage num clarão só, em vez de dois
          holofotes separados. Mesma conversão de denominador. */}
      <div className="absolute inset-x-0 top-0 h-[150svh] bg-[radial-gradient(70%_22.67%_at_50%_74.67%,rgba(170,200,245,0.10),transparent_72%)]" />

      {/*
        O ECO, daí para baixo — o que impede a página de virar preto chapado
        depois da primeira tela, que é o que a fazia parecer outro site.

        Mesma paleta (azul à esquerda, sage à direita), bem mais fraca: na hero
        os alfas são 0,34 e 0,26 porque ali o clarão é o assunto; aqui ele é
        textura, e passar disso compete com o conteúdo.

        **Repete em ladrilho, e não em posições fixas.** A página cresce quando
        entra trabalho novo na grade da 03, e glow ancorado em pixel ficaria
        órfão no meio do nada. Cada ladrilho tem o centro em 50% e apaga em 70%
        do raio, então as emendas entre ladrilhos caem em transparente — é o que
        evita trocar uma costura por outra.
      */}
      <div className="absolute inset-x-0 top-[150svh] bottom-0 bg-[length:100%_1100px] bg-repeat-y bg-[radial-gradient(46%_26%_at_14%_50%,rgba(84,116,168,0.10),transparent_70%),radial-gradient(46%_26%_at_86%_50%,rgba(122,154,92,0.08),transparent_70%)]" />
    </div>
  )
}
