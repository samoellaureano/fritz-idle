# Fritz em Joinville — A Jornada das Flores

Jogo idle com oito capítulos ilustrados, personagens e pontos de Joinville, pétalas, progresso offline, melhorias, presente diário e prestígio. Cenas e diálogos são ficção; as fontes históricas ficam em `/historia`.

Stack: **Node.js 22+ / Next.js 16 / React 19 / Supabase (Postgres + Google Auth)**. Cada conta tem sua própria jornada, compartilhada entre aparelhos. O servidor calcula todas as recompensas: o navegador não pode gravar um saldo arbitrário.

**Jogar:** https://fritz-idle.onrender.com

**Healthcheck:** https://fritz-idle.onrender.com/api/health

O deploy usa Render Free e Supabase Free. Enquanto o aplicativo OAuth Google estiver em modo **Testing**, apenas as contas cadastradas como usuários de teste podem entrar.

## 1. Criar o Supabase gratuito

1. Em https://supabase.com/dashboard, crie um projeto no plano **Free**. Guarde a senha do banco num gerenciador de senhas; o jogo não precisa dela.
2. No **SQL Editor**, execute [001_game_saves.sql](supabase/migrations/001_game_saves.sql).
3. Em **Project Settings → API / API Keys**, obtenha a URL do projeto, a chave **publishable** (ou `anon`) e a chave secreta de servidor (**secret** ou `service_role`).
4. Copie `.env.example` para `.env.local` e preencha as variáveis. **Nunca envie chaves secretas no chat, no Git ou em variáveis `NEXT_PUBLIC_*`.** O arquivo local é ignorado pelo Git.

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://SEU_PROJETO.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave publishable ou anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave secret ou service_role, exclusiva do servidor |
| `SITE_URL` | Local: `http://localhost:3001`. No Render, pode ficar ausente: o servidor usa a variável confiável `RENDER_EXTERNAL_URL`. Para domínio personalizado, informe sua origem HTTPS exata. |

A tabela usa RLS: usuários autenticados só podem consultar seu próprio save, sem permissão de escrita direta. Somente o servidor grava. Atualizações com controle de versão evitam perda de cliques e duplicação de recompensas em abas/aparelhos simultâneos.

## 2. Configurar o Google

1. Crie um projeto em https://console.cloud.google.com/.
2. Configure **Google Auth Platform / OAuth consent screen**: nome do jogo, público e contato de suporte. Enquanto estiver em modo **Testing**, cadastre os e-mails permitidos em **Test users**.
3. Crie um **OAuth Client ID**, tipo **Web application**.
4. Em **Authorized JavaScript origins**, adicione `http://localhost:3001` e, quando conhecida, a origem HTTPS do Render.
5. Em **Authorized redirect URIs**, adicione **o callback do Supabase**, não o callback do jogo:
   `https://SEU_PROJETO.supabase.co/auth/v1/callback`.
6. No Supabase, em **Authentication → Sign In / Providers → Google**, ative Google e informe Client ID e Client Secret do Google. Não coloque o Client Secret Google no código ou no Render.
7. Em **Authentication → URL Configuration**, defina **Site URL** como a URL do jogo e adicione à lista **Redirect URLs**:
   - `http://localhost:3001/auth/callback`
   - `https://SEU_SERVICO.onrender.com/auth/callback`
8. Use apenas os escopos padrão de identidade (`openid`, `email`, `profile`). Para acesso público fora dos usuários de teste, publique a configuração OAuth e atenda às exigências do Google.

O fluxo usa PKCE e cookies de sessão. O retorno do Supabase vai para `/auth/callback`; páginas e APIs exigem usuário verificado. Ao expirar a sessão, o jogo retorna ao login sem apagar o save.

## 3. Rodar localmente

```powershell
Copy-Item .env.example .env.local
# Preencha .env.local antes de iniciar.
npm ci
npm run dev -- --port 3001
```

Abra http://localhost:3001 e entre com Google. `/historia` contém o diário ilustrado e suas recompensas permanentes.

```powershell
npm test
npm run build
npm start -- --port 3001
```

Os testes locais verificam economia, progresso offline, prestígio, capítulos, isolamento de contas e conflitos simultâneos com um armazenamento em memória. **Não substituem o teste real do OAuth, RLS e Postgres após configurar o Supabase.**

### Save antigo em SQLite

O arquivo local `data/game.db` não é apagado, enviado ou atribuído automaticamente a ninguém. Ele pertencia a uma partida global. Contas Google começam uma nova jornada. Guarde uma cópia segura antes de trocar a versão; uma eventual importação precisa identificar explicitamente o proprietário. O runtime novo não usa SQLite nem disco persistente.

## 4. Deploy no Render Free

1. Publique esta versão no GitHub (commit + push). O Render não recebe mudanças que existem apenas no computador.
2. No Render, escolha **New → Blueprint**, conecte o repositório e use [render.yaml](render.yaml). O serviço está configurado como **free**, sem disco pago.
3. Informe as três variáveis Supabase solicitadas. O Render fornece a URL pública automaticamente em `RENDER_EXTERNAL_URL`; não copie o `SITE_URL` local para produção. Para domínio personalizado, adicione `SITE_URL` com sua origem HTTPS.
4. Confirme a mesma URL na configuração do Supabase e nas origens Google. Se precisar alterar variáveis públicas, faça um novo build/deploy.
5. Build: `npm ci && npm run build`. Start: `npm start -- --hostname 0.0.0.0 --port $PORT`. Node 22.
6. Após o deploy, acesse `/api/health`: deve retornar HTTP 200 e `{"status":"ok"}` sem login.
7. Entre com Google, jogue, saia e entre novamente. Teste também em outro aparelho e com outra conta: o progresso deve persistir por conta, sem compartilhar saldos.
8. Reinicie/redeploy o serviço e confirme a preservação do save. No Supabase, teste com uma chave de usuário que não é possível ler outro `user_id` nem fazer INSERT/UPDATE direto na tabela.

### Healthcheck e cron externo

`GET https://fritz-idle.onrender.com/api/health` é público, sem cache e sem acesso ao banco. Indica apenas que o processo web responde; **não certifica Google/Supabase**, não renova a sessão de login e não altera o progresso.

Em um agendador externo de sua preferência, configure GET nessa URL, por exemplo a cada **10 minutos**, resposta esperada **200**, sem cookies ou credenciais. Um monitor pode ajudar a detectar indisponibilidade, mas **não há garantia de serviço sempre ativo no plano Free**. Respeite as regras e cotas do provedor; o cron não elimina cold starts, suspensões ou limites.

No [cron-job.org](https://console.cron-job.org/jobs), o job **Fritz Idle - Render healthcheck** está habilitado a cada 10 minutos (`*/10 * * * *`), com método GET e histórico de respostas. A execução de teste retornou **200 OK** com `{"status":"ok"}`. Consulte o histórico do job para verificar as execuções agendadas.

O Render Free pode suspender serviços ociosos após 15 minutos e tem cota mensal de horas gratuitas compartilhada pelo workspace (atualmente 750h). Manter vários serviços acordados pode esgotá-la. Supabase Free também possui cotas e pode pausar projetos por inatividade: não dependa de um ping web para evitar isso. Se for necessária disponibilidade garantida, use um plano apropriado. Consulte as regras atuais: [Render Free](https://render.com/docs/free) e [Supabase Pricing](https://supabase.com/pricing).

## Estrutura

- `lib/game.js`: motor puro e regras da jornada.
- `lib/save-store.js`: execução com controle otimista de concorrência.
- `lib/supabase/`: clientes de autenticação e persistência exclusivos do servidor.
- `lib/game-api.js`: autenticação, validação e tratamento das APIs.
- `supabase/migrations/`: esquema e políticas de acesso.
- `app/auth/`: entrada Google, callback e saída.
- `proxy.js`: proteção das páginas e atualização dos cookies.
- `app/api/health/`: liveness independente do banco.
