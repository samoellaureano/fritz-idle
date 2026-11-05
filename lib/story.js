import { applyRecreatedChapter } from './recreated-story-copy.js';

const STORY_CHAPTER_METADATA = [
  {
    id: 'a-primeira-petala',
    number: 1,
    title: 'A pétala que não se entregou',
    place: 'Alameda Brüstlein · Museu Nacional de Imigração e Colonização',
    character: 'Fritz',
    icon: '🌴',
    at: 0,
    art: '/historia-palmeiras.jpg',
    artAlt: 'Fritz encontra uma pétala dourada diante do Museu da Imigração, na Rua das Palmeiras, enquanto a cidade desperta.',
    fact: 'A Alameda Brüstlein é conhecida como Rua das Palmeiras e fica diante do Museu Nacional de Imigração e Colonização. A ventania e o mapa de lembranças pertencem à aventura fictícia de Fritz.',
    paragraphs: [
      'Fuuush! Uma ventania virou o guarda-chuva de Fritz do avesso e espalhou as cores do seu diário. Até a flor da capa ficou cinzenta! Debaixo das palmeiras da Alameda Brüstlein, o pequeno jacaré encontrou uma pétala dourada. Ela deu três pulinhos e pousou bem no seu focinho. Atchim!',
      'Fritz abriu o diário diante do Museu da Imigração. Na aventura, a pétala desenhou oito espaços vazios ao redor de uma flor. Era um mapa de lembranças! Para devolver a cor à capa, ele teria de descobrir o que as pessoas criam, aprendem e cuidam em Joinville. Não bastava correr atrás de pétalas.',
      'Ele desenhou as palmeiras para não esquecer o começo. O primeiro espaço brilhou. Então surgiu uma pista na página seguinte: uma carta sem remetente! Fritz ajeitou a mochila. Quem teria deixado uma mensagem num diário que era só dele?',
    ],
    keepsake: 'O brilho de quem começa outra vez',
    sources: [
      {
        label: 'Prefeitura de Joinville · plantio e história da Rua das Palmeiras',
        url: 'https://www.joinville.sc.gov.br/noticias/prefeitura-de-joinville-vai-implementar-plano-de-manutencao-na-rua-das-palmeiras/',
      },
      {
        label: 'Visite Joinville · Rua das Palmeiras e Museu da Imigração',
        url: 'https://www.visitejoinville.com.br/imperd%C3%ADveis-de-joinville---interna/rua-das-palmeiras-e-museu-da-imigracao',
      },
    ],
  },
  {
    id: 'a-carta-de-francisca',
    number: 2,
    title: 'A carta que Fritz inventou',
    place: 'Museu Nacional de Imigração e Colonização · memória de Dona Francisca',
    character: 'A memória de Dona Francisca',
    icon: '💌',
    at: 100,
    art: '/historia-francisca.jpg',
    artAlt: 'Fritz imagina uma carta diante do Museu Nacional de Imigração e Colonização, entre palmeiras ao amanhecer.',
    fact: 'Dona Francisca, irmã de D. Pedro II, casou-se com François d’Orléans, príncipe de Joinville. O casal nunca visitou Joinville. A carta é inventada pelo personagem; não é documento do museu nem mensagem da princesa.',
    paragraphs: [
      'Fritz virou a página com todo o cuidado. A carta misteriosa estava em branco! Não é uma carta do acervo: era uma invenção de Fritz que a magia do diário tinha dobrado como envelope. “Ah, fui eu mesmo!”, riu, coçando a cabeça. Antes de escrever, resolveu conhecer melhor o museu.',
      'Descobriu uma surpresa: Dona Francisca nunca visitou Joinville e não morou ali, no casarão conhecido como Palácio dos Príncipes. Um nome de lugar também pode guardar uma história de quem esteve longe! No envelope, Fritz desenhou muitas malas diferentes e uma mesa com lugar para quem chega.',
      '“Que bom ter você aqui!”, escreveu com suas próprias palavras. O segundo espaço do mapa ficou cor-de-rosa. Ao fechar o envelope, percebeu uma marca em relevo na folha: parecia uma pequena escultura. O próximo caminho subia uma colina, até a casa de outro Fritz!',
    ],
    keepsake: 'Uma cidade feita de muitas chegadas',
    sources: [
      {
        label: 'Prefeitura de Joinville · A história da princesa Dona Francisca',
        url: 'https://www.joinville.sc.gov.br/noticias/documentario-relembra-historia-da-princesa-dona-francisca/',
      },
      {
        label: 'Visite Joinville · Trilha do Patrimônio, encontro 8',
        url: 'https://www.visitejoinville.com.br/trilha-do-patrimonio-encontros/patrim%C3%B4nio%2008',
      },
      {
        label: 'ND Mais · Dona Francisca nunca visitou Joinville',
        url: 'https://ndmais.com.br/literatura/biblioteca-nacional-guarda-parte-da-historia-de-joinville-e-da-princesa-francisca-carolina/',
      },
      {
        label: 'Visite Joinville · Rua das Palmeiras e Museu da Imigração',
        url: 'https://www.visitejoinville.com.br/imperd%C3%ADveis-de-joinville---interna/rua-das-palmeiras-e-museu-da-imigracao',
      },
    ],
  },
  {
    id: 'o-atelier-na-colina',
    number: 3,
    title: 'O ateliê que continuou aceso',
    place: 'Museu Casa Fritz Alt · Boa Vista',
    character: 'Legado de Fritz Alt',
    icon: '🗿',
    at: 800,
    art: '/historia-fritzalt.jpg',
    artAlt: 'Fritz contempla Joinville ao amanhecer com a companhia silenciosa de uma escultura na colina.',
    fact: 'Fritz Alt chegou a Joinville em 1922. A antiga casa-ateliê preserva sua memória; entre suas obras públicas está um busto de Dona Francisca. O jacaré Fritz é um personagem fictício, não o escultor.',
    paragraphs: [
      'A subida fez a mochila balançar: toc, toc, toc! Na Casa Fritz Alt, o jacaré não encontra o escultor, mas conhece obras que ele deixou. “Dois Fritzes e só um usa mochila”, brincou. O artista chegou a Joinville em 1922 e fez esculturas que participam da memória da cidade, como um busto de Dona Francisca.',
      'De volta ao desenho do diário, Fritz tentou fazer uma flor com massinha imaginária. Saiu um repolho. Tentou outra vez: um repolho com chapéu! Na terceira, parou de apertar depressa e modelou uma pétala de cada vez. A flor ficou tortinha, mas ficou de pé.',
      'O terceiro espaço ganhou a cor da argila. Fritz guardou o desenho, sem tocar nas obras do museu. A sombra da sua flor parecia uma moldura! Ele a contornou com o lápis e seguiu a nova pista até o Instituto Juarez Machado. Será que uma moldura vazia podia guardar alguma coisa?',
    ],
    keepsake: 'A arte que transforma saudade em presença',
    sources: [
      {
        label: 'Prefeitura de Joinville · A trajetória de Fritz Alt e o Museu Casa',
        url: 'https://www.joinville.sc.gov.br/noticias/secult-lanca-e-book-sobre-a-historia-e-trajetoria-de-fritz-alt-durante-a-feira-do-livro/',
      },
      {
        label: 'Cadernos do Patrimônio Cultural · Museu Casa Fritz Alt',
        url: 'https://www.joinville.sc.gov.br/publicacoes/cadernos-do-patrimonio-cultural-de-joinville/',
      },
    ],
  },
  {
    id: 'uma-cidade-em-cores',
    number: 4,
    title: 'Uma cidade cabe dentro de uma cor',
    place: 'Instituto Internacional Juarez Machado · Rua Lages',
    character: 'Obra e legado de Juarez Machado',
    icon: '🎨',
    at: 6000,
    art: '/historia-juarez.jpg',
    artAlt: 'Fritz encontra inspiração no universo de cores, gestos e flores da arte de Joinville.',
    fact: 'Juarez Machado nasceu em Joinville. O Instituto Internacional Juarez Machado abriu ao público em 2014. Os desenhos feitos pelo jacaré na aventura não são obras do artista.',
    paragraphs: [
      'No Instituto Juarez Machado, Fritz conheceu a arte de alguém que nasceu em Joinville e levou sua criatividade para muitos lugares. O jacaré fez uma moldura com os dedos: primeiro enquadrou uma árvore, depois uma poça, depois o próprio pé. “Esse quadro tem um dedo a mais!”, riu.',
      'A moldura da pista não precisava de uma obra perdida. Precisava de um olhar curioso! No seu diário, ele pintou o reflexo das folhas na poça. Misturou azul com amarelo e achou um verde que parecia dar cócegas. A flor de massinha do capítulo anterior ganhou um jardim inteiro.',
      'O quarto espaço acendeu em muitas cores. Mas uma delas continuava escapando da página: um amarelo que brilhava mesmo quando Fritz cobria o desenho com a mão. Parecia luz de verdade! Ele foi investigar a arte de Luiz Henrique Schwanke, com a moldura agora desenhada no mapa.',
    ],
    keepsake: 'A coragem de enxergar beleza de outro jeito',
    sources: [
      {
        label: 'Funarte · Vida e obra de Juarez Machado',
        url: 'https://www.gov.br/funarte/pt-br/assuntos/noticias/todas-noticias/funarte-reverencia-juarez-machado',
      },
      {
        label: 'Instituto Internacional Juarez Machado · O artista',
        url: 'https://www.institutojuarezmachado.com.br/artista',
      },
    ],
  },
  {
    id: 'luz-para-quem-chega',
    number: 5,
    title: 'Uma luz acesa para quem ainda vem',
    place: 'Cidadela Cultural · o legado de Luiz Henrique Schwanke',
    character: 'Obra e legado de Luiz Henrique Schwanke',
    icon: '💡',
    at: 40000,
    art: '/historia-schwanke.jpg',
    artAlt: 'Fritz e amigos observam uma instalação luminosa imaginária durante uma noite de festa em Joinville.',
    fact: 'Luiz Henrique Schwanke nasceu em Joinville e trabalhou com pintura, desenho, escultura e instalações. A brincadeira de sombras de Fritz é ficção, não uma instalação ou um episódio da vida do artista.',
    paragraphs: [
      'O amarelo levou Fritz a conhecer o legado do joinvilense Luiz Henrique Schwanke. Ele trabalhou com desenhos, pinturas, esculturas e instalações: arte que também pode ocupar o espaço! “Então a ideia pode sair da moldura?”, perguntou o jacaré ao seu próprio caderno.',
      'Na página de fantasia, Fritz desenhou uma lanterninha. Pôs uma folha de papel diante dela e fez uma sombra enorme de jacaré. Abriu a boca: o jacaré da parede abriu também! Os amigos inventados do diário chegaram para brincar. Um fez uma asa com as mãos; outro, uma flor.',
      'Quando dividiram a luz, o quinto espaço ficou dourado. Da janela do desenho veio um som: tum-tum, pá! Fritz olhou a lanterninha. Ela não tinha tambor. Alguém marcava um ritmo mais adiante, e a próxima pista não precisava ser vista: precisava ser escutada.',
    ],
    keepsake: 'Toda obra pode ser uma janela acesa',
    sources: [
      {
        label: 'ND Mais · Trajetória de Luiz Henrique Schwanke',
        url: 'https://ndmais.com.br/cidadania/quem-e-a-maior-celebridade-de-joinville-veja-fotos-e-vote/',
      },
      {
        label: 'Prefeitura de Joinville · Museus e espaços de memória',
        url: 'https://www.joinville.sc.gov.br/publicacoes/guia-de-museus-e-espacos-de-memoria-de-joinville/',
      },
    ],
  },
  {
    id: 'a-batida-das-ruas',
    number: 6,
    title: 'A batida que encontrou seu caminho',
    place: 'Joinville · o som de uma geração',
    character: 'A música de Eduarda Henklein',
    icon: '🥁',
    at: 240000,
    art: '/historia-eduarda.jpg',
    artAlt: 'Fritz se junta a jovens artistas e músicos durante uma celebração de música e flores.',
    fact: 'Eduarda Henklein é uma baterista joinvilense que chamou atenção ainda criança. A banda de potes é inventada por Fritz; não descreve uma apresentação, fala ou encontro real com a artista.',
    paragraphs: [
      'Tum-tum, pá! Fritz lembrou da música de Eduarda Henklein, baterista de Joinville que chamou atenção ainda criança. Que vontade de experimentar! Na brincadeira do diário, ele montou uma bateria de potes vazios. O primeiro “show” começou com um pote caindo dentro do outro. Ploc!',
      'Fritz tentou de novo, bem devagar: duas batidas e uma pausa. Os amigos da página acompanharam com palmas e campainhas de bicicleta. Quando todos tocaram ao mesmo tempo, virou uma barulheira! Combinaram escutar primeiro e responder depois. Agora dava até para dançar.',
      'O sexto espaço ganhou um vermelho animado. No silêncio entre duas batidas, Fritz ouviu um passarinho. Ele pousou no desenho de uma colina, bem no alto do mapa. Faltavam duas lembranças! O jacaré guardou os potes e chamou os amigos para uma subida sem pressa ao Morro da Boa Vista.',
    ],
    keepsake: 'Seu próprio ritmo também pertence à cidade',
    sources: [
      {
        label: 'ND Mais · Eduarda Henklein, baterista de Joinville',
        url: 'https://ndmais.com.br/noticias/a-mais-jovem-baterista-do-brasil-e-de-joinville/',
      },
      {
        label: 'Visite Joinville · Cultura e experiências',
        url: 'https://www.visitejoinville.com.br/en/turismo-em-joinville-cultura',
      },
    ],
  },
  {
    id: 'onde-a-cidade-respira',
    number: 7,
    title: 'O mirante e o mapa de quem pertence',
    place: 'Morro da Boa Vista · Parque Zoobotânico',
    character: 'Fritz e os amigos',
    icon: '⛰️',
    at: 700000,
    art: '/historia-mirante.jpg',
    artAlt: 'Ao nascer do sol, Fritz avista do alto de Joinville as colinas verdes e a Baía da Babitonga.',
    fact: 'O Mirante fica no Morro da Boa Vista, em Joinville, com vista da cidade e da Baía da Babitonga. A caminhada narrada é ficção e não substitui orientações oficiais de visitação.',
    paragraphs: [
      '“Falta muito?”, perguntou Fritz. A pergunta voltou três curvas depois, só que mais baixinha. O grupo fez uma pausa para beber água e continuou pelo caminho permitido. No alto do Morro da Boa Vista, a vista abriu como um livro gigante: telhados, mata, ruas e a Baía da Babitonga ao longe.',
      'Fritz procurou no diário os lugares por onde tinha passado. A carta, a flor modelada, as cores, a luz e o ritmo formavam um desenho só! Ainda havia um espaço vazio. Uma borboleta passou sem pousar, e o jacaré não tentou pegá-la. Algumas visitas ficam mais bonitas quando podem seguir livres.',
      'Ele desenhou uma folha no sétimo espaço e recolheu a embalagem do próprio lanche para levar de volta. O mapa finalmente mostrou o destino da última pista: a Festa das Flores! Mas faltava descobrir o que levar. Uma flor enorme? O jacaré abriu a mochila e encontrou uma ideia bem menor.',
    ],
    keepsake: 'Um lugar se torna lar quando é cuidado em conjunto',
    sources: [
      {
        label: 'Visite Joinville · Zoobotânico e Mirante',
        url: 'https://www.visitejoinville.com.br/en/turismoemjoinville/zoobotanico-e-mirante-de-joinville',
      },
      {
        label: 'Visite Joinville · O que fazer na cidade',
        url: 'https://www.visitejoinville.com.br/en/turismo-em-joinville-cultura',
      },
    ],
  },
  {
    id: 'todas-as-flores',
    number: 8,
    title: 'Nenhuma flor floresce sozinha',
    place: 'Festa das Flores · Joinville',
    character: 'Toda a cidade',
    icon: '🌷',
    at: 2000000,
    art: '/historia-encontro.jpg',
    artAlt: 'Fritz celebra com amigos de Joinville sob uma chuva de pétalas, flores e luzes de festa.',
    fact: 'A Festa das Flores faz parte da vida cultural de Joinville. A celebração mágica no diário é uma criação da aventura, não o relato de uma edição real da festa.',
    paragraphs: [
      'Na mochila estava a primeira pétala! Fritz não precisava levar a maior flor da festa. Precisava juntar o que aprendera. Inspirado na Festa das Flores de Joinville, desenhou uma celebração no diário: abriu espaço para receber amigos, enfeitou com sua flor tortinha e pendurou o jardim colorido.',
      'A lanterninha iluminou a página. Os potes fizeram tum-tum, pá, sem cobrir a voz de ninguém. As folhas desenhadas lembraram o cuidado com a mata. Quando Fritz colocou a pétala no último espaço, as oito lembranças se ligaram. A capa floresceu numa chuva de cores! Até o repolho de massinha ganhou uma fita.',
      '“Conseguimos!”, disse Fritz. No verso do mapa apareceram rodas, fios, conchas e muitas portas. Não eram tarefas obrigatórias nem pistas de uma corrida: eram convites para outras histórias de Joinville. O jacaré guardou um lápis de cada cor. Qual caminho você e ele vão descobrir agora?',
    ],
    keepsake: 'O futuro que a gente cultiva junto',
    sources: [
      {
        label: 'Visite Joinville · Cultura, dança e Festa das Flores',
        url: 'https://www.visitejoinville.com.br/en/turismo-em-joinville-cultura',
      },
      {
        label: 'Prefeitura de Joinville · Guia de museus e memória',
        url: 'https://www.joinville.sc.gov.br/publicacoes/guia-de-museus-e-espacos-de-memoria-de-joinville/',
      },
    ],
  },
];

export const STORY_CHAPTERS = STORY_CHAPTER_METADATA.map((chapter, index) => (
  applyRecreatedChapter(chapter, 'flores', index)
));
