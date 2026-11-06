import 'server-only';
import { adminClient } from './supabase/server';
import { localMemoryEnabled } from './local-mode.js';
import { localDatabase } from './local-store.js';

export async function heartbeatPresence(userId) {
  if (localMemoryEnabled()) return localDatabase().heartbeatPresence(userId);

  const { data, error } = await adminClient().rpc('heartbeat_player_presence', { p_user_id: userId });
  if (error) throw error;
  if (!Number.isSafeInteger(data) || data < 0) throw new Error('Invalid online presence count');
  return data;
}
