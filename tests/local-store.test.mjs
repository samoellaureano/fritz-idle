import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDatabase, localDatabase, LOCAL_TEST_USER } from '../lib/local-store.js';
import { localMemoryEnabled, isLoopbackRequest, LOCAL_SESSION_SECONDS } from '../lib/local-mode.js';
import { executeSavedAction } from '../lib/save-store.js';
import { newPlayer } from '../lib/game.js';
import { MESSAGE_COOLDOWN_SECONDS } from '../lib/community.js';

const NOW = 1_800_000_000_000;

test('memory mode requires explicit opt-in AND development, regardless of host or production flag', () => {
  for (const NODE_ENV of ['production', 'test', undefined]) {
    assert.equal(localMemoryEnabled({ NODE_ENV, FRITZ_LOCAL_MEMORY: '1' }), false);
  }
  for (const FRITZ_LOCAL_MEMORY of [undefined, '', '0', 'true']) {
    assert.equal(localMemoryEnabled({ NODE_ENV: 'development', FRITZ_LOCAL_MEMORY }), false);
  }
  assert.equal(localMemoryEnabled({ NODE_ENV: 'development', FRITZ_LOCAL_MEMORY: '1' }), true);
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    assert.equal(isLoopbackRequest(new Request(`http://${host}:3001`)), true);
  }
  for (const host of ['fritzidle.com.br', 'localhost.example', '192.168.1.1']) {
    assert.equal(isLoopbackRequest(new Request(`http://${host}:3001`)), false);
  }
  if (!localMemoryEnabled()) assert.throws(localDatabase, /somente no modo local/);
});

test('test account starts at zero and profiles/saves are returned as independent copies', async () => {
  const db = createMemoryDatabase(() => NOW);
  const saved = await db.saves.read(LOCAL_TEST_USER.id);
  assert.deepEqual(saved, { state: newPlayer(NOW), version: 0 });
  const profile = db.readProfile(LOCAL_TEST_USER.id);
  assert.equal(profile.nickname, 'Fritz_Teste');
  assert.equal(profile.avatar_id, 'fritz');
  assert.equal(profile.last_message_at, null);
  saved.state.coins = 100;
  saved.state.memories.push('not-real');
  profile.nickname = 'changed';
  assert.equal((await db.saves.read(LOCAL_TEST_USER.id)).state.coins, 0);
  assert.deepEqual((await db.saves.read(LOCAL_TEST_USER.id)).state.memories, []);
  assert.equal(db.readProfile(LOCAL_TEST_USER.id).nickname, 'Fritz_Teste');
  const state = await executeSavedAction(db.saves, LOCAL_TEST_USER.id, 'game', {}, () => NOW);
  assert.equal(state.rebirth.level, 1);
  assert.equal(state.storyMemoryCount, 0);
  assert.equal(state.generators.every((item) => item.owned === 0), true);
  assert.equal(state.characters.filter((item) => item.hired).length, 0);
});

test('memory saves preserve CAS concurrency, cloning, one-time rewards and account isolation', async () => {
  const db = createMemoryDatabase(() => NOW);
  const results = await Promise.all(Array.from({ length: 10 }, () =>
    executeSavedAction(db.saves, LOCAL_TEST_USER.id, 'click', {}, () => NOW)));
  assert.equal(results.every((result) => !result.error), true);
  assert.equal((await db.saves.read(LOCAL_TEST_USER.id)).state.coins, 10);
  await executeSavedAction(db.saves, 'other-test-user', 'click', {}, () => NOW);
  assert.equal((await db.saves.read('other-test-user')).state.coins, 1);
  const daily = await Promise.all(Array.from({ length: 6 }, () =>
    executeSavedAction(db.saves, LOCAL_TEST_USER.id, 'daily', {}, () => NOW)));
  assert.equal(daily.filter((result) => !result.error).length, 1);
  const before = await db.saves.read(LOCAL_TEST_USER.id);
  await db.saves.create(LOCAL_TEST_USER.id, newPlayer(NOW));
  assert.deepEqual(await db.saves.read(LOCAL_TEST_USER.id), before);
  assert.equal(await db.saves.compareAndSet(LOCAL_TEST_USER.id, before.version - 1, newPlayer(NOW)), false);
  assert.deepEqual(await db.saves.read(LOCAL_TEST_USER.id), before);
});

test('sessions are opaque, expiring, revocable and cannot survive a new database', () => {
  let now = NOW;
  const db = createMemoryDatabase(() => now);
  assert.equal(db.sessionUser(undefined), null);
  assert.equal(db.sessionUser(LOCAL_TEST_USER.id), null);
  const token = db.createSession();
  const another = db.createSession();
  assert.notEqual(token, another);
  assert.notEqual(token, LOCAL_TEST_USER.id);
  assert.deepEqual(db.sessionUser(token), LOCAL_TEST_USER);
  assert.equal(createMemoryDatabase(() => now).sessionUser(token), null);
  db.revokeSession(token);
  assert.equal(db.sessionUser(token), null);
  now += LOCAL_SESSION_SECONDS * 1000 - 1;
  assert.deepEqual(db.sessionUser(another), LOCAL_TEST_USER);
  now++;
  assert.equal(db.sessionUser(another), null);
});

test('local profile, ranking and message contracts match production without ticking other saves', async () => {
  let now = NOW;
  const db = createMemoryDatabase(() => now);
  const localId = LOCAL_TEST_USER.id;
  const rival = 'rival-local';
  db.saveProfile(rival, { nickname: 'Outra_Jornada', avatarId: 'francisca' });
  const state = { ...newPlayer(now), porticos: 1.5, seeds: 3, memories: ['a-primeira-petala'],
    lifetime: 100, museum: ['bicicleta'] };
  await db.saves.create(rival, state);
  const before = await db.saves.read(rival);
  let board = db.board(localId);
  assert.equal(board.me.rank, 2);
  assert.equal(board.ranking[0].nickname, 'Outra_Jornada');
  assert.deepEqual(board.ranking[0].museum, ['bicicleta']);
  assert.equal(board.ranking[0].porticos, 1.5);
  assert.equal(board.ranking[0].memories, 1);
  assert.equal(board.ranking.some((entry) => 'user_id' in entry || 'createdAt' in entry), false);
  const posted = db.postMessage(localId, 'Boa jornada!');
  assert.ok(posted.id && posted.created_at);
  assert.deepEqual(db.postMessage(localId, 'Outro incentivo'), { error: 'cooldown', retryAfter: 60 });
  assert.equal(db.readProfile(localId).last_message_at, posted.created_at);
  const changed = db.saveProfile(localId, { nickname: 'Novo_Teste', avatarId: 'schwanke' });
  assert.equal(changed.profile.last_message_at, posted.created_at);
  assert.ok(db.saveProfile(localId, { nickname: 'outra_jornada', avatarId: 'fritz' }).error);
  board = db.board(localId);
  assert.equal(board.messages[0].player_profiles.nickname, 'Novo_Teste');
  assert.equal(board.messages[0].player_profiles.avatar_id, 'schwanke');
  assert.deepEqual(board.messages[0].progress.museum, []);
  assert.equal(db.deleteMessage(rival, posted.id), false);
  assert.equal(db.deleteMessage(localId, posted.id), true);
  assert.equal(db.deleteMessage(localId, posted.id), false);
  now += MESSAGE_COOLDOWN_SECONDS * 1000 - 1;
  assert.equal(db.postMessage(localId, 'Ainda cedo').retryAfter, 1);
  now++;
  assert.ok(db.postMessage(localId, 'Agora sim').id);
  assert.deepEqual(await db.saves.read(rival), before);
});

test('a process restart model resets all progress, profiles, messages and login sessions', async () => {
  const first = createMemoryDatabase(() => NOW);
  const token = first.createSession();
  await executeSavedAction(first.saves, LOCAL_TEST_USER.id, 'daily', {}, () => NOW);
  first.saveProfile(LOCAL_TEST_USER.id, { nickname: 'Mudou_Teste', avatarId: 'fritz-alt' });
  first.postMessage(LOCAL_TEST_USER.id, 'Teste em memória');
  const restarted = createMemoryDatabase(() => NOW);
  assert.equal(restarted.sessionUser(token), null);
  assert.deepEqual((await restarted.saves.read(LOCAL_TEST_USER.id)).state, newPlayer(NOW));
  assert.equal(restarted.readProfile(LOCAL_TEST_USER.id).nickname, 'Fritz_Teste');
  assert.deepEqual(restarted.board(LOCAL_TEST_USER.id).messages, []);
});
