export function publicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado. Consulte as variáveis de ambiente no README.');
  return { url, key };
}

export function siteOrigin() {
  const configuredOrigin = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL;
  if (!configuredOrigin) throw new Error('SITE_URL não configurada.');
  const site = new URL(configuredOrigin);
  if (site.protocol !== 'https:' && !(site.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(site.hostname))) {
    throw new Error('SITE_URL deve usar HTTPS (exceto no desenvolvimento local).');
  }
  return site.origin;
}

export function sameOrigin(request) {
  return request.headers.get('origin') === siteOrigin();
}
