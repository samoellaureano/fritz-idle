import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as wait } from 'node:timers/promises';

const enabled = process.env.FRITZ_LOCAL_TESTS === '1';
const origin = 'http://localhost:3001';

test('real local API progresses through gifts, reading, upgrades, max purchases, production and sharing', { skip: !enabled }, async () => {
  const login = await fetch(`${origin}/login`);
  assert.match(await login.text(), /Entrar como Fritz_Teste/);
  let cookie = '';
  async function api(path, method = 'GET', body, authenticated = true, source = origin) {
    const response = await fetch(`${origin}${path}`, {
      method, redirect: 'manual', headers: {
        Origin: source, ...(authenticated && cookie ? { Cookie: cookie } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const content = await response.text();
    return { status: response.status, headers: response.headers,
      data: response.headers.get('content-type')?.includes('application/json') ? JSON.parse(content) : content };
  }
  for (const path of ['/api/game', '/api/profile', '/api/community']) {
    assert.equal((await api(path, 'GET', undefined, false)).status, 401);
  }
  const session = await api('/auth/local', 'POST');
  assert.equal(session.status, 303);
  cookie = session.headers.get('set-cookie').split(';')[0];
  try {
    let response = await api('/api/game');
    assert.equal(response.status, 200);
    let state = response.data;
    const originalClicks = state.totalClicks;
    assert.equal((await api('/api/click', 'POST', undefined, true, 'https://other.example')).status, 403);
    response = await api('/api/click', 'POST');
    assert.equal(response.status, 200);
    assert.equal(response.data.totalClicks, originalClicks + 1);
    state = response.data;
    if (state.dailyAvailable) {
      response = await api('/api/daily', 'POST');
      assert.equal(response.status, 200);
      state = response.data;
    }
    assert.equal((await api('/api/daily', 'POST')).status, 400);
    const available = state.storyChapters.find((chapter) => chapter.unlocked && !chapter.completed);
    if (available) {
      const before = state.storyMemoryCount;
      response = await api('/api/story', 'POST', { chapterId: available.id });
      assert.equal(response.status, 200);
      assert.equal(response.data.storyMemoryCount, before + 1);
      state = response.data;
      assert.equal((await api('/api/story', 'POST', { chapterId: available.id })).status, 400);
    }
    assert.equal((await api('/api/story', 'POST', { chapterId: 'made-up' })).status, 400);
    const upgrade = state.upgrades.find((item) => item.id === 'passos-de-palmeira');
    if (upgrade.owned < upgrade.maxOwned) {
      for (let count = 0; state.coins < upgrade.cost && count < 1000; count++) {
        state = (await api('/api/click', 'POST')).data;
      }
      response = await api('/api/upgrade', 'POST', { upgradeId: upgrade.id });
      assert.equal(response.status, 200);
      assert.equal(response.data.upgrades.find((item) => item.id === upgrade.id).owned, upgrade.owned + 1);
      state = response.data;
    }
    const place = state.generators.find((item) => item.id === 'fritz-jr');
    for (let count = 0; state.coins < place.cost && count < 1000; count++) {
      state = (await api('/api/click', 'POST')).data;
    }
    response = await api('/api/buy', 'POST', { generatorId: place.id, quantity: 'max' });
    assert.equal(response.status, 200);
    const bought = response.data.generators.find((item) => item.id === place.id);
    assert.ok(bought.owned > place.owned);
    assert.ok(response.data.coins < bought.cost);
    assert.equal((await api('/api/buy', 'POST', { generatorId: place.id, quantity: 999 })).status, 400);
    const beforeIdle = response.data;
    await wait(1100);
    state = (await api('/api/game')).data;
    assert.ok(state.coins > beforeIdle.coins);
    assert.equal(state.totalClicks, beforeIdle.totalClicks);
    const cps = state.cps;
    if (state.share.ready) {
      response = await api('/api/share', 'POST');
      assert.equal(response.status, 200);
      assert.ok(Math.abs(response.data.cps / cps - 1.2) < 1e-8);
      state = response.data;
    }
    assert.equal((await api('/api/share', 'POST')).status, 400);
    if (!state.seedGenerator.ready) assert.equal((await api('/api/seed-generator', 'POST')).status, 400);
    if (!state.seedGenerator.owned) assert.equal((await api('/api/manager', 'POST', { characterId: 'francisca' })).status, 400);
    if (!state.rebirth.points) assert.equal((await api('/api/museum', 'POST', { itemId: 'roda-da-memoria' })).status, 400);
    assert.equal((await api('/api/rebirth', 'POST', { expectedCycle: state.rebirth.count + 1 })).status, 400);
    const restored = await api('/api/profile');
    assert.equal(restored.status, 200);
    assert.equal(restored.data.progress.totalClicks, state.totalClicks);
    assert.equal(restored.data.progress.storyMemoryCount, state.storyMemoryCount);
    assert.equal(restored.data.progress.generators.find((item) => item.id === place.id).owned, bought.owned);
    const board = await api('/api/community');
    assert.equal(board.status, 200);
    assert.equal(board.data.me.memories, state.storyMemoryCount);
    assert.equal(board.data.me.profile_id, state.profile.id);
  } finally {
    assert.equal((await api('/auth/logout', 'POST')).status, 303);
  }
  assert.equal((await api('/api/game')).status, 401);
});
