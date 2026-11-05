import test from 'node:test';
import assert from 'node:assert/strict';
import { newPlayer, runGameAction, GENERATORS, MANAGERS, SEED_GENERATOR_REQUIREMENT, SHARE_DURATION } from '../lib/game.js';
import { MUSEUM_ITEMS, rebirthPreview } from '../lib/progression.js';
import { CITY_CHAPTERS } from '../lib/journeys.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { executeSavedAction } from '../lib/save-store.js';
import { existsSync } from 'node:fs';

const NOW = 1_800_000_000_000;
const run = (player, action = 'game', input = {}, now = NOW) => runGameAction(player, action, input, now);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`);
const ready = () => ({
  ...newPlayer(NOW), seeds: 50, porticos: 50, coins: 1234, lifetime: 1e12,
  cycle_petals: 1e12, cycle_purchases: 50, total_clicks: 20, last_daily: NOW,
  memories: STORY_CHAPTERS.map((item) => item.id),
  generators: { 'fritz-jr': 3 }, upgrades: { 'mapa-da-cidade': 4 },
});

test('legacy wheels become portals exactly once and seeds/history remain intact', () => {
  const legacy = { ...ready(), wheels: 12.5, cycle_seeds: 50 };
  delete legacy.porticos;
  delete legacy.managers;
  delete legacy.cycle_stories;
  const before = structuredClone(legacy);
  const first = run(legacy);
  assert.deepEqual(legacy, before);
  assert.equal(first.player.porticos, 12.5);
  assert.equal(first.player.seeds, 50);
  assert.equal(first.player.cycle_stories, 8);
  assert.ok(!('wheels' in first.player));
  assert.ok(!('cycle_seeds' in first.player));
  assert.deepEqual(first.player.memories, legacy.memories);
  assert.deepEqual(run(first.player).player, first.player);
});

test('every museum insignia spends portals, never seeds, exactly once', () => {
  for (const item of MUSEUM_ITEMS) {
    const player = ready();
    const before = run(player).state;
    const result = run(player, 'museum', { itemId: item.id });
    assert.equal(result.player.porticos, 50 - item.cost);
    assert.equal(result.player.seeds, 50);
    close(result.state.multipliers.production, before.multipliers.production - item.cost * .1 + item.productionBonus);
    assert.equal(result.state.clickValue, before.clickValue + item.clickFlat);
    assert.ok(result.state.museum.find((piece) => piece.id === item.id).owned);
    assert.match(run(result.player, 'museum', { itemId: item.id }).error, /já está/);
    assert.match(run(newPlayer(NOW), 'museum', { itemId: item.id }).error, /Pórticos insuficientes/);
  }
  assert.ok(MUSEUM_ITEMS.some((item) => item.id === 'roda-da-memoria'));
  assert.match(run(ready(), 'museum', { itemId: 'made-up' }).error, /inválida/);
});

test('era level boundary and proportional fractional rewards are exact', () => {
  for (const level of [19, 20, 21, 30, 40, 60]) {
    const player = { ...newPlayer(NOW), cycle_petals: 1000 * (2 ** ((level - .75) / .6) - 1) };
    const preview = rebirthPreview(player);
    assert.equal(preview.level, level);
    assert.equal(preview.ready, level >= 20);
    assert.equal(preview.reward, level >= 20 ? level / 20 : 0);
    const result = run(player, 'rebirth', { expectedCycle: 0 });
    if (level < 20) assert.match(result.error, /nível 20/);
    else assert.equal(result.state.rebirthAward, level / 20);
  }
  const edge = 1000 * (2 ** (19 / .6) - 1);
  assert.equal(rebirthPreview({ ...newPlayer(NOW), cycle_petals: edge }).level, 20);
  assert.equal(rebirthPreview({ ...newPlayer(NOW), cycle_petals: edge - 1 }).level, 19);
});

test('support activities have bounded XP while petals and managers sustain later eras', () => {
  const player = { ...newPlayer(NOW), cycle_stories: 58, cycle_purchases: 1e6,
    cycle_clicks: 1e6, cycle_museum: 7, upgrades: { 'mapa-da-cidade': 5, 'passos-de-palmeira': 5 } };
  const before = rebirthPreview(player);
  assert.equal(before.experience, 7);
  assert.equal(before.ready, false);
  assert.deepEqual(Object.fromEntries(before.breakdown.map((part) => [part.id, part.points])),
    { petals: 0, stories: 3, places: 2, upgrades: 1, characters: 0, clicks: .5, museum: .5 });
  const after = rebirthPreview({ ...player, cycle_stories: 1000, cycle_purchases: 1e12,
    cycle_clicks: 1e12, cycle_museum: 1000, upgrades: { 'mapa-da-cidade': 1000 } });
  assert.equal(after.experience, before.experience);
  close(rebirthPreview({ ...player, managers: ['fritz', 'francisca'] }).experience - before.experience, 1.5);
  assert.ok(rebirthPreview({ ...player, cycle_petals: 1e12 }).experience > before.experience);
  assert.equal(MUSEUM_ITEMS.reduce((sum, item) => sum + item.cost, 0), 15);
});

test('rebalancing recalculates XP without rewriting existing currency, purchases or permanent rewards', () => {
  const player = { ...newPlayer(NOW), porticos: 3.75, seeds: 20, coins: 123,
    museum: MUSEUM_ITEMS.map((item) => item.id), memories: STORY_CHAPTERS.map((item) => item.id),
    cycle_petals: 100000, cycle_stories: 8, cycle_clicks: 500,
    generators: { 'fritz-jr': 3 }, managers: ['fritz', 'francisca'], seed_generator: true,
    achievements: ['first-click'], rebirths: 5 };
  const result = run(player);
  for (const key of ['porticos', 'seeds', 'coins', 'museum', 'memories', 'generators', 'managers', 'rebirths']) {
    assert.deepEqual(result.player[key], player[key]);
  }
  assert.ok(result.player.achievements.includes('first-click'));
  close(result.state.storyProductionBonus, 8 * .02);
  for (const item of MUSEUM_ITEMS) assert.ok(result.state.museum.find((piece) => piece.id === item.id).owned);
  assert.match(run(result.player, 'museum', { itemId: 'bicicleta' }).error, /já está/);
});

test('each era activity contributes XP without reusing historical story rewards', () => {
  const base = newPlayer(NOW);
  for (const changes of [
    { cycle_petals: 1000 }, { cycle_stories: 1 }, { cycle_purchases: 1 },
    { upgrades: { 'mapa-da-cidade': 1 } }, { managers: ['fritz'] }, { cycle_clicks: 1 }, { cycle_museum: 1 },
  ]) assert.ok(rebirthPreview({ ...base, ...changes }).experience > 0);
  const story = run(base, 'story', { chapterId: STORY_CHAPTERS[0].id });
  assert.equal(story.player.cycle_stories, 1);
  assert.match(run(story.player, 'story', { chapterId: STORY_CHAPTERS[0].id }).error, /já está/);
  const clicked = run(base, 'click');
  assert.equal(clicked.player.cycle_clicks, 1);
});

test('era resets the economy and managers but preserves achievements, friends, museum and cooldowns', () => {
  const player = { ...ready(), museum: ['bicicleta'], managers: ['fritz', 'francisca'], seed_generator: true,
    last_share: NOW, share_until: NOW + SHARE_DURATION };
  const original = structuredClone(player);
  const result = run(player, 'rebirth', { expectedCycle: 0 });
  assert.deepEqual(player, original);
  for (const key of ['coins', 'seeds', 'cycle_petals', 'cycle_purchases', 'cycle_stories', 'cycle_clicks', 'cycle_museum']) assert.equal(result.player[key], 0);
  for (const key of ['lifetime', 'memories', 'museum', 'last_daily', 'total_clicks', 'last_share', 'share_until']) assert.deepEqual(result.player[key], player[key]);
  assert.deepEqual(result.player.generators, {});
  assert.deepEqual(result.player.upgrades, {});
  assert.deepEqual(result.player.managers, []);
  assert.equal(result.player.seed_generator, false);
  assert.equal(result.player.rebirths, 1);
  assert.equal(result.player.porticos, player.porticos + result.state.rebirthAward);
  assert.equal(result.state.characters.filter((item) => item.unlocked).length, 6);
  assert.equal(result.state.rebirth.level, 1);
  assert.equal(result.state.rebirth.ready, false);
  assert.equal(result.state.dailyAvailable, false);
  assert.ok(result.state.achievements.find((item) => item.id === 'first-place').unlocked);
  assert.ok(result.state.achievements.find((item) => item.id === 'prestige').unlocked);
  assert.match(run(result.player, 'rebirth', { expectedCycle: 0 }).error, /mudou/);
  assert.match(run(result.player, 'rebirth', { expectedCycle: 1 }).error, /nível 20/);
});

test('seed generator requires 500 million earned in this era AND enough available petals', () => {
  const base = newPlayer(NOW);
  assert.match(run({ ...base, lifetime: 1e12, coins: 1e12 }, 'seed-generator').error, /500 milhões/);
  assert.match(run({ ...base, cycle_petals: SEED_GENERATOR_REQUIREMENT, coins: SEED_GENERATOR_REQUIREMENT - 1 }, 'seed-generator').error, /insuficientes/);
  const result = run({ ...base, cycle_petals: SEED_GENERATOR_REQUIREMENT, coins: SEED_GENERATOR_REQUIREMENT }, 'seed-generator');
  assert.equal(result.player.coins, 0);
  assert.deepEqual(result.player.managers, ['fritz']);
  close(result.state.seedsPerSecond, 1 / 60);
  assert.match(run(result.player, 'seed-generator').error, /já foi/);
  const ticked = run(result.player, 'game', {}, NOW + 60000);
  close(ticked.player.seeds, 1);
  assert.equal(ticked.player.coins, 0);
  assert.equal(ticked.state.cps, 0);
});

test('characters consume seeds, boost petals and automate collecting without inflating manual clicks', () => {
  const base = { ...ready(), seed_generator: true, managers: ['fritz'], seeds: 500 };
  assert.match(run(newPlayer(NOW), 'manager', { characterId: 'francisca' }).error, /gerador/);
  assert.match(run({ ...base, seeds: 0 }, 'manager', { characterId: 'francisca' }).error, /insuficientes/);
  for (const manager of MANAGERS.slice(1)) {
    const before = run(base).state;
    const bought = run(base, 'manager', { characterId: manager.id });
    assert.equal(bought.player.seeds, base.seeds - manager.seedCost);
    assert.ok(bought.state.cps > before.cps);
    close(bought.state.seedsPerSecond, before.seedsPerSecond + manager.seedsPerSecond);
    assert.match(run(bought.player, 'manager', { characterId: manager.id }).error, /já foi/);
    const ticked = run(bought.player, 'game', {}, NOW + 60000);
    close(ticked.player.seeds, bought.player.seeds + bought.state.seedsPerSecond * 60);
    assert.equal(ticked.player.total_clicks, base.total_clicks);
    assert.ok(ticked.player.cycle_petals > base.cycle_petals);
  }
});

test('max buys exactly all affordable places at per-unit rounded costs', () => {
  for (const generator of GENERATORS) {
    const costs = Array.from({ length: 5 }, (_, index) => Math.ceil(generator.baseCost * 1.15 ** index));
    const budget = costs.reduce((sum, n) => sum + n, 0);
    const result = run({ ...newPlayer(NOW), coins: budget }, 'buy', { generatorId: generator.id, quantity: 'max' });
    assert.equal(result.player.generators[generator.id], 5);
    assert.equal(result.player.coins, 0);
    assert.equal(result.player.cycle_purchases, 5);
    const below = run({ ...newPlayer(NOW), coins: budget - 1 }, 'buy', { generatorId: generator.id, quantity: 'max' });
    assert.equal(below.player.generators[generator.id], 4);
  }
  assert.match(run(ready(), 'buy', { generatorId: 'fritz-jr', quantity: 999 }).error, /Quantidade/);
});

test('new story trails enforce thresholds, permanent one-time rewards and unique illustrations', () => {
  for (const chapter of CITY_CHAPTERS) {
    const memories = chapter.previousId ? [chapter.previousId] : [];
    const base = { ...newPlayer(NOW), lifetime: chapter.at, memories };
    if (chapter.at > 0) assert.match(run({ ...base, lifetime: chapter.at - 1 }, 'story', { chapterId: chapter.id }).error, /não foi descoberto/);
    const result = run(base, 'story', { chapterId: chapter.id });
    assert.equal(result.state.storyMemoryCount, memories.length + 1);
    assert.equal(result.player.cycle_stories, 1);
    close(result.state.storyProductionBonus, .02 * (memories.length + 1));
    assert.match(run(result.player, 'story', { chapterId: chapter.id }).error, /já está/);
    assert.ok(existsSync(new URL(`../public${chapter.art}`, import.meta.url)));
  }
  assert.equal(new Set(CITY_CHAPTERS.map((chapter) => chapter.art)).size, 22);
});

test('share grants a daily timed buff and offline integration stops exactly at expiry', () => {
  const base = { ...newPlayer(NOW), lifetime: 500000, generators: { 'fritz-jr': 1 }, seed_generator: true, managers: ['fritz'] };
  const normal = run(base).state;
  const shared = run(base, 'share');
  close(shared.state.cps, normal.cps * 1.2);
  close(shared.state.clickValue, normal.clickValue * 1.2);
  close(shared.state.seedsPerSecond, normal.seedsPerSecond * 1.2);
  assert.match(run(shared.player, 'share').error, /24 horas/);
  const clicked = run(shared.player, 'click');
  close(clicked.player.coins, normal.clickValue * 1.2);
  const later = run(shared.player, 'game', {}, NOW + SHARE_DURATION + 60000);
  close(later.state.lastEarned, normal.cps * (SHARE_DURATION / 1000 * 1.2 + 60));
  close(later.player.seeds, normal.seedsPerSecond * (SHARE_DURATION / 1000 * 1.2 + 60));
  close(later.state.cps, normal.cps);
  assert.equal(run(shared.player, 'game', {}, NOW + 86400000 - 1).state.share.ready, false);
  assert.equal(run(shared.player, 'share', {}, NOW + 86400000).state.share.ready, false);
  const capped = run(shared.player, 'game', {}, NOW + 86400000);
  close(capped.state.lastEarned, normal.cps * 8 * 3600);
});

test('CAS serializes portal spending, era resets, generator purchases and sharing', async () => {
  for (const [action, input, initial] of [
    ['museum', { itemId: 'bicicleta' }, ready()],
    ['rebirth', { expectedCycle: 0 }, ready()],
    ['seed-generator', {}, { ...ready(), coins: SEED_GENERATOR_REQUIREMENT }],
    ['share', {}, ready()],
  ]) {
    let saved = { state: initial, version: 0 };
    const store = {
      async read() { return structuredClone(saved); },
      async compareAndSet(id, version, state) {
        if (saved.version !== version) return false;
        saved = { state: structuredClone(state), version: version + 1 };
        return true;
      },
    };
    const results = await Promise.all(Array.from({ length: 8 }, () => executeSavedAction(store, 'alice', action, input, () => NOW)));
    assert.equal(results.filter((result) => !result.error).length, 1, action);
    assert.equal(saved.version, 1);
  }
});
