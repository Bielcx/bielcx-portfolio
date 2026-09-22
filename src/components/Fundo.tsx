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
        AS DUAS LUZES DA PRIMEIRA TELA — e a regra que manda aqui é:
        **a luz TERMINA dentro da hero. Sozinha, sem máscara.**

        No desenho original o centro ficava em `116%`, ou seja 16% ABAIXO do pé
        da tela, com raio vertical de 48%: a luz nascia do rodapé e o que se via
        era a metade de cima de uma bola gigante. Isso dá um clarão bonito e um
        problema estrutural — a parte mais acesa do gradiente cai FORA da hero,
        em cima da seção 02. Medido, o pico ficava em y=1044, 144px dentro da
        02, e o rabo chegava a y=1346, por cima da parede de trabalhos.

        Isso foi remendado três vezes (caixa de 150svh, máscara linear, corte em
        66/85%) e as três vezes o sintoma voltou com outro nome: listra, faca,
        borrão. É sempre o mesmo defeito — um gradiente cortado por uma reta tem
        uma borda reta, e borda reta no meio de um fundo contínuo se vê.

        Agora o centro está em 80% e o raio vertical em 26%, então a parada de
        70% (onde o `transparent` chega) cai em:

          centro   0,80 × 900 = y 720
          alcance  0,70 × 0,26 × 900 = 164px
          fim      720 + 164 = y 884   →  16px ANTES do pé da hero (900)
          início   720 − 164 = y 556

        A luz vira uma poça na parte de baixo da primeira tela em vez de um
        nascente vindo de fora dela. Nada é cortado, então não há borda; a
        seção 02 recebe preto limpo e a parede de trabalhos não briga com cor.

        **Mexeu na altura da hero, refaça essas duas contas.** Se o fim passar
        de 900, a cor volta a invadir a 02 — e a correção é encolher o raio ou
        subir o centro, NUNCA pôr máscara de novo.
      */}
      <div className="absolute inset-x-0 top-0 h-viewport">
        <div className="absolute inset-0 bg-[radial-gradient(58%_26%_at_16%_80%,rgba(84,116,168,0.28),transparent_70%),radial-gradient(58%_26%_at_84%_80%,rgba(122,154,92,0.22),transparent_70%)]" />

        {/* O véu frio que costura o azul e o sage num clarão só, em vez de dois
            holofotes separados. Fica um pouco mais baixo e mais largo que os
            dois, e também termina dentro da caixa. */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_20%_at_50%_82%,rgba(170,200,245,0.09),transparent_72%)]" />
      </div>

      {/*
        O ECO, daí para baixo — o que impede a página de virar preto chapado
        depois da primeira tela, que é o que a fazia parecer outro site.

        Mesma paleta, bem mais fraca: na hero os alfas são 0,28 e 0,22 porque
        ali o clarão é o assunto; aqui ele é textura, e passar disso compete com
        o conteúdo.

        **AS DUAS BOLHAS FICAM À ESQUERDA, e isso não é composição, é uma regra
        de layout.** Da segunda seção para baixo, IMAGEM MORA À DIREITA — a
        parede de trabalhos da 02 ocupa x=711..1340 e a grade da 03 começa em
        x=709; o texto fica à esquerda nas duas. Havia uma bolha sage em x=86%,
        ou seja centrada em x=1238: bem no meio da parede. Cor de fundo por trás
        de print colorido é o conflito que a parede em preto e branco já tinha
        tentado resolver pelo outro lado.

        Com as duas em 8% e 24% e raio de 30%, o alcance real (a parada de 70%)
        termina por volta de x=45%, a uns 60px da borda esquerda das imagens.
        **Mudou a coluna das imagens de lado, mude estas duas posições.**

        **Repete em ladrilho, e não em posições fixas.** A página cresce quando
        entra trabalho novo na grade da 03, e glow ancorado em pixel ficaria
        órfão no meio do nada. Cada ladrilho tem o centro em 50% e apaga em 70%
        do raio, então as emendas entre ladrilhos caem em transparente — é o que
        evita trocar uma costura por outra. O primeiro ladrilho começa no pé da
        hero, mas o centro dele fica 550px abaixo: o vão escuro entre a poça da
        hero e a primeira bolha do eco é de propósito, é ele que separa as duas
        seções sem desenhar linha nenhuma.
      */}
      <div className="absolute inset-x-0 top-[100svh] bottom-0 bg-[length:100%_1100px] bg-repeat-y bg-[radial-gradient(30%_26%_at_8%_50%,rgba(84,116,168,0.10),transparent_70%),radial-gradient(30%_24%_at_24%_50%,rgba(122,154,92,0.08),transparent_70%)]" />
    </div>
  )
}
