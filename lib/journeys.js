import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from './city-memory.js';

export const JOURNEYS = [
  { id: 'flores', name: 'A jornada das flores', icon: '🌸', description: 'Reencontre a cor, os jardins e os amigos de Joinville.' },
  { id: 'bicicletas', name: 'Caminhos que aproximam', icon: '🚲', description: 'Da primeira pedalada ao caminho de volta para casa.' },
  { id: 'industria', name: 'Mãos que constroem', icon: '🏭', description: 'Fios, ofícios e aprendizados atravessam gerações.' },
];

export const CITY_CHAPTERS = [
  ...BICYCLE_MEMORY.paragraphs.map((paragraph, index) => ({
    id: `pedalada-${index + 1}`, journey: 'bicicletas', number: index + 1,
    title: ['A campainha da manhã', 'O caminho guarda nomes', 'Ninguém fica para trás'][index],
    place: BICYCLE_MEMORY.place, character: 'Fritz', icon: '🚲',
    at: [240000, 25000000, 75000000][index],
    art: ['/jornada-bicicletas.svg', '/jornada-bicicletas-bairros.svg', '/jornada-bicicletas-volta.svg'][index],
    artAlt: ['Bicicleta com flores atravessando um caminho entre casas e árvores.', 'Bicicletas aproximam bairros por uma ponte florida.', 'Uma bicicleta chega a uma casa iluminada ao entardecer.'][index],
    paragraphs: [paragraph], keepsake: 'Cada volta aproxima alguém de casa.', sources: BICYCLE_MEMORY.sources,
  })),
  ...INDUSTRIAL_MEMORIES.map((company, index) => ({
    id: `oficio-${company.id}`, journey: 'industria', number: index + 1,
    title: company.title, place: `${company.name} · memória desde ${company.year}`,
    character: 'Fritz', icon: company.icon,
    at: [90000000, 320000000, 1100000000, 4000000000, 15000000000][index],
    art: `/jornada-${company.id}.svg`, artAlt: `Ilustração original de ${company.title.toLocaleLowerCase('pt-BR')}.`,
    paragraphs: [company.keepsake, company.fact,
      'Fritz guarda esse encontro no diário. Não coleciona fachadas: leva consigo o cuidado de quem aprende, constrói e divide o que sabe. O próximo passo da trilha começa nas mãos de outra pessoa.'],
    keepsake: company.keepsake, sources: [company.source],
  })),
];
