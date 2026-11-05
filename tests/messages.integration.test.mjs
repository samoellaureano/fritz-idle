import test from 'node:test';
import assert from 'node:assert/strict';
import { cloudEnabled, cloudFixture } from './helpers/cloud.mjs';
import { ENCOURAGEMENTS } from '../lib/community.js';

test('cloud messages persist, serialize concurrent posts, retain cooldown after edits/deletion and isolate authors', { skip: !cloudEnabled }, async () => {
  const fixture = await cloudFixture();
  try {
    const a = await fixture.user();
    const b = await fixture.user();
    const profile = await fixture.profile(a, `Correio_${fixture.suffix}`);
    await fixture.profile(b, `Vizinho_${fixture.suffix}`);
    assert.equal((await fixture.api(null, '/api/community/messages', 'POST', { text: 'Olá' })).status, 401);
    assert.equal((await fixture.api(a, '/api/community/messages', 'POST', { text: 'Olá' }, { Origin: 'https://other.invalid' })).status, 403);
    const results = await Promise.all(Array.from({ length: 4 }, () =>
      fixture.api(a, '/api/community/messages', 'POST', { presetId: 'juntos' })));
    assert.equal(results.filter((r) => r.status === 201).length, 1);
    assert.equal(results.filter((r) => r.status === 429).length, 3);
    assert.ok(results.find((r) => r.status === 429).headers.get('retry-after'));
    const id = results.find((r) => r.status === 201).data.message.id;
    const board = await fixture.api(b, '/api/community');
    assert.equal(board.data.messages.find((m) => m.id === id).text, ENCOURAGEMENTS.find((p) => p.id === 'juntos').text);
    await fixture.profile(a, `Renomeado_${fixture.suffix}`, 'fritz-alt');
    assert.equal((await fixture.api(a, '/api/community/messages', 'POST', { text: 'Sem furar o intervalo' })).status, 429);
    assert.equal((await fixture.api(b, '/api/community/messages', 'DELETE', { messageId: id })).status, 404);
    assert.equal((await fixture.api(a, '/api/community/messages', 'DELETE', { messageId: id })).status, 200);
    assert.ok(!(await fixture.api(b, '/api/community')).data.messages.some((m) => m.id === id));
    assert.equal((await fixture.api(a, '/api/community/messages', 'POST', { text: 'Ainda não' })).status, 429);
    const { error } = await fixture.admin.from('player_profiles').update({ last_message_at: new Date(Date.now() - 61000).toISOString() }).eq('id', profile.id);
    if (error) throw error;
    const custom = '<script>alert("texto, não HTML")</script>';
    const sent = await fixture.api(a, '/api/community/messages', 'POST', { text: custom });
    assert.equal(sent.status, 201);
    const messages = (await fixture.api(b, '/api/community')).data.messages;
    assert.equal(messages.find((m) => m.id === sent.data.message.id).text, custom);
    assert.equal((await fixture.api(a, '/api/community/messages', 'POST', { text: 'a'.repeat(161) })).status, 400);
    assert.equal((await fixture.api(a, '/api/community/messages', 'DELETE', { messageId: sent.data.message.id, profileId: b.id })).status, 400);
  } finally {
    await fixture.cleanup();
  }
});
