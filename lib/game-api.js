import { NextResponse } from 'next/server';
import { authClient } from './supabase/server';
import { sameOrigin } from './supabase/config';
import { cloudStore } from './supabase/saves';
import { executeSavedAction, SaveConflictError } from './save-store';
import { readProfile, publicProfile } from './community-store';

const headers = { 'Cache-Control': 'private, no-store' };
const json = (body, status = 200) => NextResponse.json(body, { status, headers });
const fields = { buy: 'generatorId', upgrade: 'upgradeId', story: 'chapterId', museum: 'itemId', rebirth: 'expectedCycle' };

export async function gameApi(request, action) {
  try {
    if (request.method !== 'GET' && !sameOrigin(request)) {
      return json({ error: 'Origem da requisição não autorizada.' }, 403);
    }
    const { data: { user }, error } = await (await authClient()).auth.getUser();
    if (error && error.status !== 400 && error.status !== 401 && error.name !== 'AuthSessionMissingError') {
      throw error;
    }
    if (!user || error) return json({ error: 'Entre com sua conta Google para continuar.' }, 401);
    const profile = await readProfile(user.id);
    if (!profile) return json({ error: 'Escolha seu apelido e avatar para continuar.', code: 'PROFILE_REQUIRED' }, 428);
    let input = {};
    if (fields[action]) {
      try {
        input = await request.json();
      } catch (cause) {
        if (!(cause instanceof SyntaxError)) throw cause;
        return json({ error: 'Corpo JSON inválido.' }, 400);
      }
      if (!input || Array.isArray(input) || typeof input !== 'object'
        || Object.keys(input).length !== 1
        || (action === 'rebirth'
          ? !Number.isSafeInteger(input.expectedCycle) || input.expectedCycle < 0
          : typeof input[fields[action]] !== 'string' || input[fields[action]].length > 100)) {
        return json({ error: 'Parâmetros inválidos.' }, 400);
      }
    }
    const result = await executeSavedAction(cloudStore(), user.id, action, input);
    return json({ ...result, profile: publicProfile(profile) }, result.error ? 400 : 200);
  } catch (error) {
    if (error instanceof SaveConflictError) return json({ error: error.message }, 409);
    console.error('Game request failed', { action, code: error.code ?? error.name });
    return json({ error: 'Não foi possível acessar seu progresso. Tente novamente em instantes.' }, 503);
  }
}
