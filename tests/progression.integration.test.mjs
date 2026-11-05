import test from 'node:test';
import assert from 'node:assert/strict';
import { cloudEnabled, cloudFixture } from './helpers/cloud.mjs';
import { STORY_CHAPTERS } from '../lib/story.js';
import { CITY_CHAPTERS } from '../lib/journeys.js';

test('cloud museum and rebirth validate input, isolate saves and serialize spending and rewards', { skip: !cloudEnabled }, async () => {
  const fixture = await cloudFixture();
  try {
    const actor = await fixture.user();
    const other = await fixture.user();
    await fixture.profile(actor, `Roda_${fixture.suffix}`);
    await fixture.profile(other, `Outra_${fixture.suffix}`);
    for (const [route, body] of [['museum', { itemId: 'bicicleta' }], ['rebirth', { expectedCycle: 0 }]]) {
      assert.equal((await fixture.api(null, `/api/${route}`, 'POST', body)).status, 401);
      assert.equal((await fixture.api(actor, `/api/${route}`, 'POST', body, { Origin: 'https://other.invalid' })).status, 403);
      assert.equal((await fixture.api(actor, `/api/${route}`, 'POST', { ...body, porticos: 999 })).status, 400);
    }
    for (const expectedCycle of [-1, 0.1, '0', null]) {
      assert.equal((await fixture.api(actor, '/api/rebirth', 'POST', { expectedCycle })).status, 400);
    }
    assert.equal((await fixture.api(actor, '/api/rebirth', 'POST', { expectedCycle: 0 })).status, 400);
    const memories = STORY_CHAPTERS.map((chapter) => chapter.id);
    await fixture.seed(actor, {
      seeds: 50, porticos: 1, cycle_petals: 1e12, lifetime: 1e12,
      cycle_purchases: 50, memories, last_daily: Date.now(),
    });

    const purchases = await Promise.all(Array.from({ length: 5 }, () => fixture.api(actor, '/api/museum', 'POST', { itemId: 'bicicleta' })));
    assert.equal(purchases.filter((result) => result.status === 200).length, 1);
    assert.ok(purchases.every((result) => [200, 400].includes(result.status)));
    const bought = await fixture.api(actor, '/api/game');
    assert.equal(bought.data.seeds, 50);
    assert.equal(bought.data.rebirth.points, 0);
    assert.equal(bought.data.rebirth.ready, true);
    const expectedReward = bought.data.rebirth.reward;
    const resets = await Promise.all(Array.from({ length: 5 }, () => fixture.api(actor, '/api/rebirth', 'POST', { expectedCycle: 0 })));
    assert.equal(resets.filter((result) => result.status === 200).length, 1);
    assert.ok(resets.every((result) => [200, 400].includes(result.status)));
    const restored = await fixture.api(actor, '/api/game');
    assert.equal(restored.data.rebirth.points, expectedReward);
    assert.equal(restored.data.rebirth.count, 1);
    assert.equal(restored.data.seeds, 0);
    assert.equal(restored.data.storyMemoryCount, 8);
    assert.equal(restored.data.characters.filter((character) => character.unlocked).length, 6);
    assert.ok(restored.data.museum.find((item) => item.id === 'bicicleta').owned);
    assert.equal(restored.data.dailyAvailable, false);
    assert.equal((await fixture.api(other, '/api/game')).data.rebirth.points, 0);
    assert.equal((await fixture.api(other, '/api/game')).data.seeds, 0);
    const posted = await fixture.api(actor, '/api/community/messages', 'POST', { text: 'Uma volta, não um adeus!' });
    assert.equal(posted.status, 201);
    const board = await fixture.api(other, '/api/community');
    const message = board.data.messages.find((entry) => entry.id === posted.data.message.id);
    assert.equal(Number(message.progress.porticos), expectedReward);
    assert.equal(Number(message.progress.rebirths), 1);
    const profile = await fixture.api(actor, '/api/profile');
    assert.equal(profile.data.progress.rebirth.points, expectedReward);
    assert.ok(profile.data.progress.achievements.some((item) => item.unlocked));
    const { data: saved, error } = await fixture.admin.from('game_saves').select('state').eq('user_id', actor.id).single();
    if (error) throw error;
    assert.equal(saved.state.cycle_stories, 0);
    assert.equal(saved.state.cycle_petals, 0);
    assert.deepEqual(saved.state.memories, memories);
  } finally {
    await fixture.cleanup();
  }
});

test('cloud seed generator, managers, max purchase, trail rewards and daily share buff', { skip: !cloudEnabled }, async () => {
  const fixture = await cloudFixture();
  try {
    const actor = await fixture.user();
    await fixture.profile(actor, `Trilha_${fixture.suffix}`);
    for (const route of ['seed-generator', 'manager', 'share']) {
      const input = route === 'manager' ? { characterId: 'francisca' } : undefined;
      assert.equal((await fixture.api(null, `/api/${route}`, 'POST', input)).status, 401);
      assert.equal((await fixture.api(actor, `/api/${route}`, 'POST', input, { Origin: 'https://other.invalid' })).status, 403);
    }
    await fixture.seed(actor, { coins: 600000000, lifetime: 1e12, cycle_petals: 1e12, seeds: 30 });
    assert.equal((await fixture.api(actor, '/api/manager', 'POST', { characterId: 'francisca', seeds: 999 })).status, 400);
    assert.equal((await fixture.api(actor, '/api/buy', 'POST', { generatorId: 'fritz-jr', quantity: 99 })).status, 400);
    const generator = await fixture.api(actor, '/api/seed-generator', 'POST');
    assert.equal(generator.status, 200);
    assert.ok(generator.data.seedGenerator.owned);
    assert.ok(generator.data.seedsPerSecond > 0);
    assert.equal((await fixture.api(actor, '/api/seed-generator', 'POST')).status, 400);
    const manager = await fixture.api(actor, '/api/manager', 'POST', { characterId: 'francisca' });
    assert.equal(manager.status, 200);
    assert.ok(manager.data.characters.find((item) => item.id === 'francisca').hired);
    assert.equal((await fixture.api(actor, '/api/manager', 'POST', { characterId: 'francisca' })).status, 400);
    const max = await fixture.api(actor, '/api/buy', 'POST', { generatorId: 'fritz-jr', quantity: 'max' });
    assert.equal(max.status, 200);
    assert.ok(max.data.generators.find((item) => item.id === 'fritz-jr').owned > 1);
    const chapterId = CITY_CHAPTERS[0].id;
    assert.equal((await fixture.api(actor, '/api/story', 'POST', { chapterId })).status, 200);
    assert.equal((await fixture.api(actor, '/api/story', 'POST', { chapterId })).status, 400);
    const shared = await fixture.api(actor, '/api/share', 'POST');
    assert.equal(shared.status, 200);
    assert.ok(shared.data.share.until > Date.now());
    assert.equal((await fixture.api(actor, '/api/share', 'POST')).status, 400);
    const reset = await fixture.api(actor, '/api/rebirth', 'POST', { expectedCycle: 0 });
    assert.equal(reset.status, 200);
    assert.equal(reset.data.share.until, shared.data.share.until);
    assert.equal(reset.data.seedGenerator.owned, false);
    assert.equal(reset.data.characters.filter((item) => item.hired).length, 0);
    assert.ok(reset.data.storyChapters.find((item) => item.id === chapterId).completed);
    assert.equal((await fixture.api(actor, '/api/share', 'POST')).status, 400);
  } finally {
    await fixture.cleanup();
  }
});
