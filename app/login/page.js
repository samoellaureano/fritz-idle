import { publicConfig, siteOrigin } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }) {
  const query = await searchParams;
  let configured = true;
  try {
    publicConfig();
    siteOrigin();
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) configured = false;
  } catch {
    configured = false;
  }
  const message = !configured || query.error === 'config'
    ? 'A jornada está aguardando a configuração do Supabase e do Google. Siga o guia de instalação do projeto.'
    : query.error
      ? 'Não foi possível entrar com o Google. Tente novamente e confira se sua conta está autorizada no projeto.'
      : '';
  return (
    <main className="login-screen">
      <section className="login-card">
        <img src="/fritz-joinville.jpg" alt="Fritz recebe você em uma Joinville florida" width="640" height="360" />
        <div className="login-copy">
          <span className="eyebrow">FRITZ EM JOINVILLE</span>
          <h1>Sua jornada merece criar raízes.</h1>
          <p>Entre com o Google para guardar suas pétalas, histórias e conquistas na sua conta, e continuar de onde parou em outro aparelho.</p>
          {message && <p className="error-banner" role="alert">{message}</p>}
          <form action="/auth/google" method="post">
            <button className="story-button" disabled={!configured} type="submit">Entrar com Google</button>
          </form>
          <p className="login-note">Seu progresso é individual. Usamos a autenticação do Google pelo Supabase; o jogo nunca recebe sua senha Google.</p>
        </div>
      </section>
    </main>
  );
}
