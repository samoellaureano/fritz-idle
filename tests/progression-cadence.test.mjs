import test from 'node:test';
import assert from 'node:assert/strict';
import { simulateProgression } from './helpers/progression-simulation.mjs';
import { newPlayer } from '../lib/game.js';
import { SIMULATION_START } from './helpers/progression-simulation.mjs';

test('reader progresses from zero through every story, place, seed production and manager without injected currency', () => {
  const result = simulateProgression();
  for (const milestone of ['first-place', 'first-upgrade', 'first-story', 'level-20', 'all-friends',
    '500m-earned', 'seed-generator', 'first-seed', 'all-managers', 'all-places', 'all-stories']) {
    assert.ok(Number.isFinite(result.milestones[milestone]), `Missing ${milestone}`);
  }
  assert.equal(result.state.storyMemoryCount, 58);
  assert.equal(result.state.characters.filter((item) => item.hired).length, 6);
  assert.ok(result.milestones['level-20'] >= result.milestones['manager:francisca']);
  assert.ok(result.milestones['level-20'] >= 40 * 60 && result.milestones['level-20'] <= 60 * 60);
  assert.ok(result.state.coins >= 0 && result.state.seeds >= 0 && result.state.cps > 0);
  assert.equal(result.player.total_clicks, result.player.cycle_clicks);
  assert.ok(result.player.total_clicks <= 1200);
  assert.ok(result.elapsedSeconds < 48 * 3600);
  console.log('CADENCE reader', JSON.stringify(result.milestones));
});

test('non-reader can still reach eras, all places and automation without story bonuses', () => {
  const result = simulateProgression({ readStories: false, maxHours: 24 });
  assert.equal(result.state.storyMemoryCount, 0);
  for (const milestone of ['level-20', 'seed-generator', 'all-managers', 'all-places']) {
    assert.ok(Number.isFinite(result.milestones[milestone]), `Missing ${milestone}`);
  }
  assert.ok(result.milestones['level-20'] >= result.milestones['manager:francisca']);
  assert.ok(result.state.cps > 0);
  console.log('CADENCE non-reader', JSON.stringify(result.milestones));
});

test('idle reader needs no manual clicks if they claim the daily gift and revisit their economy', () => {
  const result = simulateProgression({ clickSeconds: 0, readSeconds: 60, stepSeconds: 30 });
  assert.equal(result.player.total_clicks, 0);
  for (const milestone of ['first-place', 'level-20', 'all-stories', 'seed-generator', 'all-managers', 'all-places']) {
    assert.ok(Number.isFinite(result.milestones[milestone]), `Missing ${milestone}`);
  }
  assert.ok(result.milestones['level-20'] >= result.milestones['manager:francisca']);
  assert.ok(result.milestones['level-20'] <= 60 * 60);
  console.log('CADENCE idle-reader', JSON.stringify(result.milestones));
});

test('without a daily gift, initial clicks still bootstrap a complete economy from zero', () => {
  const initial = newPlayer(SIMULATION_START);
  const result = simulateProgression({ initialPlayer: initial, daily: false, share: false, stopAtEra: true });
  assert.ok(result.milestones['first-place'] >= 0);
  assert.ok(result.state.rebirth.ready);
  assert.equal(result.player.last_daily, 0);
  assert.equal(result.player.last_share, 0);
  assert.equal(initial.coins, 0);
  console.log('CADENCE no-daily-first-era', result.elapsedSeconds);
});

test('rapid reading with sharing still reaches the first era after hiring a second manager', () => {
  const result = simulateProgression({ readSeconds: 0, share: true, stopAtEra: true });
  assert.ok(result.state.rebirth.ready);
  assert.ok(result.player.seed_generator);
  assert.ok(result.player.managers.includes('francisca'));
  assert.ok(result.milestones['level-20'] >= result.milestones['manager:francisca']);
});

test('two 20-minute sessions daily complete the first journey within the requested one-to-two-day window', () => {
  const result = simulateProgression({ sessionSeconds: 20 * 60, sessionIntervalSeconds: 12 * 3600,
    readSeconds: 60, maxHours: 60 });
  assert.equal(result.state.storyMemoryCount, 58);
  assert.equal(result.state.characters.every((item) => item.hired), true);
  assert.equal(result.state.generators.every((item) => item.owned), true);
  assert.ok(result.milestones['level-20'] >= result.milestones['manager:francisca']);
  assert.ok(result.elapsedSeconds >= 24 * 3600, `Completed too early: ${result.elapsedSeconds}`);
  assert.ok(result.elapsedSeconds <= 48 * 3600, `Completed too late: ${result.elapsedSeconds}`);
  console.log('CADENCE two-sessions-per-day', JSON.stringify({
    wallSeconds: result.elapsedSeconds, activeSeconds: result.activeSeconds, milestones: result.milestones,
  }));
});
