import assert from 'node:assert/strict';
import { randomUUID, randomBytes } from 'node:crypto';
import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { newPlayer } from '../../lib/game.js';

export const cloudEnabled = process.env.FRITZ_CLOUD_TESTS === '1';

export async function cloudFixture() {
  if (!cloudEnabled) throw new Error('Cloud tests require explicit FRITZ_CLOUD_TESTS=1 approval.');
  nextEnv.loadEnvConfig(process.cwd());
  const origin = process.env.FRITZ_TEST_ORIGIN || 'http://localhost:3002';
  if (!['http://localhost:3002', 'http://127.0.0.1:3002'].includes(origin)) {
    throw new Error('Cloud tests must target the isolated local validation server.');
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const users = [];
  const suffix = randomUUID().replaceAll('-', '').slice(0, 10);
  const anonymous = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  async function api(actor, path, method = 'GET', body, extraHeaders = {}) {
    const response = await fetch(`${origin}${path}`, {
      method, headers: {
        Origin: origin, ...(actor ? { Cookie: actor.cookie } : {}),
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...extraHeaders,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      redirect: 'manual',
    });
    const data = await response.json();
    return { status: response.status, data, headers: response.headers };
  }
  return {
    origin, admin, anonymous, suffix, users, api,
    async user() {
      const email = `fritz-validation-${randomUUID()}@example.invalid`;
      const password = randomBytes(32).toString('hex');
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (error) throw error;
      users.push(data.user.id);
      const jar = new Map();
      const client = createServerClient(url, key, {
        cookies: {
          getAll: () => [...jar].map(([name, value]) => ({ name, value })),
          setAll: (cookies) => cookies.forEach(({ name, value }) => jar.set(name, value)),
        },
      });
      const signed = await client.auth.signInWithPassword({ email, password });
      if (signed.error) throw signed.error;
      const actor = {
        id: data.user.id, client, cookie: [...jar].map(([name, value]) => `${name}=${value}`).join('; '),
        browserCookies: [...jar].map(([name, value]) => ({ name, value, url: origin, sameSite: 'Lax' })),
      };
      return actor;
    },
    async profile(actor, name = `Flor_${suffix}`, avatarId = 'fritz') {
      const response = await api(actor, '/api/profile', 'POST', { nickname: name, avatarId });
      assert.equal(response.status, 200, response.data.error);
      return response.data.profile;
    },
    async seed(actor, values) {
      const state = { ...newPlayer(), ...values };
      const { error } = await admin.from('game_saves').upsert({ user_id: actor.id, state, version: 0 }, { onConflict: 'user_id' });
      if (error) throw error;
    },
    async cleanup() {
      if (!users.length) return;
      const { data: ownedProfiles, error: profileError } = await admin.from('player_profiles').select('id').in('user_id', users);
      if (profileError) throw profileError;
      const profiles = ownedProfiles.map((profile) => profile.id);
      const failures = [];
      for (const id of users) {
        const { error } = await admin.auth.admin.deleteUser(id);
        if (error) failures.push(error);
      }
      if (failures.length) throw new AggregateError(failures, 'Temporary account cleanup failed');
      for (const table of ['game_saves', 'player_profiles']) {
        const { data, error } = await admin.from(table).select('user_id').in('user_id', users);
        if (error) throw error;
        assert.equal(data.length, 0, `${table} must cascade on user deletion`);
      }
      if (profiles.length) {
        const { data, error } = await admin.from('community_messages').select('id').in('profile_id', profiles);
        if (error) throw error;
        assert.equal(data.length, 0, 'messages must cascade on profile deletion');
      }
    },
  };
}
