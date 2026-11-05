import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from './city-memory.js';

export const ERA_LEVEL = 20;
export const PORTAL_PRODUCTION_BONUS = 0.1;

const company = (id) => INDUSTRIAL_MEMORIES.find((item) => item.id === id);

export const MUSEUM_ITEMS = [
  { id: 'roda-da-memoria', name: 'Roda da Memória', icon: '🎡', cost: 1, productionBonus: .25, clickFlat: 1,
    description: 'Uma roda em miniatura guarda os caminhos que trouxeram você até aqui.', source: BICYCLE_MEMORY.sources[0] },
  { id: 'bicicleta', name: 'Bicicleta das flores', icon: '🚲', cost: 2, productionBonus: .5, clickFlat: 1,
    description: 'Uma miniatura imaginária dos caminhos que aproximam bairros e pessoas.', source: BICYCLE_MEMORY.sources[0] },
  { id: 'dohler', name: 'Tear dos afetos', icon: '🧵', cost: 4, productionBonus: 1, clickFlat: 2,
    description: 'Um tear em miniatura: cada fio guarda o carinho de uma geração.', source: company('dohler').source },
  { id: 'wetzel', name: 'Engrenagem do ofício', icon: '⚙️', cost: 6, productionBonus: 1.5, clickFlat: 3,
    description: 'Uma peça inventada por Fritz para homenagear quem transforma matéria em futuro.', source: company('wetzel').source },
  { id: 'tupy', name: 'Caderno do aprendiz', icon: '📒', cost: 8, productionBonus: 2, clickFlat: 4,
    description: 'Fritz desenhou uma escola junto à fábrica: aprender também faz a cidade florescer.', source: company('tupy').source },
  { id: 'consul', name: 'Geladeira das lembranças', icon: '❄️', cost: 10, productionBonus: 2.5, clickFlat: 5,
    description: 'Uma miniatura com uma flor na porta e a promessa de alguém esperando em casa.', source: company('consul').source },
  { id: 'ciser', name: 'Parafuso dos encontros', icon: '🔩', cost: 12, productionBonus: 3, clickFlat: 6,
    description: 'Pequenino no tamanho, enorme no cuidado de manter as coisas unidas.', source: company('ciser').source },
];

export function rebirthPreview(player) {
  const breakdown = [
    { id: 'petals', label: 'Pétalas recuperadas na era', points: Math.log2(1 + (player.cycle_petals ?? 0) / 1000) },
    { id: 'stories', label: 'Novas histórias guardadas na era', points: (player.cycle_stories ?? 0) * .75 },
    { id: 'places', label: 'Lugares adquiridos na era', points: .5 * Math.log2(1 + (player.cycle_purchases ?? 0)) },
    { id: 'upgrades', label: 'Melhorias adquiridas', points: Object.values(player.upgrades).reduce((sum, n) => sum + n, 0) * .25 },
    { id: 'characters', label: 'Gestores contratados', points: (player.managers?.length ?? 0) * .5 },
    { id: 'clicks', label: 'Toques na era', points: .25 * Math.log2(1 + (player.cycle_clicks ?? 0)) },
    { id: 'museum', label: 'Insígnias adquiridas na era', points: (player.cycle_museum ?? 0) * .5 },
  ];
  const experience = breakdown.reduce((sum, part) => sum + part.points, 0);
  const level = 1 + Math.floor(experience);
  return {
    points: player.porticos ?? player.wheels ?? 0, count: player.rebirths ?? 0,
    level, experience, nextLevelProgress: experience - Math.floor(experience),
    requiredLevel: ERA_LEVEL, ready: level >= ERA_LEVEL,
    reward: level >= ERA_LEVEL ? level / ERA_LEVEL : 0,
    productionBonus: (player.porticos ?? player.wheels ?? 0) * PORTAL_PRODUCTION_BONUS,
    breakdown,
  };
}
