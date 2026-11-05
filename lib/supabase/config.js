export function publicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado. Consulte as variáveis de ambiente no README.');
  return { url, key };
}

export function siteOrigin() {
  if (!process.env.SITE_URL) throw new Error('SITE_URL não configurada.');
  const site = new URL(process.env.SITE_URL);
  if (site.protocol !== 'https:' && !(site.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(site.hostname))) {
    throw new Error('SITE_URL deve usar HTTPS (exceto no desenvolvimento local).');
  }
  return site.origin;
}

export function sameOrigin(request) {
  return request.headers.get('origin') === siteOrigin();
}
