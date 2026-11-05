import { db } from './db';

export const CLICK_VALUE = 1;
export const MAX_OFFLINE_SECONDS = 60 * 60 * 8; // 8h de progresso offline

export const GENERATORS = [
  { id: 'fritz-jr', name: 'Fritz Júnior', baseCost: 15, cps: 0.2 },
  { id: 'fritz-worker', name: 'Fritz Operário', baseCost: 100, cps: 1 },
  { id: 'fritz-factory', name: 'Fábrica do Fritz', baseCost: 1100, cps: 8 },
  { id: 'fritz-lab', name: 'Laboratório do Fritz', baseCost: 12000, cps: 47 },
];

export const COST_GROWTH = 1.15;

export function generatorCost(gen, owned) {
  return Math.ceil(gen.baseCost * Math.pow(COST_GROWTH, owned));
}

function getOwnedMap() {
  const rows = db.prepare('SELECT id, owned FROM generators').all();
  return Object.fromEntries(rows.map((r) => [r.id, r.owned]));
}

export function coinsPerSecond(ownedMap) {
  return GENERATORS.reduce((sum, g) => sum + (ownedMap[g.id] ?? 0) * g.cps, 0);
}

// Aplica o progresso acumulado desde o último update
export function tick() {
  const now = Date.now();
  const player = db.prepare('SELECT * FROM player WHERE id = 1').get();
  const owned = getOwnedMap();
  const cps = coinsPerSecond(owned);

  const elapsed = Math.min(
    Math.max((now - player.last_update) / 1000, 0),
    MAX_OFFLINE_SECONDS
  );
  const earned = elapsed * cps;

  db.prepare('UPDATE player SET coins = coins + ?, last_update = ? WHERE id = 1').run(earned, now);
  return { earned, elapsed };
}

export function getState() {
  const { earned, elapsed } = tick();
  const player = db.prepare('SELECT * FROM player WHERE id = 1').get();
  const owned = getOwnedMap();

  return {
    coins: player.coins,
    totalClicks: player.total_clicks,
    cps: coinsPerSecond(owned),
    lastEarned: earned,
    lastElapsed: elapsed,
    generators: GENERATORS.map((g) => ({
      id: g.id,
      name: g.name,
      cps: g.cps,
      owned: owned[g.id] ?? 0,
      cost: generatorCost(g, owned[g.id] ?? 0),
    })),
  };
}

export function click() {
  tick();
  db.prepare(
    'UPDATE player SET coins = coins + ?, total_clicks = total_clicks + 1 WHERE id = 1'
  ).run(CLICK_VALUE);
  return getState();
}

export function buy(generatorId) {
  const gen = GENERATORS.find((g) => g.id === generatorId);
  if (!gen) return { error: 'Gerador inválido' };

  const run = db.transaction(() => {
    tick();
    const player = db.prepare('SELECT coins FROM player WHERE id = 1').get();
    const owned = getOwnedMap()[gen.id] ?? 0;
    const cost = generatorCost(gen, owned);

    if (player.coins < cost) return { error: 'Moedas insuficientes' };

    db.prepare('UPDATE player SET coins = coins - ? WHERE id = 1').run(cost);
    db.prepare(
      `INSERT INTO generators (id, owned) VALUES (?, 1)
       ON CONFLICT(id) DO UPDATE SET owned = owned + 1`
    ).run(gen.id);
    return {};
  });

  const result = run();
  if (result.error) return result;
  return getState();
}
