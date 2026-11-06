import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryDatabase } from '../lib/local-store.js';

test('presence counts unique active users, throttles heartbeats and expires stale entries', () => {
  let now = Date.UTC(2026, 10, 5, 12);
  const database = createMemoryDatabase(() => now);
  assert.equal(database.heartbeatPresence('alice'), 1);
  assert.equal(database.heartbeatPresence('alice'), 1);
  assert.equal(database.heartbeatPresence('bob'), 2);

  now += 31_000;
  assert.equal(database.heartbeatPresence('alice'), 2);
  now += 121_000;
  assert.equal(database.heartbeatPresence('carol'), 1);
});
