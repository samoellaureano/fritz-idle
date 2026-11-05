import test from 'node:test';
import assert from 'node:assert/strict';
import { runGameAction, MAX_OFFLINE_SECONDS, SHARE_DURATION } from '../lib/game.js';
import { MUSEUM_ITEMS } from '../lib/progression.js';
import { simulateProgression, SIMULATION_START } from './helpers/progression-simulation.mjs';
import { createMemoryDatabase, LOCAL_TEST_USER } from '../lib/local-store.js';
import { executeSavedAction } from '../lib/save-store.js';

test('three full eras persist historical rewards and require rebuilding their own journey XP', async () => {
  let player;
  const durations = [];
  const totalPortals = [];
  for (let era = 0; era < 3; era++) {
    const result = simulateProgression({ ...(player ? { initialPlayer: player } : {}), stopAtEra: true });
    assert.ok(result.state.rebirth.ready, `Era ${era + 1} stalled`);
    assert.ok(result.player.seed_generator);
    assert.ok(result.player.managers.length >= 2);
    durations.push(result.elapsedSeconds);
    const before = result.player;
    const now = before.last_update;
    const reset = runGameAction(before, 'rebirth', { expectedCycle: era }, now);
    assert.ok(!reset.error);
    assert.equal(reset.state.rebirthAward, result.state.rebirth.level / 20);
    assert.equal(reset.player.porticos, before.porticos + reset.state.rebirthAward);
    assert.equal(reset.player.rebirths, era + 1);
    assert.equal(reset.state.rebirth.level, 1);
    assert.deepEqual(reset.player.memories, before.memories);
    assert.equal(reset.player.lifetime, before.lifetime);
    assert.equal(reset.player.cycle_stories, 0);
    assert.equal(reset.player.coins, 0);
    assert.equal(reset.player.seeds, 0);
    assert.deepEqual(reset.player.managers, []);
    assert.equal(reset.player.seed_generator, false);
    assert.match(runGameAction(reset.player, 'rebirth', { expectedCycle: era }, now).error, /mudou/);
    totalPortals.push(reset.player.porticos);
    player = reset.player;
    if (era === 0) {
      const piece = MUSEUM_ITEMS[0];
      const museum = runGameAction(player, 'museum', { itemId: piece.id }, now);
      assert.ok(!museum.error);
      assert.equal(museum.player.porticos, player.porticos - piece.cost);
      assert.equal(museum.state.museum.find((item) => item.id === piece.id).owned, true);
      player = museum.player;
    } else {
      assert.ok(player.museum.includes(MUSEUM_ITEMS[0].id));
    }
    const db = createMemoryDatabase(() => now);
    const saved = await db.saves.read(LOCAL_TEST_USER.id);
    assert.ok(await db.saves.compareAndSet(LOCAL_TEST_USER.id, saved.version, player));
    const restored = await executeSavedAction(db.saves, LOCAL_TEST_USER.id, 'game', {}, () => now);
    assert.equal(restored.rebirth.count, era + 1);
    assert.equal(restored.storyMemoryCount, player.memories.length);
  }
  console.log('CADENCE successive-eras', JSON.stringify({ durations, totalPortals }));
});

test('late-game offline return caps petals and seeds, expires share buff, and does not award manual clicks', () => {
  const result = simulateProgression();
  const now = result.player.last_update;
  const shared = runGameAction(result.player, 'share', {}, now);
  assert.ok(!shared.error);
  const baseline = runGameAction({ ...shared.player, share_until: 0 }, 'game', {}, now).state;
  const returned = runGameAction(shared.player, 'game', {}, now + 24 * 3600 * 1000);
  const cap = MAX_OFFLINE_SECONDS;
  const factor = cap;
  assert.ok(Math.abs(returned.state.lastEarned - baseline.cps * factor) / returned.state.lastEarned < 1e-10);
  assert.ok(Math.abs(returned.player.seeds - shared.player.seeds - baseline.seedsPerSecond * factor) < 1e-7);
  assert.equal(returned.state.lastElapsed, cap);
  assert.equal(returned.player.total_clicks, shared.player.total_clicks);
  assert.equal(returned.state.cps, baseline.cps);
  assert.equal(returned.state.share.ready, true);
  assert.equal(returned.state.rebirth.count, 0);
  assert.equal(returned.player.last_update, now + 24 * 3600 * 1000);
  assert.ok(returned.player.last_update > SIMULATION_START);
  const shortReturn = runGameAction(shared.player, 'game', {}, now + SHARE_DURATION + 60_000);
  const shortFactor = SHARE_DURATION / 1000 * 1.2 + 60;
  assert.ok(Math.abs(shortReturn.state.lastEarned - baseline.cps * shortFactor) / shortReturn.state.lastEarned < 1e-10);
});

test('the entire museum rewards eight to twelve developed eras without losing fractional portals', () => {
  let player;
  let totalSeconds = 0;
  let awarded = 0;
  let spent = 0;
  for (let era = 0; era < 12; era++) {
    const result = simulateProgression({ ...(player ? { initialPlayer: player } : {}) });
    assert.ok(result.state.rebirth.ready, `Era ${era + 1} stalled`);
    assert.equal(result.state.storyMemoryCount, 58);
    assert.ok(result.state.generators.every((item) => item.owned));
    assert.equal(result.player.managers.length, 6);
    totalSeconds += result.elapsedSeconds;
    const reset = runGameAction(result.player, 'rebirth', { expectedCycle: era }, result.player.last_update);
    assert.ok(!reset.error);
    awarded += reset.state.rebirthAward;
    player = reset.player;
    for (const piece of MUSEUM_ITEMS) {
      if (player.museum.includes(piece.id) || player.porticos < piece.cost) continue;
      const bought = runGameAction(player, 'museum', { itemId: piece.id }, player.last_update);
      assert.ok(!bought.error);
      player = bought.player;
      spent += piece.cost;
      assert.match(runGameAction(player, 'museum', { itemId: piece.id }, player.last_update).error, /já está/);
    }
    if (player.museum.length === MUSEUM_ITEMS.length) break;
  }
  assert.equal(player.museum.length, 7);
  assert.ok(player.rebirths >= 8 && player.rebirths <= 12);
  assert.equal(spent, 15);
  assert.equal(player.porticos, awarded - spent);
  console.log('CADENCE complete-museum', JSON.stringify({ eras: player.rebirths, totalSeconds, awarded, spent, remaining: player.porticos }));
});
