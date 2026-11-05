import { NextResponse } from 'next/server';
import { adminClient } from './supabase/server';
import { requestUser } from './server-auth';
import { sameOrigin } from './supabase/config';
import { profileFields, publicProfile, readProfile } from './community-store';
import { COMMUNITY_LIMIT, validateProfile, validateMessage } from './community';
import { executeSavedAction } from './save-store';
import { gameStore } from './game-store';
import { localMemoryEnabled } from './local-mode.js';
import { localDatabase } from './local-store.js';

const headers = { 'Cache-Control': 'private, no-store' };
const json = (body, status = 200, extra = {}) => NextResponse.json(body, { status, headers: { ...headers, ...extra } });
const rankingFields = 'profile_id, nickname, avatar_id, seeds, memories, lifetime, rank, porticos, rebirths, museum';

async function bodyOf(request) {
  const body = await request.text();
  if (body.length > 2048) return { error: 'Mensagem ou perfil muito grande.' };
  try {
    return { input: JSON.parse(body) };
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return { error: 'Corpo JSON inválido.' };
  }
}

export async function communityApi(request, action) {
  try {
    if (request.method !== 'GET' && !sameOrigin(request)) return json({ error: 'Origem da requisição não autorizada.' }, 403);
    const user = await requestUser(request);
    if (!user) return json({ error: 'Entre com sua conta para continuar.' }, 401);
    const local = localMemoryEnabled() ? localDatabase() : null;
    const client = local ? null : adminClient();
    const profile = await readProfile(user.id);
    if (action === 'profile-read') {
      let progress = null;
      if (profile) {
        progress = await executeSavedAction(gameStore(), user.id, 'game');
      }
      return json({ profile: profile ? publicProfile(profile) : null, progress });
    }
    if (action === 'profile-save') {
      const body = await bodyOf(request);
      if (body.error) return json(body, 400);
      const valid = validateProfile(body.input);
      if (valid.error) return json(valid, 400);
      if (local) {
        const result = local.saveProfile(user.id, valid);
        return result.error ? json(result, 409) : json({ profile: publicProfile(result.profile) });
      }
      const { data, error: writeError } = await client.from('player_profiles').upsert({
        user_id: user.id, nickname: valid.nickname, avatar_id: valid.avatarId, updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' }).select(profileFields).single();
      if (writeError?.code === '23505') return json({ error: 'Esse apelido já criou raízes por aqui. Escolha outro!' }, 409);
      if (writeError) throw writeError;
      return json({ profile: publicProfile(data) });
    }
    if (!profile) return json({ error: 'Escolha seu apelido e avatar para continuar.', code: 'PROFILE_REQUIRED' }, 428);
    if (action === 'board') {
      if (local) return json({ profile: publicProfile(profile), ...local.board(user.id) });
      const [ranking, own, messages] = await Promise.all([
        client.from('community_ranking').select(rankingFields).order('rank').limit(COMMUNITY_LIMIT),
        client.from('community_ranking').select(rankingFields).eq('user_id', user.id).single(),
        client.from('community_messages').select('id, profile_id, text, created_at, player_profiles!inner(nickname, avatar_id)')
          .order('created_at', { ascending: false }).order('id', { ascending: false }).limit(COMMUNITY_LIMIT),
      ]);
      for (const result of [ranking, own, messages]) if (result.error) throw result.error;
      const authorIds = [...new Set(messages.data.map((message) => message.profile_id))];
      let authors = [];
      if (authorIds.length) {
        const { data, error: authorsError } = await client.from('community_ranking')
          .select('profile_id, porticos, rebirths, museum').in('profile_id', authorIds);
        if (authorsError) throw authorsError;
        authors = data;
        if (authors.length !== authorIds.length) throw new Error('Community authors changed during read');
      }
      const authorProgress = new Map(authors.map((author) => [author.profile_id, author]));
      return json({
        profile: publicProfile(profile), ranking: ranking.data, me: own.data,
        messages: messages.data.map((message) => ({ ...message, progress: authorProgress.get(message.profile_id) })),
      });
    }
    const body = await bodyOf(request);
    if (body.error) return json(body, 400);
    if (action === 'message-post') {
      const valid = validateMessage(body.input);
      if (valid.error) return json(valid, 400);
      const { data, error: postError } = local ? { data: local.postMessage(user.id, valid.text) }
        : await client.rpc('post_community_message', { p_user_id: user.id, p_text: valid.text });
      if (postError) throw postError;
      if (data.error === 'cooldown') return json({
        error: `Espere ${data.retryAfter} segundos antes de espalhar outro incentivo.`, retryAfter: data.retryAfter,
      }, 429, { 'Retry-After': String(data.retryAfter) });
      if (data.error) throw new Error(`Unexpected message result: ${data.error}`);
      return json({ message: data }, 201);
    }
    if (action === 'message-delete') {
      const input = body.input;
      if (!input || Array.isArray(input) || Object.keys(input).length !== 1
        || typeof input.messageId !== 'string'
        || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(input.messageId)) {
        return json({ error: 'Mensagem inválida.' }, 400);
      }
      if (local) return local.deleteMessage(user.id, input.messageId)
        ? json({ deleted: true }) : json({ error: 'Mensagem não encontrada ou não pertence a você.' }, 404);
      const { data, error: deleteError } = await client.from('community_messages')
        .delete().eq('id', input.messageId).eq('profile_id', profile.id).select('id');
      if (deleteError) throw deleteError;
      if (!data.length) return json({ error: 'Mensagem não encontrada ou não pertence a você.' }, 404);
      return json({ deleted: true });
    }
    throw new Error('Unknown community action');
  } catch (error) {
    console.error('Community request failed', { action, code: error.code ?? error.name });
    return json({ error: 'Não foi possível acessar a comunidade. Tente novamente em instantes.' }, 503);
  }
}
