import { NextResponse } from 'next/server';
import { localMemoryEnabled, isLoopbackRequest, LOCAL_SESSION_COOKIE, LOCAL_SESSION_SECONDS } from '@/lib/local-mode';
import { localDatabase } from '@/lib/local-store';
import { sameOrigin, siteOrigin } from '@/lib/supabase/config';

export async function POST(request) {
  if (!localMemoryEnabled()) return new NextResponse('Página não encontrada.', { status: 404 });
  if (!isLoopbackRequest(request) || !sameOrigin(request)) return new NextResponse('Origem não autorizada.', { status: 403 });
  try {
    const response = NextResponse.redirect(new URL('/', siteOrigin()), { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
    response.cookies.set(LOCAL_SESSION_COOKIE, localDatabase().createSession(), {
      httpOnly: true, sameSite: 'strict', secure: false, path: '/', maxAge: LOCAL_SESSION_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Local sign-in failed', { code: error.code ?? error.name });
    return new NextResponse('Não foi possível iniciar a sessão local. Tente novamente.', { status: 503 });
  }
}
