/**
 * Copy do site inteiro. Componente nenhum tem texto embutido — nem
 * `aria-label`, nem placeholder. Para mudar qualquer palavra, é aqui.
 *
 * O que a página promete foi revisado contra o que é praticado de verdade, e
 * as quatro decisões estão registradas onde cada uma mora:
 *
 *   1. nada de preview cravado em horas — ver `metodo.painel`
 *   2. nenhum preço na página — ver o FAQ "Quanto custa"
 *   3. automação entra como serviço com histórico, não como capacidade
 *   4. o plano mensal existe e é citado duas vezes, de propósito
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
    { label: 'Perguntas frequentes', href: '#faq' },
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
   * ponytail: quatro letras, e não é escolha estética — o `WORDMARK_SIZE` do
   * Hero é `clamp(96px, min(36vw,30vh), 380px)`, calibrado para palavra curta.
   * "GABRIEL" nesse corpo vaza da tela no celular. O nome inteiro entra logo
   * abaixo, no `label`. Trocar por palavra mais longa é recalibrar o clamp.
   */
  wordmark: 'BIEL',
  label: 'Gabriel Cavalcanti',
  actions: {
    primary: 'Começar uma conversa',
    secondary: 'Trabalhos no ar',
  },
  /** Dica no pé do hero: some junto com o resto do bloco inicial. */
  scrollHint: 'Arraste para cima',
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
  /**
   * O painel PROVA o argumento ao lado, em vez de só afirmá-lo — e por isso
   * cada linha aqui é uma promessa que o cliente vai cobrar.
   *
   * Os carimbos eram relógio (`00:00`, `+02:40`, `mesmo dia`), herdados do
   * site da agência, onde um time consegue cravar isso. Sozinho, não: o prazo
   * depende do tamanho do projeto. Viraram etapas numeradas, que são
   * verdadeiras em qualquer porte — o "primeira semana" continua dito, mas
   * como nota ao lado e só para projeto pequeno.
   *
   * São TRÊS passos, e o layout foi calibrado para três. Acrescentar um quarto
   * é conferir a altura do painel antes.
   */
  painel: {
    label: 'como um projeto anda',
    status: 'no ar',
    steps: [
      {
        stamp: '01',
        stampCurto: '01',
        title: 'A conversa começa',
        titleCurto: 'A conversa começa',
        detail: 'Você conta o problema. Ninguém abre apresentação.',
        detailCurto: 'Ninguém abre apresentação.',
      },
      {
        stamp: '02',
        stampCurto: '02',
        title: 'Escopo e preço fechados',
        titleCurto: 'Escopo fechado',
        detail: 'A proposta diz o que entra, quanto tempo leva e quanto custa — antes de começar.',
        detailCurto: 'O que entra, o prazo e o preço. Antes de começar.',
      },
      {
        stamp: '03',
        stampCurto: '03',
        title: 'No ar',
        titleCurto: 'No ar',
        detail:
          'Um link aberto para acompanhar a construção a qualquer hora, e no fim domínio, hospedagem e certificado configurados.',
        detailCurto: 'Link para acompanhar, e domínio e hospedagem prontos.',
      },
    ],
  },
}

const services = {
  eyebrow: 'serviços',
  title: ['Site que vende.', 'Sistema que trabalha.'],
  description:
    'Da presença digital à operação do dia a dia: sites, lojas, painéis e automações que colocam o seu negócio no ar e tiram trabalho repetido da sua frente.',
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
    eyebrow: 'como entra',
    steps: [
      {
        n: '01',
        name: 'Conversa',
        detail: 'Vinte minutos olhando a operação como ela é hoje — não como deveria ser.',
      },
      {
        n: '02',
        name: 'Revisão',
        detail: 'Mapeio o que é refeito à mão, o que se perde no meio do caminho e o que atrasa.',
      },
      {
        n: '03',
        name: 'Proposta',
        detail: 'O que automatizar primeiro, o que dá para medir e quanto custa. Escopo fechado.',
      },
      {
        n: '04',
        name: 'No ar',
        detail: 'Construo, ligo no que já existe e acompanho depois que entra.',
      },
    ],
    note: 'Funciona com o que a sua empresa já tem — WhatsApp, planilha, CRM, sistema feito em casa. Ou com o que ainda nem existe.',
  },
} as const

const faq = {
  eyebrow: 'faq',
  title: ['Perguntas', 'frequentes'],
  description:
    'O que costumam perguntar antes de fechar: como começa, quanto tempo leva, quanto custa e quem cuida do site depois que ele entra no ar.',
  items: [
    {
      icon: 'compass',
      question: 'Como começa um projeto?',
      answer:
        'Com uma conversa de uns 20 minutos no WhatsApp ou em call, para entender o que você precisa. Dali sai uma proposta com escopo, prazo e valor fechados. Você aprova antes de qualquer coisa ser cobrada, e em projeto pequeno costuma ver algo funcionando já na primeira semana.',
    },
    {
      icon: 'clock',
      question: 'Quanto tempo leva?',
      answer:
        'Depende do tamanho, e o prazo sai fechado na proposta — nunca "a gente vê depois". Uma landing page costuma levar poucos dias; um site com painel de edição, algumas semanas; sistema e automação dependem do tamanho da operação.',
    },
    {
      /**
       * Sem número, por decisão: preço na página filtra antes da conversa, e
       * um projeto sob medida não tem preço de tabela. O que a resposta entrega
       * no lugar é a garantia que o cliente realmente quer ouvir — que o valor
       * não muda no meio. Se um dia entrar um "a partir de", ele entra aqui.
       */
      icon: 'doc',
      question: 'Quanto custa?',
      answer:
        'Depende do escopo, e por isso o valor sai fechado na proposta, antes de começar: o preço que está lá é o preço final, e ele não muda no meio do projeto. Quando a demanda é contínua, existe também um valor mensal de manutenção e evolução.',
    },
    {
      icon: 'sparkle',
      question: 'Preciso ter logo e marca prontos?',
      answer:
        'Não. Se já existe, trabalho em cima do que está de pé. Se não existe, dá para começar com uma direção visual simples — cores, tipografia e um logotipo básico — e evoluir depois.',
    },
    {
      icon: 'globe',
      question: 'O domínio e a hospedagem estão inclusos?',
      answer:
        'A configuração está. O domínio é comprado no seu nome, com o seu cartão, e fica seu — mas eu cuido de apontar tudo e deixar no ar com certificado de segurança. Para site institucional, a hospedagem costuma sair de graça no plano que eu uso.',
    },
    {
      icon: 'shuffle',
      question: 'Quem cuida do site depois que ele entra no ar?',
      answer:
        'Você decide. Entrego o código e os acessos para o seu time assumir, ou sigo com um plano mensal de manutenção. Em nenhum dos dois casos o site fica preso comigo: o domínio, a hospedagem e o código são seus.',
    },
    {
      icon: 'cube',
      question: 'Você assume projeto que já está no meio do caminho?',
      answer:
        'Sim. Começo com uma leitura do código e do design que já existem e te digo com franqueza o que dá para aproveitar e o que precisa ser refeito. Daí sai um plano com prazo — às vezes tão curto quanto começar do zero.',
    },
    {
      icon: 'users',
      question: 'Como é o dia a dia durante o projeto?',
      answer:
        'Um canal direto no WhatsApp e um link do site em construção que você pode abrir a qualquer hora para ver como está. Sem intermediário e sem esperar reunião para saber onde o projeto está.',
    },
  ],
} as const

const footer = {
  title: ['Bom trabalho', 'continua rendendo'],
  /** Quebras de linha na mão: cada item é uma linha do bloco centralizado. */
  lede: [
    'A entrega não termina no lançamento. Sites, lojas e sistemas',
    'feitos para continuar funcionando, evoluindo e gerando',
    'resultado muito depois que entram no ar.',
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

export const pt = { nav, hero, metodo, services, faq, footer, whatsappUrl } as const
