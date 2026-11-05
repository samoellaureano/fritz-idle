import { publicConfig, siteOrigin } from '@/lib/supabase/config';
import { localMemoryEnabled } from '@/lib/local-mode';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }) {
  const query = await searchParams;
  const local = localMemoryEnabled();
  if (local) return (
    <main className="login-screen">
      <section className="login-card">
        <img src="/fritz-joinville.jpg" alt="Fritz recebe você em uma Joinville florida" width="640" height="360" />
        <div className="login-copy">
          <span className="eyebrow">VALIDAÇÃO LOCAL · BANCO EM MEMÓRIA</span>
          <h1>Um jardim de teste, só neste computador.</h1>
          <p>Entre como <strong>Fritz_Teste</strong> para validar a progressão desde o início, sem Google e sem acessar o Supabase.</p>
          <p className="login-note">Pétalas, sementes, histórias e conquistas começam do zero. Perfil, progresso e mural são compartilhados entre as abas deste servidor local, mas nunca são enviados para produção.</p>
          <form action="/auth/local" method="post"><button className="story-button" type="submit">Entrar como Fritz_Teste</button></form>
          <p className="login-note">Os dados ficam apenas na memória. Recarregar a página ou sair da conta não apaga o progresso; encerrar e iniciar o servidor novamente cria um teste novo do zero.</p>
        </div>
      </section>
    </main>
  );
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
          <p className="login-note">Na primeira visita, escolha seu apelido e avatar. Eles acompanham sua jornada e aparecem no mural da cidade junto com seu progresso — nunca seu e-mail Google.</p>
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
