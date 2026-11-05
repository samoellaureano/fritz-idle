import { BICYCLE_MEMORY, INDUSTRIAL_MEMORIES } from './city-memory.js';

export const REBIRTH_SEEDS = 50;
export const WHEEL_PRODUCTION_BONUS = 0.1;

const company = (id) => INDUSTRIAL_MEMORIES.find((item) => item.id === id);

export const MUSEUM_ITEMS = [
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
  const earnedSeeds = player.cycle_seeds ?? player.seeds;
  const petals = player.cycle_petals ?? player.lifetime;
  const purchases = player.cycle_purchases ?? Object.values(player.generators).reduce((sum, owned) => sum + owned, 0);
  const breakdown = [
    { id: 'seeds', label: 'Sementes conquistadas neste ciclo', weight: 40, points: 40 * Math.sqrt(earnedSeeds / REBIRTH_SEEDS) },
    { id: 'petals', label: 'Pétalas recuperadas neste ciclo', weight: 25, points: 25 * Math.log2(1 + petals / 12_500_000) },
    { id: 'stories', label: 'Histórias preservadas', weight: 15, points: 15 * player.memories.length / 8 },
    { id: 'places', label: 'Ativações de geradores neste ciclo', weight: 10, points: 10 * Math.log2(1 + purchases / 50) },
    { id: 'museum', label: 'Peças do museu', weight: 10, points: 10 * (player.museum?.length ?? 0) / MUSEUM_ITEMS.length },
  ];
  return {
    points: player.wheels ?? 0, count: player.rebirths ?? 0,
    earnedSeeds, requiredSeeds: REBIRTH_SEEDS, ready: earnedSeeds >= REBIRTH_SEEDS,
    reward: Math.floor(breakdown.reduce((sum, part) => sum + part.points, 0)),
    productionBonus: (player.wheels ?? 0) * WHEEL_PRODUCTION_BONUS,
    breakdown,
  };
}
