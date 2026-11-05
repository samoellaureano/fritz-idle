import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from './city-memory.js';
import { LANDMARK_JOURNEYS } from './landmark-journeys.js';
import { getRecreatedJourney } from './recreated-story-copy.js';

const JOURNEY_METADATA = [
  { id: 'flores', name: 'A jornada das flores', icon: '🌸', description: 'Siga oito pistas e devolva as cores ao diário de Fritz.', art: '/historia-palmeiras.jpg' },
  { id: 'bicicletas', name: 'Caminhos que aproximam', icon: '🚲', description: 'Entregue três flores de papel num passeio em que ninguém fica para trás.', art: '/jornada-bicicletas.webp' },
  { id: 'industria', name: 'Mãos que constroem', icon: '🏭', description: 'Monte um carrinho de flores com pistas dos ofícios de Joinville.', art: '/jornada-dohler.webp' },
  ...LANDMARK_JOURNEYS.map(({ id, name, icon, description, art }) => ({ id, name, icon, description, art, category: 'lugares' })),
];

export const JOURNEYS = JOURNEY_METADATA.map((journey) => {
  const copy = getRecreatedJourney(journey.id);
  return { ...journey, name: copy.name, description: copy.description };
});

export const CITY_CHAPTERS = [
  ...getRecreatedJourney('bicicletas').chapters.map((chapter, index) => ({
    ...chapter,
    id: `pedalada-${index + 1}`, journey: 'bicicletas', number: index + 1,
    place: BICYCLE_MEMORY.place, character: 'Fritz', icon: '🚲',
    at: [240000, 25000000, 75000000][index],
    art: ['/jornada-bicicletas.webp', '/jornada-bicicletas-bairros.webp', '/jornada-bicicletas-volta.webp'][index],
    artAlt: ['Fritz com sua bicicleta e uma cesta de flores numa rua de palmeiras ao amanhecer.', 'Fritz conduz uma bicicleta por uma ponte florida entre bairros.', 'Fritz chega de bicicleta a uma casa acolhedora ao entardecer.'][index],
    sources: BICYCLE_MEMORY.sources,
  })),
  ...getRecreatedJourney('industria').chapters.map((chapter, index) => {
    const company = INDUSTRIAL_MEMORIES[index];
    return {
      ...chapter,
      id: `oficio-${company.id}`, journey: 'industria', number: index + 1,
      place: `${company.name} · memória desde ${company.year}`,
      character: 'Fritz', icon: company.icon,
      at: [90000000, 320000000, 1100000000, 4000000000, 15000000000][index],
      art: `/jornada-${company.id}.webp`, artAlt: `Fritz em uma cena ilustrada de ${chapter.title.toLocaleLowerCase('pt-BR')}.`,
      sources: [company.source],
    };
  }),
  ...LANDMARK_JOURNEYS.flatMap((journey) => journey.chapters.map((chapter, index) => ({
    ...chapter,
    id: `${journey.id}-${index + 1}`, journey: journey.id, number: index + 1,
    previousId: index > 0 ? `${journey.id}-${index}` : null,
    place: journey.place, character: 'Fritz', icon: journey.icon,
    art: journey.art, artAlt: journey.artAlt, fact: journey.fact,
    sources: [
      { label: `Visite Joinville · ${journey.name}`, url: journey.source },
      ...(journey.additionalSources ?? []),
    ],
  }))),
];
