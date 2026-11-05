import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JOURNEYS, CITY_CHAPTERS } from '../lib/journeys.js';
import { LANDMARK_JOURNEYS } from '../lib/landmark-journeys.js';
import { STORY_CHAPTERS } from '../lib/story.js';
import { newPlayer, runGameAction } from '../lib/game.js';
import { executeSavedAction } from '../lib/save-store.js';

const NOW = 1_800_000_000_000;
const run = (player, action = 'game', input = {}) => runGameAction(player, action, input, NOW);
const landmarks = CITY_CHAPTERS.filter((chapter) => JOURNEYS.find((journey) => journey.id === chapter.journey)?.category === 'lugares');

test('all fourteen requested places have their own three-step illustrated narrative', () => {
  assert.deepEqual(LANDMARK_JOURNEYS.map((journey) => journey.id), [
    'palmeiras-imigracao', 'catedral', 'mercado-publico', 'monumento-barca', 'sambaqui',
    'escola-bolshoi', 'o-farol', 'empadas-jerke', 'instituto-juarez', 'museu-arte',
    'cemiterio-imigrantes', 'harmonia-lyra', 'deutsche-schule', 'opa-jerke',
  ]);
  assert.equal(JOURNEYS.length, 17);
  assert.equal(landmarks.length, 42);
  const allChapters = [...STORY_CHAPTERS, ...CITY_CHAPTERS];
  assert.equal(allChapters.length, 58);
  assert.equal(new Set(allChapters.map((chapter) => chapter.id)).size, 58);
  assert.equal(new Set(JOURNEYS.map((journey) => journey.id)).size, 17);
  assert.equal(new Set(LANDMARK_JOURNEYS.map((journey) => journey.art)).size, 14);
  assert.equal(new Set(landmarks.flatMap((chapter) => chapter.paragraphs)).size, 84);
  for (const journey of LANDMARK_JOURNEYS) {
    const chapters = landmarks.filter((chapter) => chapter.journey === journey.id);
    assert.deepEqual(chapters.map((chapter) => chapter.number), [1, 2, 3]);
    assert.equal(chapters[0].previousId, null);
    assert.equal(chapters[1].previousId, chapters[0].id);
    assert.equal(chapters[2].previousId, chapters[1].id);
    assert.ok(chapters[0].at < chapters[1].at && chapters[1].at < chapters[2].at);
    assert.ok(readFileSync(new URL(`../public${journey.art}`, import.meta.url), 'utf8').includes('viewBox="0 0 960 540"'));
    for (const chapter of chapters) {
      assert.ok(chapter.title && chapter.keepsake && chapter.artAlt && chapter.fact);
      assert.equal(chapter.paragraphs.length, 2);
      assert.equal(new URL(chapter.sources[0].url).hostname, 'www.visitejoinville.com.br');
      assert.equal(chapter.sources[0].url, journey.source);
    }
  }
});

test('each landmark trail enforces reading order on the server even with abundant petals', () => {
  for (const journey of LANDMARK_JOURNEYS) {
    const chapters = landmarks.filter((chapter) => chapter.journey === journey.id);
    let player = { ...newPlayer(NOW), lifetime: 1e9 };
    const original = structuredClone(player);
    for (const chapter of chapters.slice(1)) {
      assert.equal(run(player).state.storyChapters.find((item) => item.id === chapter.id).unlocked, false);
      assert.match(run(player, 'story', { chapterId: chapter.id }).error, /não foi descoberto/);
    }
    assert.deepEqual(player, original);
    for (const [index, chapter] of chapters.entries()) {
      assert.equal(run(player).state.storyChapters.find((item) => item.id === chapter.id).unlocked, true);
      const saved = run(player, 'story', { chapterId: chapter.id });
      assert.equal(saved.player.coins - player.coins, saved.state.memoryReward);
      assert.equal(saved.player.cycle_stories, index + 1);
      assert.equal(saved.state.storyProductionBonus, .02 * (index + 1));
      player = saved.player;
      assert.match(run(player, 'story', { chapterId: chapter.id }).error, /já está/);
    }
    assert.equal(run(player).state.storyChapters.filter((item) => item.journey === journey.id && item.completed).length, 3);
  }
});

test('the previous memory alone never bypasses the lifetime petal threshold', () => {
  for (const chapter of landmarks) {
    if (!chapter.at) continue;
    const player = { ...newPlayer(NOW), lifetime: chapter.at - 1,
      memories: chapter.previousId ? [chapter.previousId] : [] };
    assert.equal(run(player).state.storyChapters.find((item) => item.id === chapter.id).unlocked, false);
    assert.match(run(player, 'story', { chapterId: chapter.id }).error, /não foi descoberto/);
    assert.equal(run({ ...player, lifetime: chapter.at }).state.storyChapters.find((item) => item.id === chapter.id).unlocked, true);
  }
});

test('existing memories are preserved and new trail progress survives an era change without repeated XP', () => {
  const oldMemories = [...STORY_CHAPTERS, ...CITY_CHAPTERS.slice(0, 8)].map((chapter) => chapter.id);
  const legacy = { ...newPlayer(NOW), lifetime: 1e13, cycle_petals: 1e13, memories: oldMemories };
  const migrated = run(legacy);
  assert.deepEqual(migrated.player.memories, oldMemories);
  assert.equal(migrated.player.cycle_stories, 0);
  assert.equal(migrated.state.storyMemoryCount, 16);
  const player = { ...migrated.player, memories: [...oldMemories, ...landmarks.map((chapter) => chapter.id)] };
  const reset = run(player, 'rebirth', { expectedCycle: 0 });
  assert.ok(!reset.error);
  assert.deepEqual(reset.player.memories, player.memories);
  assert.equal(reset.state.storyMemoryCount, 58);
  assert.equal(reset.player.cycle_stories, 0);
  assert.equal(reset.state.storyProductionBonus, 58 * .02);
  for (const chapter of landmarks) {
    const state = reset.state.storyChapters.find((item) => item.id === chapter.id);
    assert.equal(state.unlocked, true);
    assert.equal(state.completed, true);
    assert.match(run(reset.player, 'story', { chapterId: chapter.id }).error, /já está/);
  }
});

test('concurrent claims of a new trail chapter grant exactly one memory and reward', async () => {
  const chapter = landmarks[0];
  let saved = { state: newPlayer(NOW), version: 0 };
  const store = {
    async read() { return structuredClone(saved); },
    async compareAndSet(id, version, state) {
      if (saved.version !== version) return false;
      saved = { state: structuredClone(state), version: version + 1 };
      return true;
    },
  };
  const results = await Promise.all(Array.from({ length: 6 }, () =>
    executeSavedAction(store, 'trail-test', 'story', { chapterId: chapter.id }, () => NOW)));
  assert.equal(results.filter((result) => !result.error).length, 1);
  assert.deepEqual(saved.state.memories, [chapter.id]);
  assert.equal(saved.state.cycle_stories, 1);
  assert.equal(saved.state.coins, 150);
});
