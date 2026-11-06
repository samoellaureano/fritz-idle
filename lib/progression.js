import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from './city-memory.js';

export const ERA_LEVEL = 20;
export const PORTAL_PRODUCTION_BONUS = 0.1;

const company = (id) => INDUSTRIAL_MEMORIES.find((item) => item.id === id);

export const MUSEUM_ITEMS = [
  { id: 'roda-da-memoria', name: 'Roda da Memória', icon: '🎡', cost: 1, productionBonus: .25, clickFlat: 1,
    description: 'Uma roda em miniatura guarda os caminhos que trouxeram você até aqui.', source: BICYCLE_MEMORY.sources[0] },
  { id: 'bicicleta', name: 'Bicicleta das flores', icon: '🚲', cost: 1, productionBonus: .5, clickFlat: 1,
    description: 'Uma miniatura imaginária dos caminhos que aproximam bairros e pessoas.', source: BICYCLE_MEMORY.sources[0] },
  { id: 'dohler', name: 'Tear dos afetos', icon: '🧵', cost: 1.5, productionBonus: 1, clickFlat: 2,
    description: 'Um tear em miniatura: cada fio guarda o carinho de uma geração.', source: company('dohler').source },
  { id: 'wetzel', name: 'Engrenagem do ofício', icon: '⚙️', cost: 2, productionBonus: 1.5, clickFlat: 3,
    description: 'Uma peça inventada por Fritz para homenagear quem transforma matéria em futuro.', source: company('wetzel').source },
  { id: 'tupy', name: 'Caderno do aprendiz', icon: '📒', cost: 2.5, productionBonus: 2, clickFlat: 4,
    description: 'Fritz desenhou uma escola junto à fábrica: aprender também faz a cidade florescer.', source: company('tupy').source },
  { id: 'consul', name: 'Geladeira das lembranças', icon: '❄️', cost: 3, productionBonus: 2.5, clickFlat: 5,
    description: 'Uma miniatura com uma flor na porta e a promessa de alguém esperando em casa.', source: company('consul').source },
  { id: 'ciser', name: 'Parafuso dos encontros', icon: '🔩', cost: 4, productionBonus: 3, clickFlat: 6,
    description: 'Pequenino no tamanho, enorme no cuidado de manter as coisas unidas.', source: company('ciser').source },
];

export function rebirthPreview(player) {
  const breakdown = [
    { id: 'petals', label: 'Pétalas recuperadas na era', points: .6 * Math.log2(1 + (player.cycle_petals ?? 0) / 1000) },
    { id: 'stories', label: 'Novas histórias guardadas (até 3 XP)', points: Math.min(3, (player.cycle_stories ?? 0) * .1) },
    { id: 'places', label: 'Lugares adquiridos (até 2 XP)', points: Math.min(2, .25 * Math.log2(1 + (player.cycle_purchases ?? 0))) },
    { id: 'upgrades', label: 'Melhorias adquiridas (até 1 XP)', points: Math.min(1, Object.values(player.upgrades).reduce((sum, n) => sum + n, 0) * .1) },
    { id: 'characters', label: 'Personagens contratados', points: (player.managers?.length ?? 0) * .75 },
    { id: 'clicks', label: 'Toques na era (até 0,5 XP)', points: Math.min(.5, .05 * Math.log2(1 + (player.cycle_clicks ?? 0))) },
    { id: 'museum', label: 'Insígnias adquiridas (até 0,5 XP)', points: Math.min(.5, (player.cycle_museum ?? 0) * .25) },
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
