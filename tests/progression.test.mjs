import test from 'node:test';
import assert from 'node:assert/strict';
import { newPlayer, runGameAction, GENERATORS } from '../lib/game.js';
import { MUSEUM_ITEMS, rebirthPreview, REBIRTH_SEEDS } from '../lib/progression.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { executeSavedAction } from '../lib/save-store.js';

const NOW = 1_800_000_000_000;
const run = (player, action = 'game', input = {}, now = NOW) => runGameAction(player, action, input, now);
const ready = () => ({
  ...newPlayer(NOW), seeds: 50, cycle_seeds: 50, coins: 1234, lifetime: 12_500_000,
  cycle_petals: 12_500_000, cycle_purchases: 50, total_clicks: 20, last_daily: NOW,
  memories: STORY_CHAPTERS.map((item) => item.id),
  generators: { 'fritz-jr': 3 }, upgrades: { 'mapa-da-cidade': 4 },
});

test('legacy saves migrate seeds, petals and active purchases without losing old progress', () => {
  const legacy = { ...newPlayer(NOW), seeds: 50, lifetime: 9000000, generators: { 'fritz-jr': 6 } };
  for (const key of ['museum', 'wheels', 'rebirths', 'cycle_seeds', 'cycle_petals', 'cycle_purchases']) delete legacy[key];
  const before = structuredClone(legacy);
  const result = run(legacy);
  assert.deepEqual(legacy, before);
  assert.equal(result.player.cycle_seeds, 50);
  assert.equal(result.player.cycle_petals, legacy.lifetime);
  assert.equal(result.player.cycle_purchases, 6);
  assert.equal(result.state.rebirth.ready, true);
  assert.equal(result.player.seeds, legacy.seeds);
  assert.deepEqual(result.player.generators, legacy.generators);
});

test('each museum item spends seeds once, preserves equivalent production and strengthens clicks', () => {
  for (const item of MUSEUM_ITEMS) {
    const player = ready();
    const before = run(player).state;
    const result = run(player, 'museum', { itemId: item.id });
    assert.equal(result.player.seeds, 50 - item.cost);
    assert.equal(result.player.cycle_seeds, 50);
    assert.equal(result.state.rebirth.ready, true);
    assert.equal(result.state.cps, before.cps);
    assert.equal(result.state.clickValue, before.clickValue + item.clickFlat);
    assert.ok(result.state.museum.find((piece) => piece.id === item.id).owned);
    assert.match(run(result.player, 'museum', { itemId: item.id }).error, /já está/);
    assert.match(run(newPlayer(NOW), 'museum', { itemId: item.id }).error, /insuficientes/);
  }
  assert.match(run(ready(), 'museum', { itemId: 'made-up' }).error, /inválida/);
});

test('weighted reward matches its formula exactly and respects the 50-earned-seed boundary', () => {
  const player = ready();
  player.museum = MUSEUM_ITEMS.map((item) => item.id);
  const preview = rebirthPreview(player);
  assert.deepEqual(preview.breakdown.map((part) => part.points), [40, 25, 15, 10, 10]);
  assert.equal(preview.reward, 100);
  player.cycle_seeds = REBIRTH_SEEDS - 1;
  assert.match(run(player, 'rebirth', { expectedCycle: 0 }).error, /50 sementes/);
  player.cycle_seeds++;
  assert.equal(run(player, 'rebirth', { expectedCycle: 0 }).state.rebirthAward, 100);
  for (const [field, delta] of [['cycle_seeds', 150], ['cycle_petals', 100000000], ['cycle_purchases', 200]]) {
    const boosted = rebirthPreview({ ...player, [field]: player[field] + delta });
    assert.ok(boosted.reward > preview.reward, field);
  }
  const seedGrowth = (seeds) => rebirthPreview({ ...player, cycle_seeds: seeds }).breakdown[0].points;
  assert.ok(seedGrowth(200) - seedGrowth(100) < 2 * (seedGrowth(100) - seedGrowth(50)));
  assert.equal(rebirthPreview({ ...player, cycle_seeds: 200 }).breakdown[0].points, 80);
});

test('rebirth resets only economy, preserves history, collection and daily cooldown, and cannot replay', () => {
  let player = ready();
  player = run(player, 'museum', { itemId: MUSEUM_ITEMS[0].id }).player;
  const original = structuredClone(player);
  const { player: saved, state } = run(player, 'rebirth', { expectedCycle: 0 });
  assert.deepEqual(player, original);
  for (const key of ['coins', 'seeds', 'cycle_seeds', 'cycle_petals', 'cycle_purchases']) assert.equal(saved[key], 0, key);
  for (const key of ['lifetime', 'memories', 'museum', 'last_daily', 'total_clicks']) assert.deepEqual(saved[key], player[key], key);
  assert.deepEqual(saved.generators, {});
  assert.deepEqual(saved.upgrades, {});
  assert.equal(saved.rebirths, 1);
  assert.equal(saved.wheels, state.rebirthAward);
  assert.equal(state.characters.filter((item) => item.unlocked).length, 6);
  assert.equal(state.storyMemoryCount, 8);
  assert.equal(state.rebirth.ready, false);
  assert.equal(state.dailyAvailable, false);
  assert.equal(state.rebirth.earnedSeeds, 0);
  assert.equal(state.multipliers.production, 1 + .25 + .16 + .5 + saved.wheels * .1);
  assert.equal(state.clickValue, 2);
  assert.match(run(saved, 'rebirth', { expectedCycle: 0 }).error, /mudou/);
  assert.match(run(saved, 'rebirth', { expectedCycle: 1 }).error, /50 sementes/);
  assert.match(run(saved, 'story', { chapterId: STORY_CHAPTERS[0].id }).error, /já está/);
  const bought = run({ ...saved, coins: 15 }, 'buy', { generatorId: 'fritz-jr' });
  assert.ok(bought.state.cps > .2);
  assert.equal(bought.player.cycle_purchases, 1);
  const ticked = run(bought.player, 'game', {}, NOW + 1000);
  assert.equal(ticked.player.cycle_petals, ticked.state.lastEarned);
  assert.equal(ticked.player.lifetime, saved.lifetime + ticked.state.lastEarned);
});

test('normal prestige retains museum/wheels and advances earned seeds without resetting cycle metrics', () => {
  const player = { ...ready(), coins: 500000, seeds: 0, museum: ['bicicleta'], wheels: 100, rebirths: 1 };
  const result = run(player, 'prestige');
  assert.equal(result.player.seeds, 2);
  assert.equal(result.player.cycle_seeds, 52);
  assert.equal(result.player.cycle_petals, player.cycle_petals);
  assert.equal(result.player.cycle_purchases, 50);
  assert.equal(result.player.wheels, 100);
  assert.deepEqual(result.player.museum, ['bicicleta']);
});

test('all six new generators produce petals online/offline and keep the original seven unchanged', () => {
  assert.equal(GENERATORS.length, 13);
  for (const generator of GENERATORS.slice(7)) {
    const player = { ...newPlayer(NOW), coins: generator.baseCost };
    const purchased = run(player, 'buy', { generatorId: generator.id });
    assert.equal(purchased.state.cps, generator.cps);
    const offline = run(purchased.player, 'game', {}, NOW + 1000);
    assert.equal(offline.state.lastEarned, generator.cps);
    assert.equal(offline.player.cycle_petals, generator.cps);
  }
});

test('CAS serializes museum spending and rebirth replays across devices', async () => {
  let saved = { state: ready(), version: 0 };
  const store = {
    async read() { return structuredClone(saved); },
    async compareAndSet(id, version, state) {
      if (saved.version !== version) return false;
      saved = { state: structuredClone(state), version: version + 1 };
      return true;
    },
  };
  for (const [action, input] of [['museum', { itemId: 'bicicleta' }], ['rebirth', { expectedCycle: 0 }]]) {
    const results = await Promise.all(Array.from({ length: 8 }, () => executeSavedAction(store, 'alice', action, input, () => NOW)));
    assert.equal(results.filter((result) => !result.error).length, 1, action);
  }
  assert.equal(saved.version, 2);
  assert.equal(saved.state.rebirths, 1);
  assert.deepEqual(saved.state.museum, ['bicicleta']);
});

test('competing museum purchases cannot overspend and all petal sources advance the cycle', async () => {
  let saved = { state: { ...newPlayer(NOW), seeds: 6, cycle_seeds: 6 }, version: 0 };
  const store = {
    async read() { return structuredClone(saved); },
    async compareAndSet(id, version, state) {
      if (saved.version !== version) return false;
      saved = { state: structuredClone(state), version: version + 1 };
      return true;
    },
  };
  const results = await Promise.all(['bicicleta', 'wetzel'].map((itemId) =>
    executeSavedAction(store, 'alice', 'museum', { itemId }, () => NOW)));
  assert.equal(results.filter((result) => !result.error).length, 1);
  assert.ok(saved.state.seeds >= 0);
  assert.equal(saved.state.cycle_seeds, 6);
  let player = newPlayer(NOW);
  for (const [action, input] of [['click', {}], ['daily', {}], ['story', { chapterId: STORY_CHAPTERS[0].id }]]) {
    player = run(player, action, input).player;
    assert.equal(player.cycle_petals, player.lifetime);
  }
});
