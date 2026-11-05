import test from 'node:test';
import assert from 'node:assert/strict';
import { newPlayer, runGameAction, UPGRADES, SHARE_DURATION } from '../lib/game.js';

const now = 1_800_000_000_000;
const run = (player, action = 'game', input = {}, at = now) => runGameAction(player, action, input, at);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);

test('new Fritz equipment applies advertised bonuses without mutating saves', () => {
  const player = { ...newPlayer(now), coins: 1e12, generators: { 'fritz-jr': 10 },
    seed_generator: true, managers: ['fritz', 'francisca'] };
  for (const upgrade of UPGRADES.slice(4)) {
    const snapshot = structuredClone(player);
    const before = run(player).state;
    const bought = run(player, 'upgrade', { upgradeId: upgrade.id });
    assert.ok(!bought.error);
    assert.deepEqual(player, snapshot);
    assert.equal(bought.player.coins, player.coins - upgrade.baseCost);
    assert.equal(bought.player.upgrades[upgrade.id], 1);
    if (upgrade.clickFlat) close(bought.state.clickValue, before.clickValue + upgrade.clickFlat);
    if (upgrade.clickBonus) close(bought.state.clickValue, before.clickValue * (1 + upgrade.clickBonus));
    if (upgrade.productionBonus) close(bought.state.cps - before.cps, 2 * upgrade.productionBonus);
    if (upgrade.offlineBonus) close(bought.state.multipliers.offlineHours, before.multipliers.offlineHours + .5);
    if (upgrade.seedBonus) close(bought.state.seedsPerSecond, before.seedsPerSecond * 1.1);
  }
});

test('seed bag needs active managers, stacks with sharing and respects offline credit and era reset', () => {
  const upgrades = { 'bolsa-de-sementes': 5, 'garrafa-de-cafe': 5 };
  assert.equal(run({ ...newPlayer(now), upgrades }).state.seedsPerSecond, 0);
  const player = { ...newPlayer(now), upgrades, seed_generator: true, managers: ['fritz'],
    cycle_petals: 1e13, lifetime: 1e13, share_until: now + SHARE_DURATION };
  close(run(player).state.seedsPerSecond, 1 / 60 * 1.5 * 1.2);
  const returned = run(player, 'game', {}, now + 24 * 3600000);
  assert.equal(returned.state.lastElapsed, 10.5 * 3600);
  close(returned.player.seeds, 10.5 * 60 * 1.5);
  const reset = run(player, 'rebirth', { expectedCycle: 0 });
  assert.ok(!reset.error);
  assert.deepEqual(reset.player.upgrades, {});
  assert.equal(reset.state.seedsPerSecond, 0);
  assert.equal(reset.state.multipliers.offlineHours, 8);
});
