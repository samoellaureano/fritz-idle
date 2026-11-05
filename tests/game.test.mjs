import test from 'node:test';
import assert from 'node:assert/strict';
import { newPlayer, runGameAction, GENERATORS, UPGRADES, MAX_OFFLINE_SECONDS } from '../lib/game.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { executeSavedAction, SaveConflictError } from '../lib/save-store.js';
import { sameOrigin, siteOrigin } from '../lib/supabase/config.js';

const NOW = 1_800_000_000_000;
const run = (player, action = 'game', input = {}, now = NOW) => runGameAction(player, action, input, now);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.000001, `${actual} != ${expected}`);

function memoryStore() {
  const saves = new Map();
  return {
    saves,
    async read(id) { return structuredClone(saves.get(id)); },
    async create(id, state) {
      if (!saves.has(id)) saves.set(id, { state: structuredClone(state), version: 0 });
    },
    async compareAndSet(id, version, state) {
      if (saves.get(id)?.version !== version) return false;
      saves.set(id, { state: structuredClone(state), version: version + 1 });
      return true;
    },
  };
}

test('new accounts start independently and actions do not mutate their input', () => {
  const player = newPlayer(NOW);
  const result = run(player, 'click');
  assert.equal(player.coins, 0);
  assert.equal(result.state.coins, 1);
  assert.equal(result.state.totalClicks, 1);
  assert.equal(result.state.characters.filter((item) => item.unlocked).length, 1);
  assert.equal(result.state.generators.length, 13);
  assert.equal(result.state.upgrades.length, 4);
});

test('all generator costs, production and lifetime spending rules remain stable', () => {
  for (const generator of GENERATORS) {
    const player = newPlayer(NOW);
    player.coins = generator.baseCost;
    const { state, player: saved } = run(player, 'buy', { generatorId: generator.id });
    assert.equal(state.coins, 0);
    assert.equal(state.lifetime, 0);
    assert.equal(saved.generators[generator.id], 1);
    close(state.cps, generator.cps);
    assert.equal(state.generators.find((item) => item.id === generator.id).cost, Math.ceil(generator.baseCost * 1.15));
  }
  assert.match(run(newPlayer(NOW), 'buy', { generatorId: GENERATORS[0].id }).error, /insuficientes/);
  assert.match(run(newPlayer(NOW), 'buy', { generatorId: 'invalid' }).error, /inválido/);
});

test('upgrades enforce costs, five levels and their original effects', () => {
  let player = newPlayer(NOW);
  player.coins = 1e9;
  for (const upgrade of UPGRADES) {
    for (let i = 0; i < 5; i++) {
      const before = player.coins;
      const result = run(player, 'upgrade', { upgradeId: upgrade.id });
      assert.equal(before - result.player.coins, Math.ceil(upgrade.baseCost * 2.8 ** i));
      player = result.player;
    }
    assert.match(run(player, 'upgrade', { upgradeId: upgrade.id }).error, /máximo/);
  }
  const state = run(player).state;
  assert.equal(state.clickValue, 21);
  assert.equal(state.multipliers.production, 2);
  assert.equal(state.multipliers.offlineHours, 13);
});

test('offline production is capped and never negative', () => {
  const player = newPlayer(NOW - 24 * 3600 * 1000);
  player.generators['fritz-jr'] = 1;
  let result = run(player);
  close(result.state.lastEarned, MAX_OFFLINE_SECONDS * 0.2);
  assert.equal(result.state.lastElapsed, MAX_OFFLINE_SECONDS);
  player.upgrades['brisa-da-babitonga'] = 5;
  result = run(player);
  close(result.state.lastEarned, 13 * 3600 * 0.2);
  const future = newPlayer(NOW + 10000);
  assert.equal(run(future).state.lastEarned, 0);
});

test('daily reward cannot be duplicated and becomes available after exactly 24h', () => {
  const first = run(newPlayer(NOW), 'daily');
  assert.equal(first.state.coins, 250);
  assert.match(run(first.player, 'daily').error, /já foi/);
  assert.match(run(first.player, 'daily', {}, NOW + 86400000 - 1).error, /já foi/);
  assert.equal(run(first.player, 'daily', {}, NOW + 86400000).state.coins, 500);
});

test('all chapters enforce unlocks, one-time rewards and permanent memory bonuses', () => {
  for (const chapter of STORY_CHAPTERS) {
    const player = newPlayer(NOW);
    player.lifetime = chapter.at;
    if (chapter.at > 0) {
      const locked = { ...player, lifetime: chapter.at - 1 };
      assert.match(run(locked, 'story', { chapterId: chapter.id }).error, /não foi descoberto/);
    }
    const first = run(player, 'story', { chapterId: chapter.id });
    assert.equal(first.state.memoryReward, 150);
    assert.equal(first.state.storyMemoryCount, 1);
    close(first.state.storyProductionBonus, .02);
    assert.match(run(first.player, 'story', { chapterId: chapter.id }).error, /já está/);
  }
  assert.match(run(newPlayer(NOW), 'story', { chapterId: 'bad' }).error, /inválido/);
});

test('prestige resets purchases but retains memories, lifetime, daily and clicks', () => {
  const player = newPlayer(NOW);
  Object.assign(player, {
    coins: 500000, lifetime: 2000000, seeds: 2, total_clicks: 50, last_daily: NOW,
    generators: { 'fritz-jr': 4 }, upgrades: { 'mapa-da-cidade': 3 },
    memories: STORY_CHAPTERS.map((item) => item.id),
  });
  const { player: saved, state } = run(player, 'prestige');
  assert.equal(state.prestigeAward, 2);
  assert.equal(saved.seeds, 4);
  assert.equal(saved.coins, 0);
  assert.deepEqual(saved.generators, {});
  assert.deepEqual(saved.upgrades, {});
  assert.equal(saved.lifetime, player.lifetime);
  assert.equal(saved.last_daily, NOW);
  assert.equal(saved.total_clicks, 50);
  assert.deepEqual(saved.memories, player.memories);
  assert.equal(state.characters.filter((item) => item.unlocked).length, 6);
  close(state.multipliers.production, 1 + 4 * .25 + 5 * .05 + 8 * .02);
  assert.match(run(newPlayer(NOW), 'prestige').error, /250.000/);
});

test('concurrent clicks survive CAS conflicts and never cross accounts', async () => {
  const store = memoryStore();
  await Promise.all(Array.from({ length: 12 }, () => executeSavedAction(store, 'alice', 'click', {}, () => NOW)));
  await executeSavedAction(store, 'bob', 'click', {}, () => NOW);
  assert.equal(store.saves.get('alice').state.total_clicks, 12);
  assert.equal(store.saves.get('alice').state.coins, 12);
  assert.equal(store.saves.get('alice').version, 12);
  assert.equal(store.saves.get('bob').state.coins, 1);
});

test('concurrent daily/story/purchase claims cannot double-spend or double-award', async () => {
  for (const [action, input] of [
    ['daily', {}], ['story', { chapterId: STORY_CHAPTERS[0].id }],
    ['buy', { generatorId: GENERATORS[0].id }],
  ]) {
    const store = memoryStore();
    const player = newPlayer(NOW);
    if (action === 'buy') player.coins = 15;
    await store.create('alice', player);
    const results = await Promise.all(Array.from({ length: 6 }, () =>
      executeSavedAction(store, 'alice', action, input, () => NOW)));
    assert.equal(results.filter((item) => !item.error).length, 1, action);
    assert.equal(store.saves.get('alice').version, 1);
    assert.equal(store.saves.get('alice').state.coins, action === 'buy' ? 0 : action === 'daily' ? 250 : 150);
  }
});

test('storage failures surface explicitly; exhausted conflicts never report success', async () => {
  const store = memoryStore();
  store.compareAndSet = async () => false;
  await assert.rejects(executeSavedAction(store, 'alice', 'click', {}, () => NOW), SaveConflictError);
  store.read = async () => { throw new Error('database unavailable'); };
  await assert.rejects(executeSavedAction(store, 'bob', 'game'), /database unavailable/);
});

test('mutations require the configured origin, not caller-controlled hosts', () => {
  const previous = process.env.SITE_URL;
  process.env.SITE_URL = 'https://fritz.example';
  try {
    assert.equal(siteOrigin(), 'https://fritz.example');
    for (const origin of [null, 'https://attacker.example', 'https://fritz.example.evil']) {
      const headers = origin ? { origin } : {};
      assert.equal(sameOrigin(new Request('https://fritz.example/api/click', { headers })), false);
    }
    assert.equal(sameOrigin(new Request('https://fritz.example/api/click', { headers: { origin: 'https://fritz.example' } })), true);
    process.env.SITE_URL = 'http://public.example';
    assert.throws(siteOrigin, /HTTPS/);
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
});

test('Render uses its trusted external URL when SITE_URL is absent', () => {
  const previous = process.env.SITE_URL;
  const previousRender = process.env.RENDER_EXTERNAL_URL;
  delete process.env.SITE_URL;
  process.env.RENDER_EXTERNAL_URL = 'https://fritz-deployment.onrender.com';
  try {
    assert.equal(siteOrigin(), 'https://fritz-deployment.onrender.com');
    process.env.SITE_URL = 'https://jogo.example';
    assert.equal(siteOrigin(), 'https://jogo.example');
    delete process.env.SITE_URL;
    delete process.env.RENDER_EXTERNAL_URL;
    assert.throws(siteOrigin, /não configurada/);
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
    if (previousRender === undefined) delete process.env.RENDER_EXTERNAL_URL;
    else process.env.RENDER_EXTERNAL_URL = previousRender;
  }
});
