import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { publicConfig } from './config';
import { localMemoryEnabled } from '../local-mode.js';

function requireCloudMode() {
  if (localMemoryEnabled()) throw new Error('Supabase desativado no modo local em memória.');
}

export async function authClient() {
  requireCloudMode();
  const { url, key } = publicConfig();
  const jar = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => values.forEach(({ name, value, options }) => jar.set(name, value, options)),
    },
  });
}

export function adminClient() {
  requireCloudMode();
  const { url } = publicConfig();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Chave de persistência do Supabase não configurada.');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
