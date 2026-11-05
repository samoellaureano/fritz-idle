import test from 'node:test';
import assert from 'node:assert/strict';
import { cloudEnabled, cloudFixture } from './helpers/cloud.mjs';

test('cloud ranking orders wheels before seeds, memories and lifetime without identity leaks', { skip: !cloudEnabled }, async () => {
  const fixture = await cloudFixture();
  try {
    const actors = [];
    for (let i = 0; i < 4; i++) {
      const user = await fixture.user();
      const profile = await fixture.profile(user, `Rank${i}_${fixture.suffix}`);
      actors.push({ ...user, profile });
    }
    await fixture.seed(actors[0], { seeds: 2, memories: [], lifetime: 1000000 });
    await fixture.seed(actors[1], { seeds: 1, memories: ['a-primeira-petala', 'a-carta-de-francisca'], lifetime: 9000000 });
    await fixture.seed(actors[2], { seeds: 2, memories: ['a-primeira-petala'], lifetime: 250000 });
    await fixture.seed(actors[3], { seeds: 2, memories: ['a-primeira-petala'], lifetime: 500000 });
    assert.equal((await fixture.api(null, '/api/community')).status, 401);
    const result = await fixture.api(actors[0], '/api/community');
    assert.equal(result.status, 200, result.data.error);
    const ownIds = actors.map((a) => a.profile.id);
    const ranked = result.data.ranking.filter((r) => ownIds.includes(r.profile_id));
    assert.deepEqual(ranked.map((r) => r.profile_id), [actors[3], actors[2], actors[0], actors[1]].map((a) => a.profile.id));
    assert.equal(result.data.me.profile_id, actors[0].profile.id);
    for (const row of result.data.ranking) {
      assert.deepEqual(Object.keys(row).sort(), ['profile_id', 'nickname', 'avatar_id', 'seeds', 'memories', 'lifetime', 'rank', 'wheels', 'rebirths'].sort());
    }
    assert.ok(!JSON.stringify(result.data).includes(actors[0].id));
    assert.equal((await fixture.api(actors[0], '/api/profile', 'POST', { nickname: 'Cheat', avatarId: 'fritz', seeds: 999 })).status, 400);
    await fixture.seed(actors[1], { seeds: 3, memories: [], lifetime: 100 });
    const refreshed = await fixture.api(actors[1], '/api/community');
    assert.equal(refreshed.data.ranking.filter((r) => ownIds.includes(r.profile_id))[0].profile_id, actors[1].profile.id);
    await fixture.seed(actors[0], { seeds: 0, wheels: 40, rebirths: 1 });
    const reborn = await fixture.api(actors[0], '/api/community');
    const first = reborn.data.ranking.filter((r) => ownIds.includes(r.profile_id))[0];
    assert.equal(first.profile_id, actors[0].profile.id);
    assert.equal(Number(first.wheels), 40);
    assert.equal(Number(first.rebirths), 1);
  } finally {
    await fixture.cleanup();
  }
});
