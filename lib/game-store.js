import 'server-only';
import { cloudStore } from './supabase/saves';
import { localMemoryEnabled } from './local-mode.js';
import { localDatabase } from './local-store.js';

export function gameStore() {
  return localMemoryEnabled() ? localDatabase().saves : cloudStore();
}
