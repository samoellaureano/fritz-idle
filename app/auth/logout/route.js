import { NextResponse } from 'next/server';
import { authClient } from '@/lib/supabase/server';
import { sameOrigin, siteOrigin } from '@/lib/supabase/config';

export async function POST(request) {
  try {
    if (!sameOrigin(request)) return new NextResponse('Origem não autorizada.', { status: 403 });
    const { error } = await (await authClient()).auth.signOut({ scope: 'local' });
    if (error) throw error;
    return NextResponse.redirect(new URL('/login', siteOrigin()), { status: 303, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Logout failed', { code: error.code ?? error.name });
    return new NextResponse('Não foi possível sair. Volte e tente novamente.', { status: 503 });
  }
}
