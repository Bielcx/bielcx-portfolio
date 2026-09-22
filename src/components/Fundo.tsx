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
 *
 * **NÃO HÁ MAIS CLARÃO NA PRIMEIRA TELA, e isso foi pedido.** Eram dois
 * radiais (azul à esquerda, sage à direita) mais um véu frio costurando os
 * dois, ocupando a metade de baixo da hero. O desenho original punha o centro
 * deles 16% ABAIXO do pé da tela — a luz nascia de fora da hero —, o que
 * deixava o pico do gradiente dentro da seção 02 e o rabo por cima da parede de
 * trabalhos. Isso foi remendado quatro vezes: caixa de 150svh, máscara linear,
 * corte em 66/85%, e por fim trazer o centro para dentro (80%/26%, terminando
 * em y=884). As quatro mudaram o sintoma de nome — listra, faca, borrão — e
 * nenhuma deixou o dono satisfeito com o resultado. Saiu inteiro.
 *
 * **Se voltar, volta terminando dentro da hero**: centro acima de 85% da caixa
 * e raio vertical curto o bastante para a parada do `transparent` cair antes do
 * pé. Máscara linear não resolve — gradiente cortado por uma reta tem borda
 * reta, e borda reta em fundo contínuo se vê. Foi essa a lição das quatro.
 */
export function Fundo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-frame">
      {/*
        O ECO — o que impede a página de virar preto chapado depois da primeira
        tela, que é o que a fazia parecer outro site. É o único desenho que
        sobrou aqui, e é textura, não assunto: os alfas são 0,10 e 0,08 porque
        passar disso compete com o conteúdo.

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
        evita trocar uma costura por outra. Começa no pé da hero, mas o centro
        do primeiro ladrilho fica 550px abaixo dele: a primeira tela é preta
        inteira e a cor só aparece quando a 02 já está em quadro.
      */}
      <div className="absolute inset-x-0 top-[100svh] bottom-0 bg-[length:100%_1100px] bg-repeat-y bg-[radial-gradient(30%_26%_at_8%_50%,rgba(84,116,168,0.10),transparent_70%),radial-gradient(30%_24%_at_24%_50%,rgba(122,154,92,0.08),transparent_70%)]" />
    </div>
  )
}
