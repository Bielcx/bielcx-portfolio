/**
 * Copy do site inteiro. Componente nenhum tem texto embutido — nem
 * `aria-label`, nem placeholder. Para mudar qualquer palavra, é aqui.
 *
 * O que a página promete foi revisado contra o que é praticado de verdade, e
 * as três decisões estão registradas onde cada uma mora:
 *
 *   1. automação entra como serviço com histórico, não como capacidade
 *   2. o plano mensal existe e é citado duas vezes, de propósito
 *
 * A terceira — "nada de preview cravado em horas" — morava em `metodo.painel`,
 * a linha do tempo que saiu junto com o painel-janela da seção 02. Com ela
 * foram embora três promessas que a página não faz mais em lugar nenhum:
 * escopo e preço fechados antes de começar, link aberto para acompanhar a
 * construção, e domínio e hospedagem configurados no fim. Se voltarem, que
 * voltem por escrito e conferidas.
 *
 * Promessa que a página faz é promessa que o cliente cobra. Antes de mexer num
 * prazo ou num "está incluso", confira se ainda é verdade.
 */

import { email, waLink, web3Url } from './contact'

/** Link genérico, para os CTAs que não vêm de um contexto específico. */
const whatsappUrl = waLink('Oi, Gabriel! Vim pelo seu site e quero conversar sobre um projeto.')

/**
 * Menu do canto superior direito. Os `href` apontam para os `id` das seções —
 * mexer num, mexer no outro.
 *
 * Sem seletor de idioma: o site é só em português. O `sopa-agency`, de onde
 * esta base veio, tem duas locales e o seletor vivia aqui; se o inglês entrar
 * um dia, ele volta junto com o `content.en.ts`.
 */
const nav = {
  open: 'Abrir menu',
  close: 'Fechar menu',
  links: [
    { label: 'Início', href: '#topo' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Contato', href: '#contato' },
  ],
} as const

const hero = {
  corner: [
    '// como funciona',
    'conversa vira escopo > escopo vira site',
    'site vira dado > dado vira próxima versão',
    '// e o círculo se abre',
  ],
  /**
   * O nome inteiro, numa linha só. O `WORDMARK_SIZE` do Hero é calibrado para
   * o comprimento deste texto — trocar por nome mais longo é recalibrar o
   * clamp de lá, senão ele vaza da tela no celular.
   */
  wordmark: 'Gabriel Cavalcanti',
  actions: {
    primary: 'Começar uma conversa',
    /**
     * A porta para o outro portfólio. Também existe no rodapé (`footer.links`),
     * e o rótulo é diferente de propósito: lá, no fim da página, "Web3 /
     * blockchain" nomeia o assunto por extenso para quem o procura; aqui é só
     * a palavra, porque quem ela interessa reconhece na hora e quem não é do
     * meio não precisa parar para ler.
     *
     * Era "Portfólio web3" e encolheu a pedido. Quem diz que isto leva para
     * FORA do site passou a ser a seta do `Hero.tsx`, não mais o rótulo — some
     * a seta e o botão vira uma seção que não existe.
     *
     * Até jan/2026 este link existia só no rodapé, para o visitante comercial
     * não tropeçar na palavra logo de cara. Subiu para a hero a pedido; se o
     * site voltar a soar técnico demais na primeira tela, é o primeiro
     * candidato a descer de volta.
     */
    web3: { label: 'Web3', href: web3Url },
  },
}

/**
 * Seção 02 — o argumento de venda, provado ao lado em vez de só afirmado.
 *
 * O argumento aqui é o oposto do de uma agência: não é tamanho de equipe, é a
 * ausência de intermediário. Quem responde a mensagem é quem escreve o código,
 * e é isso que encurta tudo o que o painel ao lado mostra.
 *
 * As versões `...Curto` são do celular: em 390px o texto longo vira parede. Os
 * dois vão para o DOM e o CSS esconde um; trocar texto por largura de tela não
 * é coisa que media query faça sozinha, e não vale um listener de resize.
 */
const metodo = {
  eyebrow: '// como',
  title: 'Você fala direto com quem constrói.',
  paragraph:
    'Desenvolvedor full stack. Sem atendimento no meio, sem briefing que vira telefone sem fio: a conversa é comigo, e quem escreve o código é a mesma pessoa que respondeu a sua mensagem.',
  paragraphCurto:
    'Desenvolvedor full stack. Sem atendimento no meio — quem responde é quem constrói.',
  /** A terceira linha é a que fecha o argumento, e a única em tinta cheia. */
  notas: [
    'um interlocutor só · do orçamento ao no ar',
    'em projeto pequeno, algo funcionando já na primeira semana',
    'menos reunião. mais coisa pronta.',
  ],
}

const services = {
  eyebrow: 'serviços',
  /**
   * O título da seção. Já saiu uma vez, junto com uma linha de apoio que
   * resumia os quatro serviços, e voltou — sem a linha de apoio: ela repetia o
   * que as duas faixas logo abaixo dizem melhor, cada uma no seu contexto.
   *
   * Duas linhas, duas promessas, uma para cada faixa: a primeira é o que um
   * site faz, a segunda é o que um sistema faz. A ordem espelha a ordem das
   * faixas — trocar uma sem trocar a outra desencontra o anúncio da entrega.
   */
  title: ['Site que vende.', 'Sistema que trabalha.'],
  /**
   * Duas faixas de largura inteira, alternando o lado do painel visual. Cada
   * uma traz `accent` (a cor que corre pela faixa) e `visual` (qual painel vai
   * ao lado do texto).
   *
   * Sem CTA nas faixas: a seção apresenta, e quem se convence rola para o
   * rodapé, que é o fecho da página. Um mesmo botão repetido em toda seção
   * deixa de ser convite e vira ruído.
   */
  cards: [
    {
      id: 'criacao',
      accent: 'warm',
      icon: 'compass',
      label: 'Sites e lojas',
      headline:
        'A página que apresenta o seu negócio, feita para carregar rápido, aparecer no Google e virar contato no WhatsApp.',
      services: [
        { name: 'Landing pages', detail: 'Uma página, um objetivo: virar contato.' },
        { name: 'Sites institucionais', detail: 'Sua empresa apresentada com clareza.' },
        { name: 'Lojas virtuais', detail: 'Catálogo, carrinho, checkout e integrações.' },
        { name: 'Painel de gestão', detail: 'Você mesmo edita produto, preço e conteúdo.' },
        { name: 'Domínio e hospedagem', detail: 'Configurados e no ar, sem você mexer em DNS.' },
      ],
      visual: 'works',
    },
    {
      id: 'automacao',
      accent: 'cool',
      icon: 'shuffle',
      label: 'Sistemas e automação',
      /**
       * Esta faixa fala no presente e no mesmo tom da outra porque o serviço
       * tem histórico com cliente pagante — atendimento no WhatsApp, agente de
       * IA e planilha preenchida sozinha já foram entregues. Se um dia entrar
       * aqui um serviço que ainda não foi vendido, ele vira frase de capacidade
       * ("dá para"), não de portfólio: a faixa inteira perde a força quando uma
       * linha é promessa e as outras são histórico.
       */
      headline:
        'Olho a sua operação, acho onde o trabalho se repete e automatizo — no sistema que você já usa.',
      /**
       * Nenhum nome de ferramenta nesta lista, de propósito. O que se contrata
       * é a revisão da operação; qual tecnologia entra é problema de quem
       * constrói. Uma lista de siglas responde "só serve se você usa isto", e
       * a pergunta que o cliente faz antes dessa é "serve para mim?".
       */
      services: [
        {
          name: 'Revisão da operação',
          detail: 'Um raio-x do que é feito à mão hoje e do que dá para tirar da frente.',
        },
        { name: 'Atendimento automático', detail: 'Respostas instantâneas, 24 horas por dia.' },
        {
          name: 'Agente de IA',
          detail: 'Entende a conversa, responde no seu tom e chama você quando precisa.',
        },
        {
          name: 'Relatórios e planilhas',
          detail: 'O que você preenche à mão toda semana, preenchido sozinho.',
        },
        {
          name: 'Integrações',
          detail: 'Liga o que a empresa já usa — inclusive sistema feito em casa.',
        },
      ],
      visual: 'process',
    },
  ],
  /**
   * Trabalhos no ar, no painel da faixa de Sites e lojas.
   *
   * SÓ PROJETO WEB2 AQUI. Este site fala com quem contrata site e sistema; o
   * trabalho de web3 e blockchain vive no outro portfólio, linkado no rodapé.
   * Misturar os dois é exatamente o problema que fez este site existir.
   *
   * O print é opcional: enquanto não existir, o slot aparece como placeholder
   * hachurado com o domínio escrito. Para publicar um, salve a imagem em
   * `src/assets/trabalhos/<slug>.png` (webp e jpg também servem) — ou um
   * `.mp4` de mesmo slug, e ele roda em movimento. O componente acha o arquivo
   * pelo slug sozinho, sem precisar mexer aqui.
   */
  works: [
    { slug: 'fiveoout', name: 'Fiveoout', href: 'https://www.fiveoout.com.br' },
    { slug: 'voha', name: 'Voha', href: 'https://voha-lab.com.br' },
    { slug: 'suga', name: 'Suga Odontologia', href: 'https://suga-odontologia.vercel.app' },
    { slug: 'oshima', name: 'Dr. Mario Oshima', href: 'https://drmariooshima.vercel.app' },
  ],
  /**
   * Como um contrato de automação começa — o painel da faixa de Automação.
   *
   * A `note` é a linha mais importante do bloco: é ela que tira o pé do
   * cliente da dúvida de precisar ter alguma coisa pronta antes de chamar.
   */
  process: {
    eyebrow: 'como funciona',
    /**
     * A rede do painel de automação: o que ENTRA à esquerda, a automação no
     * meio, o que SAI à direita. Não é a lista de serviços (essa é a `services`
     * acima) — é um desenho do que acontece, e os rótulos existem para quem
     * olha o ícone e não sabe do que se trata.
     *
     * **Nenhum nome de ferramenta aqui, pela mesma razão da lista de serviços.**
     * Este painel nasceu justamente no lugar de uma grade de logos: logo
     * responde "com o que vocês trabalham", e a pergunta que vem antes é "serve
     * para mim?". Uma parede de marcas que o cliente não reconhece responde que
     * não. Por isso os ícones são genéricos — pessoa, mensagem, planilha — e
     * não WhatsApp, Sheets e afins, mesmo que sejam exatamente esses os
     * sistemas em que o trabalho entra. Quem nomeia as ferramentas é a `note`
     * logo abaixo, em texto, onde elas soam como "funciona com o SEU" e não
     * como requisito.
     *
     * Os `icon` têm de existir no `components/Icon.tsx`.
     */
    rede: {
      entradas: [
        { icon: 'users', label: 'cliente' },
        { icon: 'mail', label: 'mensagem' },
        { icon: 'doc', label: 'planilha' },
      ],
      nucleo: { icon: 'bolt', label: 'automação' },
      saidas: [
        { icon: 'check', label: 'resposta' },
        { icon: 'clock', label: 'na hora' },
        { icon: 'layers', label: 'registro' },
      ],
    },
    note: 'Funciona com o que a sua empresa já tem — WhatsApp, planilha, CRM, sistema feito em casa. Ou com o que ainda nem existe.',
  },
} as const


const footer = {
  title: ['Bom trabalho', 'continua rendendo'],
  /**
   * Quebras de linha na mão: cada item é uma linha do bloco centralizado.
   *
   * Eram três linhas e viraram duas, a pedido: "continuar funcionando,
   * evoluindo e gerando resultado" são três jeitos de dizer a mesma coisa, e
   * o cartão do rodapé encolheu junto. O verbo que sobrou é o do título logo
   * acima — o bloco inteiro afirma uma coisa só, duas vezes.
   */
  lede: [
    'A entrega não termina no lançamento. Sites, lojas e sistemas',
    'feitos para continuar rendendo muito depois de entrarem no ar.',
  ],
  cta: { label: 'Tirar um projeto do papel', href: whatsappUrl },
  /**
   * O e-mail é link de texto ao pé do botão, e não um segundo botão: `mailto:`
   * como CTA principal é aposta ruim — quem não tem cliente de e-mail
   * configurado clica e nada acontece, e o contato se perde sem ninguém saber.
   * Como linha discreta, serve quem prefere escrever e não custa nada a quem
   * não usa. O `prefix` fica fora do link: só o endereço é clicável.
   */
  email: { prefix: 'ou escreva para', address: email },
  /**
   * Links externos (href com http) abrem em outra aba.
   *
   * O "Web3 / blockchain" é a porta para o outro portfólio, e o lugar dele é
   * aqui embaixo de propósito: este site é a entrada do público comercial, que
   * não sabe o que a palavra significa e não deve tropeçar nela. Quem sabe,
   * procura — e acha.
   */
  links: [
    { label: 'Web3 / blockchain', href: web3Url },
    { label: 'GitHub', href: 'https://github.com/Bielcx' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gabrielcavalcanti-dev' },
  ],
  legal: `© Gabriel Cavalcanti · ${new Date().getFullYear()}`,
} as const

export const pt = { nav, hero, metodo, services, footer, whatsappUrl } as const
