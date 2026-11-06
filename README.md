# Fritz em Joinville — A Jornada das Flores

Jogo idle com 17 trilhas e 58 capítulos ilustrados, personagens, lugares de Joinville, pétalas, sementes, progresso offline, melhorias, presente diário e novas eras. Cenas e diálogos são ficção; as fontes históricas ficam em `/historia`.

As narrativas distinguem os fatos locais das invenções do diário de Fritz. Dona Francisca não visitou Joinville nem morou no Palácio dos Príncipes; a carta da aventura é imaginada, não uma peça do acervo. As trilhas de bicicletas, ofícios e lugares combinam referências documentadas com cenas lúdicas, sem alterar desbloqueios ou recompensas já guardadas.

As 17 jornadas têm aventuras contínuas com linguagem infantil, pequenas pistas e desfechos: as flores recuperam oito cores do diário, as bicicletas entregam flores sem deixar ninguém para trás e os ofícios ajudam a montar um carrinho de papel. Cada trilha de lugar tem seu próprio desafio, sem exigir concluir outra jornada. O contexto histórico com fontes fica separado da brincadeira; não há coleta de peças reais, uso de máquinas pelas crianças ou novas exigências de progresso. Releituras mostram os textos novos sem repetir recompensas.

Os botões de capítulo anterior e próximo levam ao início da história selecionada, mostrando primeiro sua ilustração, com rolagem suave ou imediata conforme a preferência por movimento reduzido.

### Identidade ilustrada

Logo, favicon, avatares, recursos, lugares, melhorias, conquistas, museu e cartão de compartilhamento usam 52 miniaturas originais em WebP (256 × 256), com o mesmo traço pictórico, luz dourada e paleta das jornadas. Fritz mantém o lenço vermelho, a mochila e os olhos âmbar. Os retratos são interpretações lúdicas, não retratos documentais das pessoas reais. Os cartões das jornadas continuam apenas com suas capas, sem ícones extras.

As referências visuais consultadas incluem a [Rua das Palmeiras e o Museu da Imigração](https://www.visitejoinville.com.br/turismoemjoinville/rua-das-palmeiras-e-museu-da-imigracao), o [Pórtico da Rua XV e o Moinho da Expoville](https://www.visitejoinville.com.br/en/turismoemjoinville/portico-da-rua-xv-e-complexo-expoville) e o [Memorial da Bicicleta](https://www.joinville.sc.gov.br/institucional/secult/upm/eme/). As artes reinterpretam elementos locais, sem reproduzir fotos, brasões ou marcas comerciais, e não são reproduções arquitetônicas exatas.

As trilhas jogáveis ficam em `/historia?jornada=flores`, `/historia?jornada=bicicletas` e `/historia?jornada=industria`: oito capítulos das flores, três das bicicletas e cinco dos ofícios, com ilustrações originais próprias e fatos históricos com fontes em cada capítulo. Cada capítulo é liberado por pétalas históricas e rende uma recompensa única de pétalas, +2% de produção permanente e XP na era em que foi guardado. Releituras não repetem recompensas.

### Trilhas dos lugares

Em `/historia#trilhas-dos-lugares`, um único catálogo exibe as três jornadas principais e as **14 jornadas de lugares, com três capítulos cada**, lado a lado no desktop e em coluna no celular. Todos os cartões usam miniaturas, sem ícones adicionais, seção recolhível ou rolagem interna. Cada trilha tem uma ilustração original, começo, desenvolvimento e desfecho. As 17 jornadas compartilham a direção de arte da Jornada das Flores: pintura detalhada, luz acolhedora e Fritz com lenço vermelho e mochila. Bicicletas, ofícios e lugares usam 22 cenas próprias em WebP otimizado, tanto na leitura quanto nas capas do catálogo; são interpretações ficcionais, não reproduções documentais dos lugares. Nas novas jornadas, é preciso atingir o total de pétalas históricas indicado **e guardar a lembrança anterior**; a sequência é validada pelo servidor. As três jornadas anteriores mantêm seus desbloqueios originais. Capítulos fechados mostram uma prévia ilustrada sem revelar a narrativa. Histórias guardadas, bônus e conclusão das trilhas sobrevivem às novas eras, sem repetir recompensas ou XP.

| Jornada | Link |
|---|---|
| Rua das Palmeiras e Museu Nacional de Imigração e Colonização | `/historia?jornada=palmeiras-imigracao` |
| Catedral de Joinville | `/historia?jornada=catedral` |
| Mercado Público Municipal | `/historia?jornada=mercado-publico` |
| Monumento a Barca | `/historia?jornada=monumento-barca` |
| Museu Arqueológico de Sambaqui | `/historia?jornada=sambaqui` |
| Escola do Teatro Bolshoi | `/historia?jornada=escola-bolshoi` |
| O Farol | `/historia?jornada=o-farol` |
| Empadas Jerke | `/historia?jornada=empadas-jerke` |
| Instituto Juarez Machado | `/historia?jornada=instituto-juarez` |
| Museu de Arte e Cidadela Cultural Antárctica | `/historia?jornada=museu-arte` |
| Casa da Memória e Cemitério dos Imigrantes | `/historia?jornada=cemiterio-imigrantes` |
| Sociedade Harmonia Lyra | `/historia?jornada=harmonia-lyra` |
| Deutsche Schule | `/historia?jornada=deutsche-schule` |
| Opa Jerke | `/historia?jornada=opa-jerke` |

As narrativas são ficção original de Fritz, não transcrições dos roteiros turísticos nem depoimentos de pessoas reais. Cada capítulo separa um contexto factual com fonte do Visite Joinville. O Farol é retratado como edifício urbano ligado à inovação, não como farol marítimo; os povos dos sambaquis são reconhecidos como anteriores à colonização europeia. Não há coleta de objetos de acervos, sítios ou memoriais, nem incentivo ao consumo de álcool. As menções não indicam patrocínio, endosso ou garantia de visitação. As novas trilhas são narrativas: não adicionam geradores nem alteram custos dos lugares existentes, e os saves atuais continuam compatíveis sem migração de banco.

Os 13 lugares estão agrupados pelas três jornadas originais e **produzem pétalas**, preservando seus IDs, custos e taxas-base. O botão **max** compra, numa única operação, todas as unidades que o saldo comporta, respeitando o custo arredondado individual de cada unidade. O saldo de pétalas aparece também em um contador compacto fixo durante a rolagem. Jogo, diário, ranking e cartão de compartilhamento usam a mesma abreviação numérica: `mil`, `mi`, `bi`, `tri`, `quad`, `quint`, `sext`, `sept`, `oct`, `non` e `dec`. Acima dessas unidades, usam notação científica compacta (por exemplo, `1,23e36`). No diário, o saldo fica numa pequena cápsula; o valor completo está disponível ao focar ou passar o cursor.

### Museu e novas eras

Na aba **Museu e eras**, sete miniaturas fictícias originais podem ser adquiridas uma única vez com **Pórticos**: Roda da Memória (1), bicicleta (1), tear (1,5), engrenagem (2), caderno do aprendiz (2,5), geladeira (3) e parafuso (4). O acervo completo custa **15 Pórticos**, em vez de 43. As peças dão bônus próprios permanentes de produção e toques. Suas insígnias aparecem ao lado do apelido no ranking e nas mensagens, além do perfil. O museu tem fontes históricas; não representa acervos reais, produtos oficiais ou patrocínios.

Há uma única troca de era, simbolizada pelo **Pórtico de Joinville**, liberada no **nível 20 de jornada**. A recompensa é `nível / 20`, permitindo frações: nível 20 = 1 Pórtico, 30 = 1,5, 40 = 2. Cada Pórtico disponível soma +10% de produção; gastar no museu remove esse bônus da moeda e adiciona o bônus permanente da peça. O saldo de Pórticos é o primeiro critério do ranking e acompanha o avatar. A Roda da Memória é somente uma peça do museu, não uma moeda de reinício.

O reset mostra a prévia/perdas e exige clicar em **Confirmar redefinição**, sem digitar uma palavra. É possível cancelar antes da confirmação. Zera saldos de pétalas e sementes, lugares, melhorias, personagens contratados, viveiro e XP da era. **Preserva** pétalas históricas, personagens encontrados, capítulos e seus bônus, conquistas já obtidas, museu, Pórticos, cliques históricos, identidade e mensagens. Os intervalos do presente diário e do compartilhamento não reiniciam, nem a duração do buff. Há uma celebração do Fritz que respeita a preferência por movimento reduzido.

XP e nível são calculados exclusivamente no servidor:

```
XP = 0.6 * log2(1 + petalasDaEra / 1000)
   + min(3, 0.1 * novasHistoriasDaEra)
   + min(2, 0.25 * log2(1 + lugaresCompradosNaEra))
   + min(1, 0.1 * niveisDeMelhorias)
   + 0.75 * personagensContratados
   + min(0.5, 0.05 * log2(1 + toquesNaEra))
   + min(0.5, 0.25 * insigniasAdquiridasNaEra)
nivel = 1 + floor(XP)
porticosNaTroca = nivel >= 20 ? nivel / 20 : 0
```

Os limites equilibram a contribuição de leitura, compras e cliques sem permitir que substituam toda a economia. Todas as histórias continuam dando sua recompensa de pétalas e +2% de produção, mesmo após os 3 XP de leitura. Personagens contratados têm mais peso; pétalas continuam contribuindo sem teto, permitindo avançar mesmo sem novas histórias em eras seguintes. Não existe requisito adicional de contratação para reiniciar: o nível 20 continua sendo a única condição, e o alinhamento com a automação é resultado dos pesos, não uma trava oculta.

Na simulação de referência, o primeiro Pórtico libera em **46m40** para o leitor com cliques e **56min** sem cliques, depois de experimentar o viveiro e contratar outro personagem. Duas sessões de 20 minutos por dia mantêm a conclusão das histórias, lugares e personagens em **24h18 corridas**. Desenvolver todos esses objetivos a cada era e comprar insígnias conforme o saldo permite completar o museu em **12 eras** na simulação; reiniciar sempre no nível 20 exige **15 eras**. Essas são estratégias medidas, não mínimos garantidos nem prazos universais.

O rebalanceamento recalcula o nível da era atual com os novos pesos, podendo reduzi-lo; não remove saldos, Pórticos já ganhos, histórias, peças adquiridas ou seus bônus. Os preços menores valem para próximas compras; compras anteriores não são cobradas novamente nem reembolsadas.

Saves antigos são migrados no primeiro acesso: Rodas já recebidas viram Pórticos 1:1, sem perder museu, sementes, histórias ou saldos. O contador existente de pétalas/compras da era é respeitado; na ausência dele, usam-se pétalas históricas e lugares ativos. Histórias existentes inicializam o XP de leitura somente na migração; depois da troca não contam de novo. Conquistas detectáveis antes do reset são guardadas permanentemente. Mutações usam CAS; o número esperado da era impede repetir a troca entre abas/dispositivos. `/api/prestige` agora rejeita o antigo reset por sementes, sem alterar o save.

### Equipamentos criativos para Fritz

Além das quatro melhorias originais, há seis equipamentos, todos com até cinco níveis e custo multiplicado por 2,8 por nível. Seus bônus são somados aos da mesma categoria e reiniciam na troca de era:

| Equipamento | Primeiro nível (pétalas) | Bônus por nível |
|---|---:|---|
| Capa de chuva florida | 6.500 | +2 pétalas por toque |
| Cestinha de descobertas | 25.000 | +25% no valor dos toques |
| Campainha das flores | 150.000 | +10% na produção dos lugares |
| Café para o caminho | 750.000 | +30 minutos de progresso offline |
| Regador de afetos | 6.000.000 | +15% na produção dos lugares |
| Bolsa de futuros jardins | 1.000.000.000 | +10% de sementes dos personagens |

A bolsa não cria sementes sozinha: exige viveiro e personagens ativos. Seu bônus também vale offline e combina com o compartilhamento. Os equipamentos de toque também melhoram os toques automáticos dos personagens, sem contar como cliques manuais. O progresso offline tem um limite diário de 5 horas, reiniciado à meia-noite UTC; Brisa da Babitonga acrescenta 1 hora por nível e Café para o caminho, 30 minutos por nível. O contador considera apenas o tempo creditado enquanto o jogador esteve ausente. O XP de melhorias continua limitado a 1, evitando antecipar eras apenas pela quantidade de equipamentos.

Nos lugares, o botão **max xN** mostra quantas unidades cabem nas pétalas disponíveis, atualizando com a produção. A prévia soma os mesmos custos arredondados por unidade usados pelo servidor; o total final é confirmado ao comprar e pode crescer com novas pétalas ou mudar se outra aba gastar o saldo. Sem saldo para uma unidade, mostra **max x0** desabilitado. O logo próprio do Fritz, com sorriso e uma flor, acompanha os cabeçalhos do jogo, diário, perfil, mural e o ícone da aba.

O rendimento “pétalas/s cada” de cada lugar mostra a produção efetiva por unidade, incluindo melhorias, personagens, histórias, museu, Pórticos disponíveis e compartilhamento ativo. Os toques automáticos dos personagens entram somente na produção total, não no rendimento individual dos lugares.

As dicas de recursos, rendimento, compra máxima, capítulos, Pórticos e insígnias usam tooltips no visual do jogo, exibidos após 600 ms com o cursor sobre o elemento ou imediatamente ao focar pelo teclado. Sair antes desse tempo cancela a abertura. Escape fecha a dica; ao rolar, dicas do cursor fecham e as de foco acompanham o elemento enquanto estiver visível. O texto fica limitado à largura da tela e pode ser alcançado com o cursor sem desaparecer.

### Sementes e personagens

Ao recuperar **500 milhões de pétalas na era**, o **Viveiro dos personagens** fica disponível na aba Personagens por **500 milhões de pétalas disponíveis**. O saldo histórico de outras eras não libera a compra. Fritz entra automaticamente e gera 1 semente/minuto. Sementes não dão mais bônus de produção por saldo e não são usadas no museu: acumulam como recurso e contratam os outros personagens encontrados.

| Personagem | Custo em sementes | Sementes/min | Bônus de pétalas | Toques automáticos/s |
|---|---:|---:|---:|---:|
| Fritz | Incluído | 1 | +10% | 0 |
| Dona Francisca | 5 | 2 | +20% | 0,2 |
| Fritz Alt | 15 | 3 | +30% | 0,4 |
| Juarez Machado | 40 | 4 | +40% | 0,6 |
| Schwanke | 100 | 5 | +50% | 0,8 |
| Eduarda Henklein | 250 | 6 | +60% | 1 |

Personagens são contratados uma vez por era. Os bônus somam-se aos dos lugares, histórias e museu. Toques automáticos rendem pétalas sem inflar o contador de cliques manuais; sementes e pétalas respeitam o mesmo limite offline. Encontrar personalidades ainda dá os bônus originais de +5%; contratação é uma etapa separada e reinicia na era seguinte.

### Compartilhar a jornada

No mural, o cartão PNG é desenhado localmente, com arte original, apelido público, progresso, insígnias e uma breve descrição do jogo. A arte e o texto usam sempre o link público `https://fritzidle.com.br`, nunca o IP ou endereço local do navegador. Pode ser compartilhado pelo menu do dispositivo quando suportado, ou baixado com uma descrição para copiar. Compartilhar/exportar concede **+20% de pétalas e sementes por 30 minutos, uma vez a cada 24 horas**. Cancelar o menu não solicita bônus. Não se verifica a publicação na rede social, e nenhum dado Google é incluído.

A duração é calculada no servidor e não se estende ao ficar offline, voltar ao jogo ou trocar de era. O ganho offline integra apenas a interseção entre o intervalo creditado e a duração real do bônus.

O jogo mostra uma estimativa agregada de jogadores ativos, atualizada enquanto a página está visível. Ela conta contas autenticadas com atividade recente, sem exibir nomes ou identificadores.

Stack: **Node.js 22+ / Next.js 16 / React 19 / Supabase (Postgres + Google Auth)**. Cada conta tem sua própria jornada, compartilhada entre aparelhos. O servidor calcula todas as recompensas: o navegador não pode gravar um saldo arbitrário.

**Jogar:** https://fritzidle.com.br

**Healthcheck:** https://fritzidle.com.br/api/health

O deploy usa Render Free e Supabase Free. Enquanto o aplicativo OAuth Google estiver em modo **Testing**, apenas as contas cadastradas como usuários de teste podem entrar.

## Validação local sem Supabase

Execute `npm run dev:local` e abra http://localhost:3001/login. Clique em **Entrar como Fritz_Teste**: o usuário de teste já tem perfil e começa **do zero**, sem pétalas, sementes, histórias, museu ou personagens contratados. Não é preciso criar uma conta Google, configurar chaves ou alterar o banco de produção.

Neste modo, sessão, progresso, perfil, ranking e mensagens ficam **somente na memória do processo Node**. O jogo usa as mesmas regras, validações, recompensas e controle de concorrência da versão com Supabase. Recarregar a página, navegar entre telas ou sair/entrar preserva o progresso enquanto o servidor continua ativo. As abas que entrarem como usuário de teste compartilham a mesma partida. O mural mostra apenas os perfis e mensagens locais, nunca jogadores reais.

Para recomeçar do zero, encerre o comando e execute `npm run dev:local` novamente. Reiniciar o processo descarta todos os dados e sessões; a recarga de código em desenvolvimento normalmente mantém a memória. Um aviso em todas as telas identifica o ambiente de teste.

O comando restringe o servidor a `127.0.0.1:3001`, fixa `SITE_URL=http://localhost:3001`, ativa `FRITZ_LOCAL_MEMORY=1` somente em `NODE_ENV=development` e esvazia as credenciais Supabase no processo filho. A sessão de teste usa cookie HttpOnly, expira em 12 horas e é revogada ao sair. `/auth/local` não está disponível em produção; mesmo que a flag seja definida por engano, o modo de memória permanece desativado em `NODE_ENV=production`.

**Produção continua usando Supabase + Google**, sem alteração no Render ou nas migrações. `npm run dev` também mantém o fluxo Supabase normal. Não execute dois servidores Next ao mesmo tempo na mesma pasta de build; encerre o servidor local antes de `npm run build`.

Testes unitários: `npm test`. Para validar as APIs contra o servidor de memória já iniciado: `$env:FRITZ_LOCAL_TESTS='1'; node --test tests\local-memory.integration.test.mjs` (PowerShell). Esse teste usa e modifica apenas a partida local; depois, reinicie o servidor para voltar ao zero.

### Validação da progressão e da cadência

`node --test tests\progression-cadence.test.mjs tests\era-progression-flow.test.mjs` simula partidas com relógio controlado, sem esperar horas reais e sem injetar saldo na partida. Cobre os 58 capítulos, 13 lugares, seis personagens, viveiro, ganho offline, compartilhamento, novas eras e a compra das sete peças do museu com Pórticos efetivamente conquistados.

O modelo compara leitura de 45–60 segundos por capítulo, até dois cliques por segundo nos primeiros dez minutos de atividade (fora da leitura), presente diário e compras por retorno de produção. Também cobre quem não lê, quem não clica, quem não usa o presente e sessões espaçadas. A duração de leitura é uma hipótese da simulação, não uma trava do jogo. O cenário casual de referência é **duas sessões de 20 minutos por dia**, com meta de concluir a primeira jornada em **24–48 horas corridas**; o museu completo é uma progressão separada. Isso não garante duração mínima para quem joga continuamente ou lê mais rápido.

Para validar as APIs reais locais de progresso: `$env:FRITZ_LOCAL_TESTS='1'; node --test tests\progression-runtime.integration.test.mjs`. O teste exige a tela de login em memória e rejeita outro ambiente. Ele altera apenas o usuário local: resgata presentes disponíveis, lê capítulo, compra melhoria/lugares, coleta pétalas e ativa o bônus de compartilhamento. Não execute junto com outra validação que dependa do saldo ou dos intervalos desse usuário.

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
   - `https://fritz-idle.onrender.com/auth/callback`
   - `https://fritzidle.com.br/auth/callback`
8. Use apenas os escopos padrão de identidade (`openid`, `email`, `profile`). Para acesso público fora dos usuários de teste, publique a configuração OAuth e atenda às exigências do Google.

O fluxo usa PKCE e cookies de sessão. O retorno do Supabase vai para `/auth/callback`; páginas e APIs exigem usuário verificado. Ao expirar a sessão, o jogo retorna ao login sem apagar o save.

### Apelido, avatar e comunidade

Execute também [002_community.sql](supabase/migrations/002_community.sql) no SQL Editor **antes de publicar esta versão**. Ela adiciona perfis, mensagens e a visão de ranking sem alterar os saves existentes. Não execute novamente uma migração já aplicada.

Depois, aplique [003_memory_wheels.sql](supabase/migrations/003_memory_wheels.sql) e [004_porticos_and_badges.sql](supabase/migrations/004_porticos_and_badges.sql), nessa ordem, **antes de publicar esta versão**. A quarta migração acrescenta Pórticos fracionários e insígnias à visão de ranking, mantém o acesso exclusivo do servidor e não redefine nenhum save. Se as três primeiras já estão aplicadas, execute apenas a quarta. Os campos antigos da visão são preservados para compatibilidade durante o deploy.

No primeiro acesso sem perfil (inclusive para contas antigas), `/perfil` solicita um apelido único de 3 a 24 letras/números, hífen ou sublinhado, e um avatar. Maiúsculas/minúsculas não distinguem apelidos; acentos distinguem. Os retratos são releituras lúdicas originais de Dona Francisca, Fritz Alt, Juarez Machado e Schwanke, além do Fritz fictício. O perfil pode ser editado posteriormente sem reiniciar a partida.

Ao salvar o perfil, a participação no `/mural` é automática e informada na tela. Apenas jogadores autenticados podem ver apelidos, avatares e progresso; nomes Google, e-mails e IDs de autenticação não são publicados. O ranking exibe as primeiras 50 jornadas, ordenadas por **Pórticos disponíveis → sementes disponíveis → histórias concluídas → pétalas históricas**, com desempate por antiguidade do perfil e ID público. A posição do próprio jogador também aparece fora do top 50. O perfil mostra também insígnias, nível e conquistas. O progresso é o último salvo pelo servidor, não uma estimativa offline dos demais jogadores.

O feed mostra as 50 mensagens mais recentes, com incentivos prontos ou texto personalizado de até 160 caracteres. O intervalo de 60 segundos é transacional no Postgres (também entre abas/aparelhos); excluir uma mensagem não elimina o intervalo. Só o autor pode excluir suas mensagens. Mensagens são texto simples, não HTML. Não publique dados pessoais. Esta versão não oferece moderação automática: revise a necessidade de denúncia/moderação antes de abrir o jogo a um público amplo.

Perfis, ranking e mensagens não têm acesso direto por chaves anon/authenticated. As APIs verificam a conta e a origem das mutações e usam o cliente exclusivo do servidor. O ranking lê o save autoritativo; campos de pontuação não são aceitos pelo cadastro.

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

Os testes locais verificam economia, progresso offline, Pórticos fracionários, reset, personagens, compra max, trilhas, buffs temporizados, isolamento de contas e conflitos simultâneos com um armazenamento em memória. **Não substituem o teste real do OAuth, RLS e Postgres após configurar o Supabase.**

Os testes de integração da comunidade e progressão também estão ligados ao `npm test`, mas ficam ignorados por padrão: criam contas temporárias no Supabase configurado e as apagam com seus perfis, saves e mensagens ao terminar. Execute apenas com autorização no projeto de destino e com as cinco migrações aplicadas. Em um terminal separado, inicie o build de produção na porta de teste:

```powershell
npm run build
$env:SITE_URL = 'http://localhost:3002'
npm start -- --hostname 127.0.0.1 --port 3002
```

Em outro terminal, com `.env.local` configurado:

```powershell
$env:FRITZ_CLOUD_TESTS = '1'
npm test
```

Para incluir o fluxo de navegador (onboarding, jogo, diário, mensagens e larguras de 320 a 1280px), use uma instalação existente do Playwright e Microsoft Edge:

```powershell
$env:FRITZ_CLOUD_TESTS = '1'
$env:FRITZ_BROWSER_TESTS = '1'
$env:FRITZ_PLAYWRIGHT_MODULE = 'C:\caminho\para\node_modules\playwright'
npm test
```

Esses testes usam sessões de contas sintéticas verificadas; a entrada Google real continua exigindo validação manual. O destino HTTP dos testes é restrito a localhost na porta 3002, nunca ao site público.

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

### Domínio fritzidle.com.br

O Blueprint declara `fritzidle.com.br`; o Render também cria `www.fritzidle.com.br`, redirecionando para o domínio sem www, e emite os certificados HTTPS após verificar o DNS.

No DNS avançado do Registro.br:

| Tipo | Nome | Destino |
|---|---|---|
| A | Raiz (nome vazio) | `216.24.57.1` |
| CNAME | `www` | `fritz-idle.onrender.com` |

Após a propagação e a confirmação do certificado no Render, defina `SITE_URL=https://fritzidle.com.br` no serviço e confirme o mesmo Site URL no Supabase, com `https://fritzidle.com.br/auth/callback` autorizado. Não troque a origem de produção antes de o domínio responder por HTTPS, para evitar interromper o login. O endereço `onrender.com` continua disponível durante a transição.

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
