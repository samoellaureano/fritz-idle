import test from 'node:test';
import assert from 'node:assert/strict';

const enabled = process.env.FRITZ_LOCAL_TESTS === '1';
const origin = 'http://localhost:3001';

test('local login, authoritative gameplay, profile, mural and logout work without Supabase', { skip: !enabled }, async () => {
  const login = await fetch(`${origin}/login`);
  assert.match(await login.text(), /Entrar como Fritz_Teste/);
  const api = async (path, method = 'GET', body, cookie = '', source = origin) => {
    const response = await fetch(`${origin}${path}`, {
      method, redirect: 'manual',
      headers: { Origin: source, ...(cookie ? { Cookie: cookie } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return response;
  };
  assert.equal((await api('/api/game')).status, 401);
  assert.equal((await api('/api/profile')).status, 401);
  assert.equal((await api('/api/community')).status, 401);
  assert.equal((await api('/api/presence', 'POST')).status, 401);
  assert.equal((await api('/auth/local', 'POST', undefined, '', 'https://other.example')).status, 403);
  const signedIn = await api('/auth/local', 'POST');
  assert.equal(signedIn.status, 303);
  const setCookie = signedIn.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=strict/i);
  const cookie = setCookie.split(';')[0];
  try {
    const game = await api('/api/game', 'GET', undefined, cookie);
    assert.equal(game.status, 200);
    const before = await game.json();
    assert.ok(before.profile.id);
    assert.equal(before.profile.nickname, 'Fritz_Teste');
    assert.equal((await api('/api/presence', 'POST', undefined, cookie, 'https://other.example')).status, 403);
    const presence = await api('/api/presence', 'POST', undefined, cookie);
    assert.equal(presence.status, 200);
    assert.equal((await presence.json()).onlineCount, 1);
    const repeatedPresence = await api('/api/presence', 'POST', undefined, cookie);
    assert.equal((await repeatedPresence.json()).onlineCount, 1);
    assert.equal((await api('/api/click', 'POST', undefined, cookie, 'https://other.example')).status, 403);
    assert.equal((await api('/api/story', 'POST', { chapterId: 'opa-jerke-3' }, cookie)).status, 400);
    const clicked = await api('/api/click', 'POST', undefined, cookie);
    assert.equal(clicked.status, 200);
    const after = await clicked.json();
    assert.equal(after.totalClicks, before.totalClicks + 1);
    assert.ok(after.coins >= before.coins + before.clickValue);
    const profile = await api('/api/profile', 'POST', { nickname: 'Teste_Local', avatarId: 'fritz-alt' }, cookie);
    assert.equal(profile.status, 200);
    assert.equal((await profile.json()).profile.avatarId, 'fritz-alt');
    assert.equal((await api('/api/profile', 'POST', { nickname: 'ab', avatarId: 'fritz' }, cookie)).status, 400);
    const readProfile = await api('/api/profile', 'GET', undefined, cookie);
    const read = await readProfile.json();
    assert.equal(read.profile.nickname, 'Teste_Local');
    assert.equal(read.progress.totalClicks, after.totalClicks);
    const posted = await api('/api/community/messages', 'POST', { presetId: 'juntos' }, cookie);
    assert.equal(posted.status, 201);
    const { message } = await posted.json();
    const duplicate = await api('/api/community/messages', 'POST', { text: 'Outro incentivo' }, cookie);
    assert.equal(duplicate.status, 429);
    assert.ok(Number(duplicate.headers.get('retry-after')) > 0);
    const boardResponse = await api('/api/community', 'GET', undefined, cookie);
    assert.equal(boardResponse.status, 200);
    const board = await boardResponse.json();
    assert.equal(board.profile.nickname, 'Teste_Local');
    assert.equal(board.me.profile_id, board.profile.id);
    assert.equal(board.ranking.length, 1);
    const ownMessage = board.messages.find((item) => item.id === message.id);
    assert.equal(ownMessage.player_profiles.nickname, 'Teste_Local');
    assert.ok(Array.isArray(ownMessage.progress.museum));
    assert.equal((await api('/api/community/messages', 'DELETE', { messageId: message.id }, cookie)).status, 200);
    assert.equal((await api('/api/community/messages', 'DELETE', { messageId: message.id }, cookie)).status, 404);
    assert.equal((await api('/auth/google', 'POST', undefined, cookie)).status, 404);
  } finally {
    await api('/api/profile', 'POST', { nickname: 'Fritz_Teste', avatarId: 'fritz' }, cookie);
    assert.equal((await api('/auth/logout', 'POST', undefined, cookie)).status, 303);
  }
  assert.equal((await api('/api/game', 'GET', undefined, cookie)).status, 401);
  const again = await api('/auth/local', 'POST');
  const againCookie = again.headers.get('set-cookie').split(';')[0];
  const restored = await (await api('/api/game', 'GET', undefined, againCookie)).json();
  assert.ok(restored.totalClicks >= 1);
  await api('/auth/logout', 'POST', undefined, againCookie);
});
