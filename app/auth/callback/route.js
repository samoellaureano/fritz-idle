import { NextResponse } from 'next/server';
import { authClient } from '@/lib/supabase/server';
import { siteOrigin } from '@/lib/supabase/config';
import { localMemoryEnabled } from '@/lib/local-mode';

export const dynamic = 'force-dynamic';
const redirectOptions = { status: 303, headers: { 'Cache-Control': 'private, no-store' } };

export async function GET(request) {
  if (localMemoryEnabled()) return NextResponse.redirect(new URL('/login', request.url), redirectOptions);
  try {
    const code = new URL(request.url).searchParams.get('code');
    if (code) {
      const { error } = await (await authClient()).auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL('/', siteOrigin()), redirectOptions);
      console.error('OAuth callback failed', { code: error.code ?? error.name });
    }
    return NextResponse.redirect(new URL('/login?error=oauth', siteOrigin()), redirectOptions);
  } catch (error) {
    console.error('OAuth callback unavailable', { code: error.code ?? error.name });
    return NextResponse.redirect(new URL('/login?error=config', request.url), redirectOptions);
  }
}
