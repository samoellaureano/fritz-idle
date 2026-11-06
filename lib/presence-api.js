import { NextResponse } from 'next/server';
import { requestUser } from './server-auth';
import { sameOrigin } from './supabase/config';
import { heartbeatPresence } from './presence-store';

const headers = { 'Cache-Control': 'private, no-store' };
const json = (body, status = 200) => NextResponse.json(body, { status, headers });

export async function presenceApi(request) {
  try {
    if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);
    if (!sameOrigin(request)) return json({ error: 'Origem da requisição não autorizada.' }, 403);
    const user = await requestUser(request);
    if (!user) return json({ error: 'Entre com sua conta para continuar.' }, 401);
    const onlineCount = await heartbeatPresence(user.id);
    return json({ onlineCount });
  } catch (error) {
    console.error('Presence request failed', { code: error.code ?? error.name });
    return json({ error: 'A presença online está temporariamente indisponível.' }, 503);
  }
}
