import { getRecreatedJourney } from './recreated-story-copy.js';

const LANDMARK_JOURNEY_METADATA = [
  {
    id: 'palmeiras-imigracao', name: 'Rua das Palmeiras e Museu da Imigração', icon: '🌴',
    description: 'Descubra o que cabe nos três bolsinhos de uma mala mágica.',
    place: 'Rua das Palmeiras · Museu Nacional de Imigração e Colonização',
    art: '/trilha-palmeiras.webp', artAlt: 'Fritz encontra uma mala florida diante do museu azul, entre as palmeiras ao amanhecer.',
    fact: 'A Alameda Brüstlein, conhecida como Rua das Palmeiras, fica diante do Museu Nacional de Imigração e Colonização. O casarão chamado Palácio dos Príncipes foi construído para uma visita real que não aconteceu; Dona Francisca nunca morou ali.',
    source: 'https://www.visitejoinville.com.br/imperd%C3%ADveis-de-joinville---interna/rua-das-palmeiras-e-museu-da-imigracao',
    additionalSources: [
      { label: 'Visite Joinville · Trilha do Patrimônio, encontro 8', url: 'https://www.visitejoinville.com.br/trilha-do-patrimonio-encontros/patrim%C3%B4nio%2008' },
      { label: 'Prefeitura de Joinville · história e preservação da Rua das Palmeiras', url: 'https://www.joinville.sc.gov.br/noticias/prefeitura-de-joinville-vai-implementar-plano-de-manutencao-na-rua-das-palmeiras/' },
      { label: 'ND Mais · Dona Francisca nunca visitou Joinville', url: 'https://ndmais.com.br/literatura/biblioteca-nacional-guarda-parte-da-historia-de-joinville-e-da-princesa-francisca-carolina/' },
    ],
    chapters: [
      {
        title: 'A mala que não pesava', at: 0,
        paragraphs: [
          'Debaixo das palmeiras, Fritz desenha uma mala no diário. Clic! Na fantasia, ela abre sozinha. Está vazia, mas tem três bolsinhos e uma etiqueta: “O que você levaria para uma casa nova?”. O jacaré tenta guardar seu guarda-chuva inteiro. Não cabe nem a pontinha!',
          'Diante do Museu da Imigração, ele pensa nas pessoas que viajaram com malas e muitas lembranças. Decide encher os bolsinhos com desenhos, não com objetos do museu. No primeiro, faz um retrato de amigos. A etiqueta ganha uma raiz dourada. Por que uma raiz apareceu numa mala?',
        ],
        keepsake: 'Toda chegada merece alguém disposto a escutar',
      },
      {
        title: 'Raízes que se encontram', at: 600,
        paragraphs: [
          'A raiz da etiqueta vira um caminho de lápis. Fritz segue o desenho até o segundo bolsinho: ali cabem histórias! Faz uma mesa comprida com comidas, palavras e brincadeiras diferentes. Ao redor, desenha pessoas que chegaram de longe e pessoas cujas famílias já viviam na região.',
          'A mesa fica apertada. Fritz quase apaga uma cadeira, mas tem uma ideia melhor: aumenta a folha! Agora cabe mais gente sem tirar ninguém do lugar. O segundo bolsinho brilha, e aparece uma maçaneta no terceiro. Falta abrir uma porta, mas a mala não tem casa!',
        ],
        keepsake: 'Criar raízes não precisa apagar as de ninguém',
      },
      {
        title: 'Um endereço para o afeto', at: 3000,
        paragraphs: [
          'Fritz abre de novo a mala dos três bolsinhos. Já tem amigos e histórias. O que falta? Ele desenha uma porta e bate nela com o lápis: toc-toc! Do outro lado da sua invenção surge uma frase: “Pode entrar!”. O terceiro bolsinho se enche de luz.',
          'A mala continua leve, mas agora guarda companhia, escuta e acolhimento. Fritz fecha o desenho com cuidado e olha para a alameda. Seu tesouro não veio de uma vitrine: nasceu de aprender com o lugar. Na etiqueta, escreve o convite que vai levar para casa: “Tem espaço para você”.',
        ],
        keepsake: 'Pertencer é encontrar espaço sem deixar de ser você',
      },
    ],
  },
  {
    id: 'catedral', name: 'Catedral de Joinville', icon: '⛪',
    description: 'Complete um quebra-cabeça de luz, cores e companhia.',
    place: 'Catedral São Francisco Xavier',
    art: '/trilha-catedral.webp', artAlt: 'Fritz contempla uma pétala num banco da catedral, iluminado por vitrais azuis e dourados.',
    fact: 'A Catedral São Francisco Xavier é um marco modernista de Joinville. Seus vitrais dão cor e luz ao interior.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/catedral-sao-francisco-xavier',
    chapters: [
      {
        title: 'A cor que atravessou a chuva', at: 100,
        paragraphs: [
          'Uma faixa de luz colorida alcança o pé de Fritz na Catedral. Ele levanta a pata, e a cor fica no chão. “Ué, não é tinta!” Os vitrais deixam a luz entrar de um jeito bonito. O jacaré anda devagar e fala baixinho para respeitar quem está ali.',
          'No diário, inventa um quebra-cabeça de luz com três espaços. Desenha o azul que viu, mas a flor do quebra-cabeça não abre. Uma nuvem cobre o sol, e as outras cores somem. Fritz terá de lembrar o que observou, em vez de sair correndo atrás do brilho.',
        ],
        keepsake: 'Há luzes que só encontramos quando diminuímos o passo',
      },
      {
        title: 'Pedaços de uma mesma luz', at: 1800,
        paragraphs: [
          'Sentado em silêncio, Fritz olha seu quebra-cabeça. “Tinha uma cor de sol... e uma cor de flor!” Pinta um pedaço dourado e outro rosa. A nuvem passa, e ele confere os reflexos sem tocar nos vitrais. As cores mudam de lugar conforme a luz entra!',
          'O desenho fica completo, mas a flor ainda está fechada. Fritz percebe um detalhe: desenhou um banco com espaço só para ele. A última pista não é outra cor. É o lugar vazio ao lado, esperando uma companhia.',
        ],
        keepsake: 'A esperança não precisa apagar o que sentimos',
      },
      {
        title: 'O silêncio que foi companhia', at: 7500,
        paragraphs: [
          'Fritz aumenta o banco do quebra-cabeça e desenha um amigo. Os dois cabem na mesma faixa de luz! A flor de papel se abre bem devagar, sem fogos nem barulho. O jacaré até prende um risinho para não atrapalhar o silêncio da Catedral.',
          'Ele guarda o quebra-cabeça azul, rosa e dourado. Na sua história, o prêmio foi descobrir que companhia também pode ser quietinha. Ao sair, leva só o desenho e a vontade de escutar. Cada pessoa pode acreditar e sentir de um jeito; o respeito cabe ao lado de todas.',
        ],
        keepsake: 'Às vezes, acolher é simplesmente não deixar alguém sozinho',
      },
    ],
  },
  {
    id: 'mercado-publico', name: 'Mercado Público Municipal', icon: '🧺',
    description: 'Encontre o ingrediente que falta numa lista muito curiosa.',
    place: 'Mercado Público Municipal · Rio Cachoeira',
    art: '/trilha-mercado.webp', artAlt: 'Fritz aproxima uma cadeira de uma mesa com alimentos junto ao mercado à beira do rio.',
    fact: 'O Mercado Público Municipal fica junto ao Rio Cachoeira, na área do antigo porto. Passageiros e mercadorias chegavam por via fluvial; o Mercado foi construído em 1906 como parte dessa paisagem portuária.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/mercado-public-municipal-de-joinville',
    additionalSources: [
      { label: 'Prefeitura de Joinville · Parque Porto Cachoeira, história da área do porto', url: 'https://www.joinville.sc.gov.br/wp-content/uploads/2024/05/Resposta-a-Consulta-Publica-Parque-Linear-Cais-Conde-DEu.pdf' },
    ],
    chapters: [
      {
        title: 'A lista sem último item', at: 300,
        paragraphs: [
          'Uma lista desenhada escapa do diário de Fritz: fruta, pão, flor... e um ponto de interrogação! Ele a alcança perto do Mercado Público, junto ao Rio Cachoeira. Ao conhecer a história do antigo porto, imagina quantos barcos trouxeram pessoas e mercadorias por aquelas águas.',
          'Na sua aventura de papel, Fritz prepara uma cesta para um encontro. Desenha os três primeiros itens e procura o último por toda a página. Debaixo do pão? Dentro da flor? Nada! Só encontra uma cadeira virada de costas. Será que a lista é de compras mesmo?',
        ],
        keepsake: 'Nem tudo que alimenta uma cidade cabe numa sacola',
      },
      {
        title: 'A receita de ouvir', at: 4000,
        paragraphs: [
          'Fritz desenha uma mesa no lugar da cesta. A fruta e o pão já estão servidos; a flor vira enfeite. Mas a cadeira continua virada! Ele tenta uma receita engraçada: duas pitadas de conversa e uma colher de “obrigado”. Não se cozinha conversa, mas dá para começar uma!',
          'O jacaré agradece a quem trabalha para o alimento chegar à mesa. Na página inventada, surgem outras cadeiras. Uma continua afastada, e o ponto de interrogação da lista vai parar nela. Agora Fritz sabe onde procurar o último ingrediente.',
        ],
        keepsake: 'O cuidado também se serve em pequenas porções',
      },
      {
        title: 'Mais uma cadeira', at: 16000,
        paragraphs: [
          '“Cabe mais um?”, pergunta Fritz ao desenho. Puxa a cadeira afastada para perto e chama um companheiro de papel. O ponto de interrogação vira um coração! Na última linha da lista, escreve: companhia. O encontro pode começar.',
          'Fritz guarda a lista completa junto ao desenho do Mercado e do Cachoeira. Aprendeu sobre o antigo porto e inventou uma nova maneira de receber visitas. A fruta, o pão e a flor continuam na página. A pergunta ele leva consigo, pronta para a próxima mesa: “Cabe mais um?”.',
        ],
        keepsake: 'Uma mesa fica maior quando alguém decide acolher',
      },
    ],
  },
  {
    id: 'monumento-barca', name: 'Monumento “A Barca”', icon: '⛵',
    description: 'Ajude um barquinho de papel a levar lembranças até uma nova margem.',
    place: 'Monumento “A Barca”',
    art: '/trilha-barca.webp', artAlt: 'Fritz segura um barquinho de papel diante de um monumento de barca ao pôr do sol.',
    fact: 'O monumento “A Barca”, de César Dobner, foi inaugurado em 2001 e remete à embarcação Barca Colon, associada à chegada de imigrantes europeus em 1851. É uma representação memorial, não o começo de toda a história humana da região.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/monumento%20a%20barca',
    additionalSources: [
      { label: 'Prefeitura de Joinville · Lista de Monumentos Públicos, “A Barca”', url: 'https://www.joinville.sc.gov.br/wp-content/uploads/2026/03/Lista-de-Monumentos-Publicos-de-Joinville-novembro2025.pdf' },
      { label: 'Prefeitura de Joinville · Museu Arqueológico de Sambaqui', url: 'https://www.joinville.sc.gov.br/institucional/secult/upm/mas/' },
    ],
    chapters: [
      {
        title: 'O barco que cabia na mão', at: 800,
        paragraphs: [
          'Diante do monumento “A Barca”, Fritz conhece a lembrança da embarcação ligada à chegada de imigrantes em 1851. Depois dobra seu próprio barquinho de papel, bem diferente de um navio de verdade. Faz um mar azul no diário, sem soltar papel no rio.',
          'O barquinho da aventura tem uma missão: levar uma flor até uma margem desenhada. Fritz tenta pôr também uma casa inteira no casco. Opa, afundou o desenho! Ele retira a casa e vê um vinco novo na folha. Como levar lembranças sem carregar tudo nas costas?',
        ],
        keepsake: 'Uma viagem pode levar coragem e medo no mesmo barco',
      },
      {
        title: 'O que não cabe no casco', at: 9000,
        paragraphs: [
          'Fritz desdobra o barquinho que ficou amassado. Em vez da casa pesada, faz um desenho dela. Acrescenta uma receita e o retrato de amigos. Agora tudo cabe na folha! Uma viagem pode levar lembranças sem levar o telhado, o fogão e o sofá.',
          'Ele dobra o barco outra vez e usa o vinco como caminho no mar de papel. A flor chega perto da margem, mas não encontra lugar para encostar. Fritz olha o mapa: desenhou uma chegada tão estreita que só cabe um barco. Vai precisar abrir espaço.',
        ],
        keepsake: 'As marcas da travessia também fazem parte de nós',
      },
      {
        title: 'Uma margem que acolhe', at: 35000,
        paragraphs: [
          'Fritz alarga a margem do desenho. Cabem seu barquinho e outros de formas diferentes! Acrescenta pessoas recebendo quem chega e lembra que aquela terra já tinha histórias muito antes dos navios europeus. A aventura não começa num lugar vazio.',
          'A flor finalmente alcança a margem de papel. Fritz guarda o barco dobrado no diário; nada fica na água ou no monumento. Os vincos continuam ali, junto aos desenhos de casa e amigos. Sua pequena travessia terminou com lugar para mais histórias, não com uma única história para todo mundo.',
        ],
        keepsake: 'Todo recomeço merece uma margem acolhedora',
      },
    ],
  },
  {
    id: 'sambaqui', name: 'Museu Arqueológico de Sambaqui', icon: '🐚',
    description: 'Abra três abas de perguntas e aprenda a proteger o passado.',
    place: 'Museu Arqueológico de Sambaqui de Joinville',
    art: '/trilha-sambaqui.webp', artAlt: 'Fritz observa conchas e uma maquete das camadas de um sambaqui numa vitrine de museu.',
    fact: 'O Museu Arqueológico de Sambaqui preserva e pesquisa a cultura e o modo de vida de povos construtores de sambaquis que viveram na região há mais de 5 mil anos.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/museu_arqueologico_de_sambaqui_de_joinville',
    additionalSources: [
      { label: 'Prefeitura de Joinville · Museu Arqueológico de Sambaqui', url: 'https://www.joinville.sc.gov.br/institucional/secult/upm/mas/' },
    ],
    chapters: [
      {
        title: 'Antes da primeira página', at: 1500,
        paragraphs: [
          'No Museu de Sambaqui, Fritz conhece vestígios de povos que viveram na região há mais de cinco mil anos. “Meu mapa começou tarde demais!”, percebe. Antes das ruas que desenhou, já existiam muitas vidas e histórias ali.',
          'No diário, inventa um jogo de perguntas, não uma caça a objetos. Desenha três abas sobre camadas de cores. A primeira pergunta é: “Como aprender com algo que ficou do passado?”. Ele levanta a aba com o lápis e encontra a pista seguinte: observar com cuidado.',
        ],
        keepsake: 'Escutar o passado começa por reconhecer o que não sabemos',
      },
      {
        title: 'Camadas de cuidado', at: 18000,
        paragraphs: [
          'Fritz observa as informações do museu e volta ao jogo de abas. Desenha uma concha de papel em uma camada. Tenta movê-la para outra e percebe: agora o desenho conta uma ordem diferente! O lugar onde um vestígio foi encontrado também ajuda os pesquisadores a entender o passado.',
          'O jacaré não toca nas peças nem recolhe conchas de sítios. Sua segunda aba guarda uma lupa desenhada e a palavra “proteger”. Sob a última aparece um espaço para escrever. Será um prêmio, um nome inventado ou uma pergunta nova?',
        ],
        keepsake: 'Preservar também é saber deixar onde está',
      },
      {
        title: 'Um guardião que aprende', at: 65000,
        paragraphs: [
          'Fritz abre a terceira aba: é espaço para outra pergunta! Escreve “O que ainda podemos aprender?” e registra o nome do Museu de Sambaqui. Não inventa falas ou costumes para as pessoas do passado. Quando não sabe, pode perguntar e procurar uma fonte.',
          'O jogo de três abas fica completo: observar, proteger e continuar aprendendo. Fritz volta com o diário cheio e os bolsos vazios. Nenhuma peça saiu do lugar! Agora seu mapa de Joinville começa com uma página aberta para histórias muito mais antigas que a chegada dos imigrantes.',
        ],
        keepsake: 'Uma cidade tem raízes mais profundas do que o nosso primeiro mapa',
      },
    ],
  },
  {
    id: 'escola-bolshoi', name: 'Escola do Teatro Bolshoi', icon: '🩰',
    description: 'Desembarace a fita e invente uma dança, um passo de cada vez.',
    place: 'Escola do Teatro Bolshoi no Brasil',
    art: '/trilha-bolshoi.webp', artAlt: 'Fritz acompanha um ensaio de balé num salão iluminado, com sapatilhas e flores em primeiro plano.',
    fact: 'A Escola do Teatro Bolshoi no Brasil funciona em Joinville desde 2000 e oferece formação em dança com bolsas para seus alunos.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/escola-do-teatro-bolshoi-no-brasil',
    chapters: [
      {
        title: 'O passo que ninguém aplaudiu', at: 3000,
        paragraphs: [
          'Ao conhecer a Escola do Teatro Bolshoi no Brasil, que funciona em Joinville desde 2000, Fritz fica curioso sobre os ensaios. No diário, inventa um palco de papel e desenha uma fita ligando três marcas no chão. Quer criar uma dança para sua flor!',
          'Ele tenta começar com um giro enorme. A cauda varre os lápis da mesa: clac-clac! Melhor começar pequeno. Desenha um passo, depois uma pausa. A primeira marca brilha, mas a fita faz um nó antes da segunda. Nem toda dança começa com um salto.',
        ],
        keepsake: 'O esforço que ninguém vê também merece carinho',
      },
      {
        title: 'A fita e a mão estendida', at: 40000,
        paragraphs: [
          'O nó da fita parece um macarrão! Fritz puxa uma ponta e ele aperta ainda mais. Na história, um companheiro sugere parar, respirar e olhar o caminho da fita. Juntos soltam uma volta de cada vez. Pedir ajuda também faz parte do ensaio.',
          'A segunda marca brilha. Fritz repete o passo simples e faz uma pausa para descansar. Só então desenha o próximo. A fita chega à beirada do palco, mas a última marca está apagada. Falta a apresentação perfeita? O jacaré acha que pode ser outra coisa.',
        ],
        keepsake: 'Continuar também inclui respirar e aceitar ajuda',
      },
      {
        title: 'O aplauso que volta para casa', at: 140000,
        paragraphs: [
          'Fritz volta ao palco de papel com a fita desembaraçada. Faz o passo, a pausa e um giro pequeno. Sai um pouquinho torto. Ele sorri e termina mesmo assim! Os amigos do desenho batem palmas, e a terceira marca finalmente se acende.',
          'O jacaré desenha estrelas também para quem ajudou a ensaiar, descansar e tentar de novo. A fita une todas elas. A dança da flor não ficou perfeita, mas conta a aventura inteira: começar pequeno, aceitar ajuda e dividir a alegria de conseguir.',
        ],
        keepsake: 'Um sonho floresce melhor quando encontra apoio pelo caminho',
      },
    ],
  },
  {
    id: 'o-farol', name: 'O Farol', icon: '💡',
    description: 'Uma lampadinha pede ajuda para melhorar uma parada de papel.',
    place: 'O Farol · Rua Max Colin',
    art: '/trilha-farol.webp', artAlt: 'Fritz desenha num caderno ao lado de uma lamparina, diante de uma edificação urbana iluminada.',
    fact: 'A Torre O Farol foi construída entre 1952 e 1954 para uma revenda de automóveis; depois abrigou a rodoviária e a Prefeitura. É um edifício urbano, não um farol marítimo.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/o-farol',
    additionalSources: [
      { label: 'Prefeitura de Joinville · história e visitação da Torre O Farol', url: 'https://www.joinville.sc.gov.br/servicos/visitar-torre-o-farol/' },
    ],
    chapters: [
      {
        title: 'Uma luz ainda pequena', at: 6000,
        paragraphs: [
          '“Cadê o mar?”, pergunta Fritz ao conhecer O Farol. Descobre que a torre é urbana: já teve usos ligados a carros, ônibus e à Prefeitura. Não é um farol de navios! Um mesmo prédio pode participar de capítulos diferentes da cidade.',
          'Inspirado nisso, Fritz inventa no diário uma parada de descanso para viajantes. Desenha um banco e uma lampadinha de ideia. Mas o banco de papel só tem lugar para a pontinha da sua cauda. A lampadinha pisca: o projeto ainda precisa crescer!',
        ],
        keepsake: 'Uma ideia não precisa nascer grande para merecer atenção',
      },
      {
        title: 'O desenho que ganhou outras mãos', at: 85000,
        paragraphs: [
          'Fritz aumenta o banco da parada. Um amigo do desenho chega de cadeira de rodas; outro quer fugir do sol. Cadê a passagem larga? Cadê a sombra? O jacaré pega a borracha. Sua primeira ideia não precisa ser a última.',
          'O grupo desenha espaço para passar, uma árvore e água para beber. A lampadinha brilha mais forte a cada sugestão. Mas Fritz pôs a árvore bem no meio do caminho! Antes de chamar o projeto de pronto, vão ter de experimentá-lo no papel.',
        ],
        keepsake: 'Escutar outras pessoas também faz parte de criar',
      },
      {
        title: 'Acender sem ofuscar', at: 300000,
        paragraphs: [
          'Com o lápis, Fritz move a árvore para o lado do banco. Os amigos percorrem o desenho: agora ninguém precisa apertar a barriga para passar! A lampadinha para de piscar e fica acesa. O rascunho encontrou um jeito melhor de receber todo mundo.',
          'A parada continua sendo uma invenção no diário, não uma obra ou serviço da torre real. Fritz guarda as versões, até a do banco minúsculo. Ao lado do desenho de O Farol, anota: perguntar, testar e mudar de ideia pode levar mais longe do que acertar de primeira.',
        ],
        keepsake: 'Inovar também é tornar o caminho mais acolhedor',
      },
    ],
  },
  {
    id: 'empadas-jerke', name: 'Empadas Jerke', icon: '🥟',
    description: 'Abra as três dobras de um guardanapo com cheirinho de aventura.',
    place: 'Empadas Jerke',
    art: '/trilha-empadas.webp', artAlt: 'Uma cozinheira oferece empadas douradas a Fritz numa cozinha acolhedora.',
    fact: 'As Empadas Jerke mantêm uma tradição gastronômica de Joinville iniciada em 1922, ligada à receita de massa folhada.',
    source: 'https://www.visitejoinville.com.br/restaurante/empadas-jerke',
    chapters: [
      {
        title: 'O aroma da pausa', at: 12000,
        paragraphs: [
          'Grrrum! Não era um monstro: era a barriga de Fritz. Ao conhecer a tradição das Empadas Jerke, iniciada em 1922, ele imagina uma pausa de aventura. Desenha uma mesa, uma empada de papel e um guardanapo com três dobrinhas.',
          'O guardanapo se abre na fantasia e mostra um desafio: “Uma lembrança tem mais de uma camada”. Fritz examina o desenho da massa folhada. Dá para contar as camadas? Antes de terminar, já esqueceu em qual estava. Vai precisar de uma pista que não seja só número!',
        ],
        keepsake: 'Você também faz parte do cuidado que oferece à cidade',
      },
      {
        title: 'Camadas de lembrança', at: 170000,
        paragraphs: [
          'Fritz volta ao guardanapo de três dobras. Na primeira, desenha o sabor; na segunda, o dia de chuva do lado de fora. A empada já parece cheia de história! Não precisa descobrir uma receita secreta para perceber o cuidado de quem prepara comida.',
          'A terceira dobra não abre. O jacaré tenta soprar, fazer cócegas com o lápis e pedir “por favor”. Nada! Então nota a outra cadeira da mesa, ainda vazia. Talvez a última camada não esteja no prato.',
        ],
        keepsake: 'O mesmo sabor pode abrir muitas histórias',
      },
      {
        title: 'O encontro que ficou', at: 600000,
        paragraphs: [
          'Fritz desenha um companheiro na cadeira vazia e reparte o lanche de papel. Pronto! A terceira dobra se abre. Ali ele desenha duas carinhas sorrindo. Sabor, dia de chuva e companhia: as três camadas da sua lembrança estão juntas.',
          'O guardanapo vira uma flor quando Fritz o guarda no diário. A tradição das empadas é real; o guardanapo mágico é brincadeira da história. O jacaré sai com a barriga imaginária contente e uma boa ideia: numa aventura comprida, também vale parar para conversar.',
        ],
        keepsake: 'Algumas lembranças começam quando aceitamos fazer uma pausa',
      },
    ],
  },
  {
    id: 'instituto-juarez', name: 'Instituto Juarez Machado', icon: '🎨',
    description: 'Ajude uma borboleta desenhada a ganhar cores e sair da moldura.',
    place: 'Instituto Internacional Juarez Machado',
    art: '/trilha-instituto.webp', artAlt: 'Fritz pinta uma flor no jardim de uma casa cultural, entre molduras coloridas.',
    fact: 'O Instituto Internacional Juarez Machado reúne obras do artista joinvilense e exposições de outros artistas no bairro América.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/instituto-internacional-juarez-machado',
    chapters: [
      {
        title: 'Uma janela para olhar de novo', at: 25000,
        paragraphs: [
          'No Instituto Juarez Machado, Fritz conhece um lugar dedicado à arte de um joinvilense e a outras exposições. Depois abre seu próprio caderno: quer pintar uma flor que só ele inventou. Começa pelo jardim, mas usa tanto cinza que até a borboleta desenhada parece uma meia!',
          'Fritz olha de novo. Tem verde na folha, dourado na poça e rosa na pétala. Faz três montinhos de tinta de fantasia na página. A borboleta ganha uma asa colorida e deixa uma pista: falta a cor que o jacaré ainda tem medo de usar.',
        ],
        keepsake: 'O lugar muda quando nosso olhar aprende a demorar',
      },
      {
        title: 'A cor que faltava era sua', at: 340000,
        paragraphs: [
          'A borboleta espera ao lado dos montinhos de tinta. Fritz quer pintar a flor roxa, mas pensa: “E se ficar esquisita?”. Sua cauda esbarra no lápis, e uma mancha atravessa o desenho. Ih! Agora há um rio bem no meio do jardim.',
          'Em vez de apagar tudo, ele faz uma ponte sobre a mancha e pinta a flor de roxo. Gostou! A segunda asa da borboleta ganha cor. Só falta uma saída: Fritz desenhou uma moldura tão fechada que ela não consegue voar para o resto da página.',
        ],
        keepsake: 'Seu jeito de ver também merece um lugar na página',
      },
      {
        title: 'Uma moldura aberta', at: 1200000,
        paragraphs: [
          'Fritz abre um cantinho da moldura. A borboleta do diário passa por ele e dá uma volta sobre a flor roxa, o rio de tinta e a ponte. O que começou cinzento virou um jardim com surpresa! Até a mancha encontrou seu lugar.',
          'A pintura é criação do jacaré, não uma obra de Juarez Machado. Fritz guarda a página e promete olhar antes de dizer “já sei”. Da próxima vez que uma ideia sair torta, talvez ela esteja mostrando uma ponte que ele ainda não tinha pensado em desenhar.',
        ],
        keepsake: 'Há beleza em deixar espaço para o que ainda vamos descobrir',
      },
    ],
  },
  {
    id: 'museu-arte', name: 'Museu de Arte', icon: '🖼️',
    description: 'Uma moldura, um jardim e três jeitos de olhar a mesma forma.',
    place: 'Museu de Arte de Joinville · Cidadela Cultural Antárctica',
    art: '/trilha-museu-arte.webp', artAlt: 'Fritz olha através de uma moldura no jardim de um museu, junto a uma escultura abstrata.',
    fact: 'O Museu de Arte de Joinville ocupa a antiga casa de Ottokar Doerffel. Seus jardins e a Cidadela Cultural integram a vida cultural da cidade.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/museu-de-arte-de-joinville-e-cidadela-cultural-antarctica',
    chapters: [
      {
        title: 'O jardim fora da moldura', at: 50000,
        paragraphs: [
          'No Museu de Arte de Joinville, instalado na antiga casa de Ottokar Doerffel, Fritz se encanta com o jardim. Em seu diário, inventa uma moldura de quatro peças para guardar o que viu. Mas sempre fica uma árvore do lado de fora!',
          'Ele abre um canto da moldura. O jardim de papel cresce, e uma forma curva aparece entre as flores. Parece uma onda. Ou será uma asa? Fritz precisa mudar de lugar para investigar sem tocar em nenhuma obra real.',
        ],
        keepsake: 'Nem toda beleza precisa caber no contorno que trouxemos',
      },
      {
        title: 'O banco de dois olhares', at: 680000,
        paragraphs: [
          'Fritz desenha um banco diante da forma curva que inventou. De um lado vê uma onda; do outro, uma asa. Um amigo de papel diz que parece uma folha enrolada. “Três respostas? Meu lápis só trouxe uma placa!”, brinca o jacaré.',
          'Ele usa a placa para escrever uma pergunta: “O que você vê?”. O banco ganha espaço para mais olhares. A moldura abre outro canto e mostra caminhos saindo do jardim. Para onde vai uma ideia quando outras pessoas ajudam a olhar?',
        ],
        keepsake: 'Olhares diferentes podem dividir o mesmo banco',
      },
      {
        title: 'A cidade como lugar de encontro', at: 2400000,
        paragraphs: [
          'Os caminhos do desenho ligam jardim, salas de arte e espaços da Cidadela Cultural. Fritz deixa a moldura aberta e convida os amigos a acrescentar cores. A onda vira ponte para alguém; a asa vira folha para outro. Ninguém precisa apagar a ideia do vizinho.',
          'O jacaré guarda a moldura de quatro peças, agora usada como mapa de encontros. O museu real inspirou a visita; as formas da página são invenções suas. Ele veio procurar um único desenho bonito e volta com uma pergunta que pode compartilhar: “O que você vê?”.',
        ],
        keepsake: 'A cultura floresce quando o encontro encontra espaço',
      },
    ],
  },
  {
    id: 'cemiterio-imigrantes',     name: 'Cemitério do Imigrante', icon: '🌳',
    description: 'Faça um cartão de três pétalas para acolher quem sente saudade.',
    place: 'Casa da Memória · Cemitério do Imigrante',
    art: '/trilha-memoria.webp', artAlt: 'Fritz deposita uma flor junto a um memorial num bosque sereno, perto de uma casa histórica.',
    fact: 'O Cemitério do Imigrante foi fundado em 1851 e preserva cerca de 500 jazigos de mais de 3 mil pessoas, entre imigrantes europeus, afrodescendentes e luso-brasileiros. A Casa da Memória foi a antiga casa do coveiro.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/casa-da-memoria-cemiterio-dos-imigrantes',
    additionalSources: [
      { label: 'Prefeitura de Joinville · história do Cemitério do Imigrante', url: 'https://www.joinville.sc.gov.br/noticias/prefeitura-de-joinville-promove-mais-uma-edicao-da-visita-guiada-ao-cemiterio-do-imigrante/' },
    ],
    chapters: [
      {
        title: 'O nome dito baixinho', at: 100000,
        paragraphs: [
          'Nesta trilha, Fritz anda devagar e fala baixinho. O Cemitério do Imigrante é um lugar de lembrar pessoas que morreram, não de procurar sustos ou tesouros. Há muitas vidas na história de Joinville que merecem respeito, inclusive de famílias com origens diferentes.',
          'No diário, ele desenha uma flor com três pétalas. Quer fazer um cartão para quem sente saudade. Na primeira pétala, escreve “escutar”. A segunda fica em branco. O que se pode dizer quando um amigo lembra de alguém querido?',
        ],
        keepsake: 'Lembrar de alguém também pode ser um gesto silencioso',
      },
      {
        title: 'A casa que guarda cuidado', at: 1400000,
        paragraphs: [
          'Fritz aprende que a Casa da Memória foi a antiga casa do coveiro. Cuidar do lugar e dos nomes também é trabalho importante. No cartão, desenha uma casinha ao lado da flor de três pétalas, sem inventar histórias para as pessoas dos memoriais.',
          'Um amigo da página lembra de uma receita feita por alguém de quem sente falta. Fritz escuta sem dizer “não fique triste”. Na segunda pétala escreve “lembrar”. A última ainda espera. Talvez o cartão não precise de uma frase que resolva tudo.',
        ],
        keepsake: 'Cuidar da memória é tratar cada vida com dignidade',
      },
      {
        title: 'O que levamos adiante', at: 4800000,
        paragraphs: [
          'Na terceira pétala do cartão, Fritz escreve “ficar perto”. Pronto: escutar, lembrar e fazer companhia. Não é uma cura mágica para a saudade. É um jeito de dizer ao amigo que ele não precisa conversar sozinho.',
          'Fritz guarda o cartão no próprio diário. Não tira objetos do lugar nem mexe nos memoriais. Sai com passos leves, como entrou. Se uma lembrança trouxer tristeza ou perguntas, pode conversar com um adulto de confiança. A flor de papel tem espaço para sentimentos diferentes.',
        ],
        keepsake: 'Continuar não significa deixar de lembrar',
      },
    ],
  },
  {
    id: 'harmonia-lyra', name: 'Sociedade Harmonia Lyra', icon: '🎼',
    description: 'Uma notinha de sapatos grandes precisa de ajuda para entrar na canção.',
    place: 'Sociedade Cultural Harmonia Lyra',
    art: '/trilha-lyra.webp', artAlt: 'Fritz contempla um piano e uma lira num teatro acolhedor, entre pétalas douradas.',
    fact: 'A Harmonia Lyra é um espaço histórico de música, dança e teatro em Joinville, com raízes na Sociedade Harmonie de 1858.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/harmonia-lyra',
    chapters: [
      {
        title: 'A nota que ficou na porta', at: 200000,
        paragraphs: [
          'Ao conhecer a Harmonia Lyra, Fritz descobre um lugar ligado à música, à dança e ao teatro de Joinville. Depois inventa no diário uma notinha musical com sapatos enormes. Ela quer entrar no teatro de papel, mas tropeça no próprio “dó”!',
          'Fritz desenha um caminho de cinco linhas para a notinha andar. Ela dá o primeiro passo e faz um som baixinho. Atrás da porta vem uma resposta: ré! A missão agora é juntar uma canção, sem deixar a pequena nota do lado de fora.',
        ],
        keepsake: 'Uma voz pequena também pode começar uma canção',
      },
      {
        title: 'Aprender a escutar o conjunto', at: 2800000,
        paragraphs: [
          'A notinha de sapatos grandes entra no teatro do diário e encontra as outras. Todas começam juntas: dó-ré-mi-PÁ! Fritz cobre as orelhas de brincadeira. Falta combinar quando cada uma toca. Ele desenha pausas e marca a vez de escutar.',
          'A primeira nota já pode ser ouvida sem gritar. As outras respondem uma de cada vez, e nasce um pedacinho de melodia. Mas o caminho de cinco linhas termina na porta. Como levar a canção para quem não entrou no desenho do teatro?',
        ],
        keepsake: 'Harmonia não é todo mundo soar igual, é aprender a se ouvir',
      },
      {
        title: 'A canção continua na rua', at: 9600000,
        paragraphs: [
          'Fritz estende as cinco linhas até a rua de papel. A notinha sai com seus sapatos enormes e convida outras vozes. A canção muda um pouquinho a cada resposta. O jacaré marca o ritmo com a ponta do lápis: agora tem música e espaço para escutar.',
          'O concerto é imaginário, inspirado pela memória cultural da Harmonia Lyra. Fritz guarda a partitura desenhada, mas deixa o convite fora da capa. Não é preciso cantar alto nem acertar tudo para participar. A nota que tinha medo de entrar foi quem abriu a porta!',
        ],
        keepsake: 'O que construímos juntos pode continuar depois do último aplauso',
      },
    ],
  },
  {
    id: 'deutsche-schule', name: 'Deutsche Schule', icon: '📚',
    description: 'Construa um livro-ponte com perguntas, palavras e ajuda de amigos.',
    place: 'Deutsche Schule · memória da educação em Joinville',
    art: '/trilha-escola.webp', artAlt: 'Fritz e uma professora observam uma ponte florida ilustrada num livro aberto na escola.',
    fact: 'A Deutsche Schule integra a memória da educação e da língua alemã em Joinville. Sua edificação faz parte do Colégio Bonja.',
    source: 'https://www.visitejoinville.com.br/turismoemjoinville/deutsche-schule',
    chapters: [
      {
        title: 'A palavra que ainda não conheço', at: 400000,
        paragraphs: [
          'Fritz conhece a memória da Deutsche Schule, ligada à educação e à língua alemã em Joinville. No diário, desenha um livro que vira uma ponte. Bem no meio aparece uma palavra desconhecida. Ele tenta passar por cima: o pé de papel fica preso num ponto de interrogação!',
          'O jacaré para de adivinhar e pede ajuda. Descobre que aprender começa justamente quando existe algo que ainda não sabemos. O ponto de interrogação se transforma no primeiro apoio da ponte. Mas faltam duas partes para chegar à outra página.',
        ],
        keepsake: 'Não saber ainda é um começo, não um defeito',
      },
      {
        title: 'Duas margens, muitas vozes', at: 5600000,
        paragraphs: [
          'Com o primeiro apoio no lugar, Fritz desenha palavras nas duas margens do livro. Uma veio de uma família, outra de outra língua. “Preciso apagar as minhas para aprender essas?” Não! Ele pode guardar as que já conhece e descobrir outras.',
          'O segundo trecho da ponte cresce quando Fritz escuta e tenta de novo. Ele erra um som e dá risada sem rir de ninguém. Falta a última parte, perto da outra margem. Ali espera um personagem de papel que também precisa de ajuda para começar.',
        ],
        keepsake: 'Aprender outra voz não exige esquecer a nossa',
      },
      {
        title: 'O caderno que passa adiante', at: 19200000,
        paragraphs: [
          'Fritz mostra ao novo companheiro como fez o primeiro apoio da ponte: perguntou! Os dois desenham a parte que faltava. O livro-ponte fica completo, com palavras nas duas margens e flores de tamanhos diferentes pelo caminho.',
          'O jacaré guarda a aventura ao lado do nome da antiga escola. A ponte não existe no prédio: é a maneira que inventou de lembrar o que aprendeu ali. Agora já sabe atravessar e ajudar alguém a começar, sem precisar esconder um “ainda não sei”.',
        ],
        keepsake: 'O que aprendemos pode ser a ponte de outra pessoa',
      },
    ],
  },
  {
    id: 'opa-jerke', name: 'Opa Jerke', icon: '🏘️',
    description: 'Acenda três pontinhos de um mapa que não quer parar de descobrir.',
    place: 'Opa Jerke · Rua do Príncipe',
    art: '/trilha-opa.webp', artAlt: 'Fritz compartilha uma mesa com moradores numa rua histórica iluminada ao anoitecer.',
    fact: 'Opa Jerke fica na Rua do Príncipe e é o ponto de encerramento do Walking Tour Imperdíveis de Joinville.',
    source: 'https://www.visitejoinville.com.br/imperd%C3%ADveis-de-joinville---interna/opa-%20jerke',
    chapters: [
      {
        title: 'A esquina de todas as lembranças', at: 800000,
        paragraphs: [
          'Na Rua do Príncipe, Fritz conhece o Opa Jerke, parada que encerra o Walking Tour Imperdíveis de Joinville. No diário, inventa seu próprio fim de passeio: uma mesa e um mapa com três pontinhos. Eles estão apagados! Será que esqueceu todos os caminhos?',
          'O primeiro pontinho acende quando ele desenha uma parada de que gostou. Pode ser dali mesmo, sem ter terminado outra trilha. Fritz acrescenta a esquina, o diário e uma cadeira. Faltam dois pontinhos e um lugar para abrir o mapa sem derrubar a xícara.',
        ],
        keepsake: 'Um caminho vale também pelas pessoas que nos tornamos ao percorrê-lo',
      },
      {
        title: 'O mapa sobre a mesa', at: 11200000,
        paragraphs: [
          'Fritz afasta a xícara de papel e abre o mapa dos três pontinhos. No segundo, desenha quem ajudou no passeio: alguém que explicou um lugar, um companheiro ou quem caminhou ao seu lado. O ponto se acende! O mapa não quer só endereços.',
          'O jacaré liga as duas luzinhas com um traço, sem transformar todas as paradas na mesma história. Cada uma guarda algo diferente. O terceiro pontinho foge para a borda da folha. Fritz tenta alcançá-lo com o lápis: parece que ele ainda quer passear!',
        ],
        keepsake: 'Cada parada é diferente; o cuidado pode atravessar todas elas',
      },
      {
        title: 'Até a próxima pétala', at: 38400000,
        paragraphs: [
          '“Já entendi!”, diz Fritz. No terceiro pontinho, desenha uma seta para uma descoberta que ainda quer fazer. A luz se acende e para de fugir. O mapa ficou completo com uma lembrança, uma companhia e uma próxima curiosidade.',
          'Fritz guarda o desenho da mesa junto ao mapa e fecha o diário com uma pétala de papel. O passeio pode acabar sem acabar com a vontade de aprender. Joinville tem mais histórias do que cabem numa mochila! Ele ajeita o lenço e deixa o convite: “Na próxima esquina, você vem comigo?”.',
        ],
        keepsake: 'Há despedidas que são apenas um jeito carinhoso de dizer até breve',
      },
    ],
  },
];

export const LANDMARK_JOURNEYS = LANDMARK_JOURNEY_METADATA.map((journey) => {
  const copy = getRecreatedJourney(journey.id);
  return { ...journey, name: copy.name, description: copy.description };
});
