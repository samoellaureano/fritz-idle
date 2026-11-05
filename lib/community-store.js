import 'server-only';
import { adminClient } from './supabase/server';
import { localMemoryEnabled } from './local-mode.js';
import { localDatabase } from './local-store.js';

export const profileFields = 'id, nickname, avatar_id, last_message_at';

export async function readProfile(userId) {
  if (localMemoryEnabled()) return localDatabase().readProfile(userId);
  const { data, error } = await adminClient().from('player_profiles')
    .select(profileFields).eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export function publicProfile(profile) {
  return { id: profile.id, nickname: profile.nickname, avatarId: profile.avatar_id, lastMessageAt: profile.last_message_at };
}
