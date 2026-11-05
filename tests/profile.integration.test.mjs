import test from 'node:test';
import assert from 'node:assert/strict';
import { cloudEnabled, cloudFixture } from './helpers/cloud.mjs';

test('cloud profile onboarding, case-insensitive uniqueness, persistence and access boundaries', { skip: !cloudEnabled }, async () => {
  const fixture = await cloudFixture();
  try {
    const a = await fixture.user();
    const b = await fixture.user();
    assert.equal((await fixture.api(null, '/api/profile')).status, 401);
    assert.equal((await fixture.api(a, '/api/profile')).data.profile, null);
    assert.equal((await fixture.api(a, '/api/game')).status, 428);
    assert.equal((await fixture.api(a, '/api/click', 'POST')).status, 428);
    assert.equal((await fixture.api(a, '/api/community')).status, 428);
    const { data: before } = await fixture.admin.from('game_saves').select('user_id').eq('user_id', a.id);
    assert.equal(before.length, 0, 'onboarding must not change progress');
    const name = `Flor_${fixture.suffix}`;
    const profile = await fixture.profile(a, name, 'francisca');
    const duplicate = await fixture.api(b, '/api/profile', 'POST', { nickname: name.toUpperCase(), avatarId: 'fritz' });
    assert.equal(duplicate.status, 409);
    await fixture.profile(b, `Outra_${fixture.suffix}`);
    const saved = await fixture.api(a, '/api/profile');
    assert.equal(saved.data.profile.nickname, name);
    assert.equal(saved.data.profile.avatarId, 'francisca');
    assert.ok(!JSON.stringify(saved.data).includes(a.id), 'never publish auth user id');
    assert.equal((await fixture.api(a, '/api/click', 'POST')).status, 200);
    const updated = await fixture.profile(a, `Nova_${fixture.suffix}`, 'schwanke');
    assert.equal(updated.id, profile.id, 'editing preserves public profile identity');
    const game = await fixture.api(a, '/api/game');
    assert.equal(game.data.totalClicks, 1);
    assert.equal(game.data.profile.nickname, updated.nickname);
    assert.equal((await fixture.api(a, '/api/profile', 'POST', { nickname: 'Bad', avatarId: 'fritz', userId: b.id })).status, 400);
    assert.equal((await fixture.api(a, '/api/profile', 'POST', { nickname: 'Good', avatarId: 'fritz' }, { Origin: 'https://other.invalid' })).status, 403);
    for (const client of [fixture.anonymous, a.client]) {
      for (const table of ['player_profiles', 'community_ranking', 'community_messages']) {
        assert.ok((await client.from(table).select('*')).error, `${table} must deny direct access`);
      }
      assert.ok((await client.from('player_profiles').update({ nickname: 'Intruso' }).eq('user_id', b.id)).error);
      assert.ok((await client.rpc('post_community_message', { p_user_id: b.id, p_text: 'Intruso' })).error);
    }
  } finally {
    await fixture.cleanup();
  }
});
