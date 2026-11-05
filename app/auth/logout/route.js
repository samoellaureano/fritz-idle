import { NextResponse } from 'next/server';
import { authClient } from '@/lib/supabase/server';
import { sameOrigin, siteOrigin } from '@/lib/supabase/config';
import { cookies } from 'next/headers';
import { localMemoryEnabled, isLoopbackRequest, LOCAL_SESSION_COOKIE } from '@/lib/local-mode';
import { localDatabase } from '@/lib/local-store';

export async function POST(request) {
  try {
    if (!sameOrigin(request)) return new NextResponse('Origem não autorizada.', { status: 403 });
    if (localMemoryEnabled()) {
      if (!isLoopbackRequest(request)) return new NextResponse('Origem não autorizada.', { status: 403 });
      const jar = await cookies();
      localDatabase().revokeSession(jar.get(LOCAL_SESSION_COOKIE)?.value);
      const response = NextResponse.redirect(new URL('/login', siteOrigin()), { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
      response.cookies.set(LOCAL_SESSION_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
      return response;
    }
    const { error } = await (await authClient()).auth.signOut({ scope: 'local' });
    if (error) throw error;
    return NextResponse.redirect(new URL('/login', siteOrigin()), { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Logout failed', { code: error.code ?? error.name });
    return new NextResponse('Não foi possível sair. Volte e tente novamente.', { status: 503 });
  }
}
