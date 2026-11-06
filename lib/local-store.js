import { randomUUID } from 'node:crypto';
import { newPlayer } from './game.js';
import { COMMUNITY_LIMIT, MESSAGE_COOLDOWN_SECONDS } from './community.js';
import { localMemoryEnabled, LOCAL_SESSION_SECONDS } from './local-mode.js';

export const LOCAL_TEST_USER = { id: '00000000-0000-4000-8000-000000000001' };
const databaseKey = Symbol.for('fritz-idle.local-memory-database');

export function createMemoryDatabase(clock = Date.now) {
  const saves = new Map();
  const profiles = new Map();
  const messages = new Map();
  const sessions = new Map();
  const presence = new Map();
  const createdAt = new Date(clock()).toISOString();
  profiles.set(LOCAL_TEST_USER.id, {
    id: randomUUID(), nickname: 'Fritz_Teste', avatar_id: 'fritz',
    last_message_at: null, created_at: createdAt, updated_at: createdAt,
  });
  saves.set(LOCAL_TEST_USER.id, { state: newPlayer(clock()), version: 0 });

  function requireProfile(userId) {
    const profile = profiles.get(userId);
    if (!profile) throw new Error('Perfil local não encontrado.');
    return profile;
  }

  function ranking() {
    return [...profiles].map(([userId, profile]) => {
      const state = saves.get(userId)?.state;
      return {
        profile_id: profile.id, nickname: profile.nickname, avatar_id: profile.avatar_id,
        seeds: state?.seeds ?? 0, memories: state?.memories.length ?? 0,
        lifetime: state?.lifetime ?? 0, porticos: state?.porticos ?? state?.wheels ?? 0,
        rebirths: state?.rebirths ?? 0, museum: structuredClone(state?.museum ?? []),
        createdAt: profile.created_at,
      };
    }).sort((a, b) => b.porticos - a.porticos || b.seeds - a.seeds || b.memories - a.memories
      || b.lifetime - a.lifetime || a.createdAt.localeCompare(b.createdAt) || a.profile_id.localeCompare(b.profile_id))
      .map(({ createdAt: unused, ...entry }, index) => ({ ...entry, rank: index + 1 }));
  }

  return {
    saves: {
      async read(userId) { return structuredClone(saves.get(userId)); },
      async create(userId, state) {
        if (!saves.has(userId)) saves.set(userId, { state: structuredClone(state), version: 0 });
      },
      async compareAndSet(userId, version, state) {
        if (saves.get(userId)?.version !== version) return false;
        saves.set(userId, { state: structuredClone(state), version: version + 1 });
        return true;
      },
    },
    createSession() {
      const now = clock();
      for (const [token, expires] of sessions) if (expires <= now) sessions.delete(token);
      const token = randomUUID();
      sessions.set(token, now + LOCAL_SESSION_SECONDS * 1000);
      return token;
    },
    sessionUser(token) {
      const expires = sessions.get(token);
      if (!expires || expires <= clock()) {
        sessions.delete(token);
        return null;
      }
      return { ...LOCAL_TEST_USER };
    },
    revokeSession(token) { sessions.delete(token); },
    heartbeatPresence(userId) {
      const now = clock();
      for (const [id, seenAt] of presence) {
        if (seenAt < now - 24 * 60 * 60 * 1000) presence.delete(id);
      }
      const previous = presence.get(userId);
      if (previous === undefined || previous < now - 30 * 1000) presence.set(userId, now);
      return [...presence.values()].filter((seenAt) => seenAt >= now - 2 * 60 * 1000).length;
    },
    readProfile(userId) { return structuredClone(profiles.get(userId) ?? null); },
    saveProfile(userId, { nickname, avatarId }) {
      for (const [id, profile] of profiles) {
        if (id !== userId && profile.nickname.toLocaleLowerCase('pt-BR') === nickname.toLocaleLowerCase('pt-BR')) {
          return { error: 'Esse apelido já criou raízes por aqui. Escolha outro!' };
        }
      }
      const previous = profiles.get(userId);
      const now = new Date(clock()).toISOString();
      const profile = {
        id: previous?.id ?? randomUUID(), nickname, avatar_id: avatarId,
        last_message_at: previous?.last_message_at ?? null, created_at: previous?.created_at ?? now, updated_at: now,
      };
      profiles.set(userId, profile);
      return { profile: structuredClone(profile) };
    },
    board(userId) {
      const profile = requireProfile(userId);
      const entries = ranking();
      const own = entries.find((entry) => entry.profile_id === profile.id);
      const authorProfiles = new Map([...profiles.values()].map((item) => [item.id, item]));
      const progress = new Map(entries.map((entry) => [entry.profile_id, entry]));
      const feed = [...messages.values()]
        .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id))
        .slice(0, COMMUNITY_LIMIT).map((message) => {
          const author = authorProfiles.get(message.profile_id);
          const entry = progress.get(message.profile_id);
          return { ...message,
            player_profiles: { nickname: author.nickname, avatar_id: author.avatar_id },
            progress: { profile_id: entry.profile_id, porticos: entry.porticos, rebirths: entry.rebirths, museum: entry.museum },
          };
        });
      return structuredClone({ ranking: entries.slice(0, COMMUNITY_LIMIT), me: own, messages: feed });
    },
    postMessage(userId, text) {
      const profile = requireProfile(userId);
      const now = clock();
      const nextAt = profile.last_message_at ? new Date(profile.last_message_at).getTime() + MESSAGE_COOLDOWN_SECONDS * 1000 : 0;
      if (nextAt > now) return { error: 'cooldown', retryAfter: Math.max(1, Math.ceil((nextAt - now) / 1000)) };
      const message = { id: randomUUID(), profile_id: profile.id, text, created_at: new Date(now).toISOString() };
      messages.set(message.id, message);
      profile.last_message_at = message.created_at;
      return { id: message.id, created_at: message.created_at };
    },
    deleteMessage(userId, messageId) {
      const profile = requireProfile(userId);
      if (messages.get(messageId)?.profile_id !== profile.id) return false;
      return messages.delete(messageId);
    },
  };
}

export function localDatabase() {
  if (!localMemoryEnabled()) throw new Error('Banco em memória disponível somente no modo local de desenvolvimento.');
  // Keep one database across route bundles and development hot reloads.
  globalThis[databaseKey] ??= createMemoryDatabase();
  return globalThis[databaseKey];
}
