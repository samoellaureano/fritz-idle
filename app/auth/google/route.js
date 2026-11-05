import { NextResponse } from 'next/server';
import { authClient } from '@/lib/supabase/server';
import { sameOrigin, siteOrigin } from '@/lib/supabase/config';
import { localMemoryEnabled } from '@/lib/local-mode';

export async function POST(request) {
  if (localMemoryEnabled()) return new NextResponse('Use o acesso de teste em /login no modo local.', { status: 404 });
  try {
    if (!sameOrigin(request)) return new NextResponse('Origem não autorizada.', { status: 403 });
    const { data, error } = await (await authClient()).auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteOrigin()}/auth/callback`, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      console.error('Google sign-in failed', { code: error?.code ?? 'missing_url' });
      return NextResponse.redirect(new URL('/login?error=oauth', siteOrigin()), { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
    }
    return NextResponse.redirect(data.url, { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Google sign-in unavailable', { code: error.code ?? error.name });
    return NextResponse.redirect(new URL('/login?error=config', request.url), { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
  }
}
