import test from 'node:test';
import assert from 'node:assert/strict';
import { AVATARS, ENCOURAGEMENTS, validateProfile, validateMessage, avatarFor, MESSAGE_MAX_LENGTH } from '../lib/community.js';

test('profiles require a valid nickname and an available historical or fictional avatar', () => {
  for (const avatar of AVATARS) {
    assert.deepEqual(validateProfile({ nickname: '  Ação_123  ', avatarId: avatar.id }), { nickname: 'Ação_123', avatarId: avatar.id });
    assert.equal(avatarFor(avatar.id), avatar);
  }
  assert.equal(avatarFor('not-an-avatar'), undefined);
  assert.equal(validateProfile({ nickname: 'A'.repeat(24), avatarId: 'fritz' }).nickname.length, 24);
  assert.equal(validateProfile({ nickname: 'João'.normalize('NFD'), avatarId: 'fritz' }).nickname, 'João');
  for (const nickname of ['', 'ab', 'A'.repeat(25), 'com espaço', '<img>', 'user@email', 'abc\nx', 'abc\u200b']) {
    assert.ok(validateProfile({ nickname, avatarId: 'fritz' }).error, nickname);
  }
  for (const input of [null, [], 'x', {}, { nickname: 'abc' }, { nickname: 'abc', avatarId: 'invalid' },
    { nickname: 'abc', avatarId: 'fritz', userId: 'someone' }, { nickname: 123, avatarId: 'fritz' }]) {
    assert.ok(validateProfile(input).error);
  }
});

test('messages accept exactly one validated preset or a bounded single-line custom text', () => {
  for (const preset of ENCOURAGEMENTS) {
    assert.deepEqual(validateMessage({ presetId: preset.id }), { text: preset.text });
    assert.ok([...preset.text].length <= MESSAGE_MAX_LENGTH);
  }
  assert.deepEqual(validateMessage({ text: '  Continue florescendo!  ' }), { text: 'Continue florescendo!' });
  assert.equal(validateMessage({ text: 'a'.repeat(160) }).text.length, 160);
  assert.equal([...validateMessage({ text: '🌸'.repeat(160) }).text].length, 160);
  for (const text of ['', ' ', 'a'.repeat(161), '🌸'.repeat(161), 'oi\nmundo', 'abc\u0000', 'abc\u202e']) {
    assert.ok(validateMessage({ text }).error);
  }
  for (const input of [null, [], 'a', {}, { presetId: 'invalid' }, { text: 'abc', presetId: 'juntos' },
    { text: 'abc', userId: 'another' }, { text: 123 }]) {
    assert.ok(validateMessage(input).error);
  }
});
