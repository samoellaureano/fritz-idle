import { newPlayer, runGameAction } from '../../lib/game.js';

export const SIMULATION_START = 1_800_000_000_000;

export function simulateProgression({
  initialPlayer = newPlayer(SIMULATION_START), readSeconds = 45,
  readStories = true, clickSeconds = 600, clicksPerSecond = 2,
  share = false, daily = true, stepSeconds = 10, maxHours = 48,
  stopAtEra = false, sessionSeconds = null, sessionIntervalSeconds = 12 * 3600,
} = {}) {
  let player = structuredClone(initialPlayer);
  const start = player.last_update;
  let now = start;
  let state;
  let reading = null;
  let readingUntil = 0;
  let actions = 0;
  let activeSeconds = 0;
  const milestones = {};
  const events = [];
  const economicActions = [];

  function record(id) {
    if (milestones[id] !== undefined) return;
    const seconds = (now - start) / 1000;
    milestones[id] = seconds;
    events.push({ id, seconds, level: state.rebirth.level, lifetime: state.lifetime, coins: state.coins, cps: state.cps });
  }

  function act(action, input = {}) {
    const previousLifetime = player.lifetime;
    const result = runGameAction(player, action, input, now);
    if (result.error) throw new Error(`${action}: ${result.error}`);
    player = result.player;
    state = result.state;
    for (const [key, value] of Object.entries({
      coins: state.coins, seeds: state.seeds, lifetime: state.lifetime, cps: state.cps,
      clickValue: state.clickValue, portals: state.rebirth.points, level: state.rebirth.level,
    })) {
      if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid ${key} after ${action}: ${value}`);
    }
    if (player.lifetime < previousLifetime) throw new Error(`Historical petals decreased after ${action}`);
    actions++;
    for (const [id, ready] of [
      ['first-place', state.generators.some((item) => item.owned)],
      ['three-places', state.generators.filter((item) => item.owned).length >= 3],
      ['first-upgrade', state.upgrades.some((item) => item.owned)],
      ['first-story', state.storyMemoryCount > 0],
      ['level-20', state.rebirth.ready], ['level-30', state.rebirth.level >= 30],
      ['all-friends', state.characters.every((item) => item.unlocked)],
      ['500m-earned', state.seedGenerator.ready],
      ['seed-generator', state.seedGenerator.owned],
      ['first-seed', state.seeds > 0],
      ['all-managers', state.characters.every((item) => item.hired)],
      ['all-places', state.generators.every((item) => item.owned)],
      ['all-stories', state.storyChapters.every((item) => item.completed)],
    ]) if (ready) record(id);
    for (const item of state.generators) if (item.owned) record(`place:${item.id}`);
    for (const item of state.characters) if (item.hired) record(`manager:${item.id}`);
  }

  function buyForProduction() {
    for (let count = 0; count < 100; count++) {
      const candidates = state.generators.map((item) => ({
        action: 'buy', input: { generatorId: item.id }, cost: item.cost,
        gain: item.cps * (1 + state.multipliers.production),
      }));
      for (const item of state.upgrades.filter((entry) => entry.owned < entry.maxOwned && !entry.offlineBonus)) {
        const probe = runGameAction({ ...player, coins: Math.max(player.coins, item.cost) }, 'upgrade', { upgradeId: item.id }, now);
        const activeClickRate = activeSeconds < clickSeconds ? clicksPerSecond : 0;
        const gain = probe.state.cps - state.cps + (probe.state.clickValue - state.clickValue) * activeClickRate;
        if (gain > 0) candidates.push({ action: 'upgrade', input: { upgradeId: item.id }, cost: item.cost, gain });
      }
      candidates.sort((a, b) => a.cost / a.gain - b.cost / b.gain);
      const best = candidates[0];
      if (state.coins < best.cost) break;
      act(best.action, best.input);
      economicActions.push((now - start) / 1000);
    }
  }

  act('game');
  for (let elapsed = 0; elapsed <= maxHours * 3600; elapsed += stepSeconds) {
    if (sessionSeconds && elapsed % sessionIntervalSeconds >= sessionSeconds) {
      elapsed = (Math.floor(elapsed / sessionIntervalSeconds) + 1) * sessionIntervalSeconds;
      if (elapsed > maxHours * 3600) break;
    }
    now = start + elapsed * 1000;
    act('game');
    if (stopAtEra && state.rebirth.ready) break;
    if (daily && state.dailyAvailable) act('daily');
    if (share && state.share.ready) act('share');
    if (reading && activeSeconds >= readingUntil) {
      const chapterId = reading;
      reading = null;
      act('story', { chapterId });
      record(`story:${chapterId}`);
    }
    if (!reading) {
      if (activeSeconds < clickSeconds) {
        for (let count = 0; count < clicksPerSecond * stepSeconds; count++) act('click');
      }
      if (state.seedGenerator.ready && !state.seedGenerator.owned) {
        if (state.coins >= state.seedGenerator.cost) act('seed-generator');
      } else {
        buyForProduction();
      }
      for (const manager of state.characters) {
        if (state.seedGenerator.owned && manager.unlocked && !manager.hired && state.seeds >= manager.seedCost) {
          act('manager', { characterId: manager.id });
        }
      }
      if (readStories) {
        const next = state.storyChapters.filter((item) => item.unlocked && !item.completed)
          .sort((a, b) => a.at - b.at || a.number - b.number || a.id.localeCompare(b.id))[0];
        if (next) {
          reading = next.id;
          readingUntil = activeSeconds + readSeconds;
        }
      }
    }
    if (stopAtEra && state.rebirth.ready) break;
    if (state.storyChapters.every((item) => item.completed) && state.characters.every((item) => item.hired)
      && state.generators.every((item) => item.owned)) break;
    activeSeconds += stepSeconds;
  }
  return { player, state, milestones, events, economicActions, actions, activeSeconds, elapsedSeconds: (now - start) / 1000 };
}
