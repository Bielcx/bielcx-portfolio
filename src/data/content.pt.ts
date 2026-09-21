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
  /**
   * O nome, UMA LINHA POR ITEM — a quebra é do design, não do navegador, e é
   * ela que dá ao nome a silhueta de bloco que os cabos plugam no meio.
   *
   * A ÚLTIMA LETRA DA ÚLTIMA LINHA sai no azul do acento (o `i` de
   * "Cavalcanti"). Quem fatia é o `Hero.tsx`, e não a copy: um `<span>` no
   * meio de uma string de conteúdo é marcação disfarçada de texto, e o dia em
   * que o nome mudar ninguém vai lembrar de mexer na tag.
   *
   * O `WORDMARK_SIZE` do Hero é calibrado para a MAIOR destas linhas —
   * trocar por nome mais longo é recalibrar o clamp de lá, senão ele vaza na
   * tela do celular.
   */
  wordmark: ['Gabriel', 'Cavalcanti'],
  /**
   * A linha que diz O QUE o site faz, e a única coisa acima da dobra que
   * responde "serve para mim?".
   *
   * **Ela não repete a seção 02 de propósito.** Cada bloco tem um papel: aqui é
   * O QUE, na seção 02 é COMO ("você fala direto com quem constrói") e na 03 é
   * o detalhe, nas duas faixas. Já houve aqui um subtítulo que terminava
   * justamente em "você fala direto com quem constrói" — a MESMA frase do `h2`
   * de baixo —, e foi removido por isso. Repetir de novo é desfazer a correção.
   *
   * A frase cobre as duas faixas da seção 03 numa linha só, e entrega a
   * automação, que é o serviço mais difícil de explicar: "sistema que faz o
   * trabalho repetido sozinho" é o que o cliente reconhece, "automação" é o que
   * ele procuraria no Google.
   *
   * No lugar dela morava um carimbo em mono — `// como funciona`, `conversa
   * vira escopo > escopo vira site` — que saiu junto. Aquilo era `aria-hidden`,
   * tinha 11px e falava em vocabulário de dev: exatamente o filtro que o
   * portfólio web3 usa para afastar quem não é do meio, na primeira tela do
   * site que existe para receber esse público.
   */
  subtitle: 'Do site ao sistema que faz o trabalho repetido sozinho.',
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
  /**
   * OS QUATRO NÚMEROS DA PRIMEIRA TELA — e cada um tem fonte, porque promessa
   * que a hero faz é a que o cliente cobra na reunião.
   *
   * Vieram do handoff como placeholder ("18h por semana", "142 tarefas hoje",
   * "7 dias", "4,8% de conversão") e foram TODOS trocados por número com
   * lastro. A fonte de cada um está no comentário dele. Ao mexer aqui, mexa
   * na fonte junto — número sem origem escrita volta a ser placeholder na
   * primeira vez que alguém perguntar de onde saiu.
   *
   * `tom` escolhe a cor da frente de trabalho — `sky` é automação, `sage` é
   * landing page. São duas de cada, de propósito: é assim que a primeira tela
   * diz que existem DOIS serviços sem precisar escrever isso.
   *
   * `curto` é a versão de celular. Abaixo de 820px os cards flutuantes e os
   * cabos somem (não há margem para eles ao lado do nome) e estes quatro
   * ganchos viram uma grade 2×2 embaixo dos botões — o mesmo conteúdo, sem a
   * cena.
   */
  provas: [
    {
      id: 'automacao',
      tom: 'sky',
      label: 'Automação',
      /**
       * FONTE: o `README.md` do Car10Automation — "reduzindo um processo de
       * ~10 etapas manuais para apenas revisar documentos, zipar e aprovar via
       * Telegram". Dez para três, contadas no fluxo escrito lá.
       *
       * A legenda NÃO diz "de um cliente", e isso é correção de uma mentira
       * que estava no ar: a automação é do fluxo de sinistros em que o dono
       * trabalha, não de um contrato de terceiro. O serviço é o mesmo, a
       * origem é outra — e "no meu próprio trabalho" é mais forte do que um
       * cliente anônimo, porque é verificável.
       */
      numero: '10 → 3',
      unidade: 'etapas',
      legenda: 'o que eu fazia à mão num fluxo de sinistros; o resto o robô faz',
      /** A fatia que sobrou de trabalho manual: 3 de 10. */
      barra: 30,
      curto: { label: 'Automação', valor: '10 → 3' },
    },
    {
      id: 'rodando',
      tom: 'sky',
      label: 'Rodando agora',
      /**
       * FONTE: a stack do mesmo projeto — WhatsApp (Evolution API), Telegram,
       * o sistema da seguradora (i4pro, via Playwright), Google Sheets e
       * Supabase. Cinco, contados no README.
       */
      numero: '5 sistemas',
      unidade: 'sem ninguém digitar',
      legenda: 'WhatsApp, planilha, banco e dois painéis, conversando entre si',
      curto: { label: 'Rodando', valor: '5 sistemas' },
    },
    {
      id: 'landing',
      tom: 'sage',
      label: 'Landing page',
      /**
       * FONTE: o git dos últimos sites. Dr. Mario Oshima, Luccare e Suga
       * Odontologia foram do primeiro commit ao último no MESMO dia; o Sizr
       * levou dois. Dois dias é, portanto, conservador de propósito — o
       * registro diz um, e a folga cobre o briefing e o texto, que não moram
       * no repositório.
       *
       * Projeto maior não entra nesta conta e não deve: o Voha levou 16 dias
       * e o JCM, 13. A promessa é de LANDING PAGE, e é o que a etiqueta diz.
       */
      numero: '2 dias',
      legenda: 'do briefing ao site no ar — medido nos últimos quatro',
      curto: { label: 'Landing', valor: '2 dias' },
    },
    {
      id: 'atendimento',
      tom: 'sage',
      label: 'Atendimento',
      /**
       * ESTE CARD SUBSTITUIU O DE CONVERSÃO ("4,8% ↑ de 1,4%"), que era o
       * único dos quatro sem NENHUMA fonte — nem no repositório, nem em
       * projeto entregue. Número de conversão inventado é o pior tipo de
       * promessa: é exatamente o que o cliente mede depois.
       *
       * Este é verificável por construção: o bot roda em PM2, atende no
       * WhatsApp a qualquer hora e escala para uma pessoa quando sai do que
       * resolve. Se um dia houver número de conversão MEDIDO num cliente, ele
       * volta para cá — com a fonte escrita, como os outros três.
       */
      numero: '24/7',
      unidade: 'sem fila',
      legenda: 'responde na hora e chama uma pessoa quando sai do script',
      curto: { label: 'Atendimento', valor: '24/7' },
    },
  ],
  /** O indicador de rolagem no pé da tela. É o que a hero inteira existe para
   *  provocar: a primeira tela dá motivo, este traço diz para onde. */
  cue: 'Role',
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
   * A conversa de demonstração do painel da faixa de Automação.
   *
   * **É roteiro, e a `note` diz isso.** O site é estático: modelo de verdade
   * nesta caixa é função serverless, chave de API, custo por visita e campo de
   * texto aberto para desconhecido. O que o painel precisa provar é o FORMATO
   * da conversa — consulta antes de responder, frase em vez de menu, e passa
   * para uma pessoa quando sai do que resolve —, e isso um roteiro prova
   * igual, sem alucinar na frente de cliente.
   *
   * O negócio é fictício de propósito: nome de cliente real aqui é promessa de
   * que aquele agente está no ar, e é cobrável. Se um dia um cliente autorizar,
   * troque — e aí a conversa tem de ser a de verdade.
   *
   * **Cada pergunta se sustenta sozinha**, em qualquer ordem: os chips somem
   * conforme são usados, então não há como garantir que a de reservar venha
   * depois da de horário. Nenhuma resposta pode depender da anterior.
   *
   * No lugar disto havia a `process` — a rede de nós que DESENHAVA a automação
   * em vez de demonstrá-la. Saiu junto com o componente.
   */
  agente: {
    eyebrow: 'veja funcionando',
    /** Negócio fictício. Ver a nota acima antes de trocar por um real. */
    negocio: 'Estúdio Vélo · pilates',
    status: 'responde na hora, 24h',
    /** O separador de data no alto da conversa, como o do WhatsApp. */
    divisor: 'hoje',
    /**
     * A conversa NÃO começa vazia: o cliente já disse oi e o agente já
     * respondeu. Tela de mensagens com um balão só, no alto de um aparelho de
     * 600px, é meia tela de vazio — e aplicativo nenhum se parece com isso. A
     * saudação é do visitante (balão verde, à direita), que é o papel em que
     * ele entra ao clicar nos chips.
     */
    saudacao: 'Oi, bom dia! Vocês têm aula hoje?',
    /**
     * **A abertura RESPONDE a saudação**, e essa é a regra mais importante
     * desta copy inteira. Ela já foi um cartão de visita — "sou o atendimento
     * do Estúdio Vélo, vejo horário, preço e agendo" — depois de uma pergunta
     * direta sobre ter aula hoje: o cliente perguntou uma coisa e ouviu outra,
     * que é exatamente o robô de menu que este painel existe para desmentir.
     *
     * Toda resposta daqui obedece à mesma ordem: responde primeiro, com dado
     * concreto, e só então oferece o passo seguinte. Se uma resposta nova não
     * couber nessa ordem, ela está errada.
     */
    abertura:
      'Bom dia! Temos, sim — hoje ainda estão livres 12h, 17h e 19h. Quer que eu segure alguma para você?',
    /**
     * `label` é o que vai no chip (curto, do jeito que o cliente escreveria);
     * `pergunta` é o que entra no balão; `passo` é o que o agente consultou
     * antes de responder — é essa linha que separa um agente de um menu de
     * respostas prontas.
     */
    perguntas: [
      {
        label: 'Quanto custa?',
        pergunta: 'Quanto custa a aula?',
        passo: 'consultando a tabela',
        resposta:
          'A avulsa sai R$ 70. No plano de 2x por semana a aula fica R$ 48, e a primeira é de graça para você experimentar. Quer que eu marque a experimental?',
      },
      {
        label: 'Tem horário quinta de manhã?',
        pergunta: 'Tem horário quinta de manhã?',
        passo: 'consultando a agenda',
        resposta:
          'Quinta tem 7h, 8h e 10h30 livres. O de 8h é o mais tranquilo, com três pessoas na sala.',
      },
      {
        label: 'Quero reservar quinta, 8h',
        pergunta: 'Quero reservar quinta, 8h',
        passo: 'reservando e avisando a equipe',
        resposta:
          'Reservado para quinta às 8h. Mandei o endereço no seu WhatsApp e avisei a Marina, que dá essa aula. Se precisar desmarcar, é só me escrever.',
      },
      {
        label: 'Posso parcelar em 3x?',
        pergunta: 'Posso parcelar o plano em 3x?',
        passo: 'isto sai do que eu resolvo',
        /**
         * A única que não resolve — e ainda assim responde ao que foi
         * perguntado antes de passar adiante. "Não sei, vou chamar alguém" sem
         * dizer o que sabe é o robô de menu de novo, só que educado.
         */
        resposta:
          'Em 3x não é uma condição que eu feche sozinho — a recepção avalia caso a caso. Chamei a Ana e passei a nossa conversa; ela responde neste mesmo número em alguns minutos.',
      },
    ],
    reiniciar: 'conversar de novo',
    /**
     * Duas coisas numa linha só, e as duas obrigatórias: dizer que a conversa
     * é uma demonstração (senão é propaganda enganosa) e dizer o que muda num
     * agente de verdade — ele lê a SUA agenda, o SEU preço, no SEU tom.
     */
    note: 'Conversa de demonstração, com um negócio inventado. O seu agente lê a sua agenda, a sua tabela de preços e responde no seu tom — no WhatsApp, no site ou nos dois.',
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
