import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { publicConfig } from './lib/supabase/config';

export async function proxy(request) {
  let response = NextResponse.next({ request });
  try {
    const { url, key } = publicConfig();
    const client = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data: { user }, error } = await client.auth.getUser();
    if (error && error.name !== 'AuthSessionMissingError') {
      console.error('Session verification failed', { code: error.code ?? error.name });
    }
    if (!user || error) {
      const redirect = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
      redirect.headers.set('Cache-Control', 'private, no-store');
      return redirect;
    }
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  } catch (error) {
    console.error('Session unavailable', { code: error instanceof Error ? error.name : 'unknown' });
    return NextResponse.redirect(new URL('/login?error=config', request.url), { headers: { 'Cache-Control': 'private, no-store' } });
  }
}

export const config = { matcher: ['/', '/historia/:path*'] };
