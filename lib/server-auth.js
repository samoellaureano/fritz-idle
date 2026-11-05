import 'server-only';
import { cookies } from 'next/headers';
import { authClient } from './supabase/server';
import { localMemoryEnabled, isLoopbackRequest, LOCAL_SESSION_COOKIE } from './local-mode.js';
import { localDatabase } from './local-store.js';

export async function requestUser(request) {
  if (localMemoryEnabled()) {
    if (!isLoopbackRequest(request)) return null;
    const jar = await cookies();
    return localDatabase().sessionUser(jar.get(LOCAL_SESSION_COOKIE)?.value);
  }
  const { data: { user }, error } = await (await authClient()).auth.getUser();
  if (error && error.status !== 400 && error.status !== 401 && error.name !== 'AuthSessionMissingError') throw error;
  return error ? null : user;
}
