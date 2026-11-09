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

import { email, waLink } from './contact'

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
  /**
   * A HERO LIMPA (09/11/2026). Saíram o nome gigante, o botão Web3, os cabos e
   * os quatro cards flutuantes: o dono quis uma primeira tela "bem clean". O
   * nome não precisa estar aqui — quem chega não conhece o nome, e ele aparece
   * logo abaixo, na seção 02, onde vende ("você fala direto com quem
   * constrói"). O Web3 continua no rodapé (`footer.links`). A versão antiga
   * está no git.
   *
   * O título responde "serve para mim?" na primeira olhada: diz o que é feito
   * e para quem. Ele NÃO repete o `h2` da seção 02 nem o título da seção 03
   * ("Site que vende. Sistema que trabalha.") — cada bloco tem um papel.
   */
  title: 'Sites e sistemas para o seu negócio.',
  /**
   * A linha de apoio cobre as duas faixas da seção 03 numa frase: o site (com
   * o prazo, que tem fonte no `provas`) e a automação, dita do jeito que o
   * cliente reconhece — "trabalho repetido feito sozinho" —, não na palavra
   * técnica.
   */
  subtitle: 'Do site no ar em 2 dias ao trabalho repetido que passa a ser feito sozinho.',
  /** O único botão da primeira tela. Vai para o WhatsApp (`whatsappUrl`). */
  cta: 'Conversar no WhatsApp',
  /**
   * OS NÚMEROS DA PRIMEIRA TELA — e cada um tem fonte, porque promessa que a
   * hero faz é a que o cliente cobra na reunião. Ao mexer aqui, mexa na fonte
   * junto: número sem origem escrita volta a ser placeholder na primeira vez
   * que alguém perguntar de onde saiu.
   *
   * Eram quatro, em cards ligados ao nome por cabos. Ficaram três, numa fileira
   * discreta no pé da tela; o "5 sistemas" saiu por ser o mais técnico.
   */
  provas: [
    {
      /**
       * FONTE: o git dos últimos sites. Dr. Mario Oshima, Luccare e Suga
       * Odontologia foram do primeiro commit ao último no MESMO dia; o Sizr
       * levou dois. Dois dias é conservador de propósito — o registro diz um,
       * e a folga cobre o briefing e o texto, que não moram no repositório.
       * A promessa é de LANDING PAGE: o Voha levou 16 dias e o JCM, 13.
       */
      numero: '2 dias',
      legenda: 'do briefing ao site no ar',
    },
    {
      /**
       * FONTE: o `README.md` do Car10Automation — "reduzindo um processo de
       * ~10 etapas manuais para apenas revisar documentos, zipar e aprovar via
       * Telegram". Dez para três, contadas no fluxo escrito lá. É o fluxo de
       * sinistros em que o dono trabalha, não um cliente: por isso a legenda
       * não diz "de um cliente".
       */
      numero: '10 → 3',
      legenda: 'etapas à mão, o resto sozinho',
    },
    {
      /**
       * FONTE: o bot roda em PM2, atende no WhatsApp a qualquer hora e escala
       * para uma pessoa quando sai do que resolve. Substituiu um card de
       * conversão ("4,8%") que não tinha fonte nenhuma.
       */
      numero: '24/7',
      legenda: 'atendimento que não para',
    },
  ],
} as const

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
      visual: 'agent',
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
   * O vídeo do painel da faixa de Automação: um atendimento inteiro em 15
   * segundos, em loop — a pergunta chega, o agente consulta a agenda, responde
   * com horário de verdade, reserva, e do outro lado a agenda do negócio se
   * preenche sozinha.
   *
   * **É simulação, e a `note` diz isso.** O negócio é fictício de propósito:
   * nome de cliente real aqui é promessa de que aquele agente está no ar, e é
   * cobrável. Se um dia um cliente autorizar, troque — e aí o vídeo tem de ser
   * a gravação de verdade.
   *
   * Antes do vídeo havia aqui uma conversa clicável, com perguntas prontas e
   * respostas roteirizadas. Está no git.
   */
  agente: {
    eyebrow: 'veja funcionando',
    /** Vídeo em loop precisa de como parar (WCAG 2.2.2). */
    pausar: 'pausar vídeo',
    continuar: 'continuar vídeo',
    /** O que o leitor de tela anuncia no lugar do vídeo. */
    video:
      'Vídeo: um cliente pergunta por horário na quinta de manhã, o atendimento consulta a agenda, oferece 8h e 10h30, reserva às 8h e envia a confirmação; do lado do estúdio, a reserva entra sozinha na agenda e a equipe é avisada.',
    /**
     * Duas coisas numa linha só, e as duas obrigatórias: dizer que é uma
     * simulação (senão é propaganda enganosa) e dizer o que muda num agente de
     * verdade — ele lê a SUA agenda, o SEU preço, no SEU tom.
     */
    note: 'Simulação de um atendimento real, com um negócio inventado. O seu agente lê a sua agenda, a sua tabela de preços e responde no seu tom — no WhatsApp, no site ou nos dois.',
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
   * O "Web3 / blockchain" morava aqui e saiu a pedido, em 09/11/2026: este site
   * não leva mais para o portfólio web3 em lugar nenhum. Quem liga os dois agora
   * é o site pessoal (gabriel.doabridge.com), que tem uma porta para cada um.
   */
  links: [
    { label: 'GitHub', href: 'https://github.com/Bielcx' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gabrielcavalcanti-dev' },
  ],
  legal: `© Gabriel Cavalcanti · ${new Date().getFullYear()}`,
} as const

export const pt = { nav, hero, metodo, services, footer, whatsappUrl } as const
