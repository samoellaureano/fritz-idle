# Fritz em Joinville — A Jornada das Flores

Stack: **Node.js + Next.js (App Router) + SQLite3 (better-sqlite3)**

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No jogo, você recolhe pétalas da Cidade das Flores, ativa lugares conhecidos de Joinville, encontra personagens ligados à história local, completa conquistas e planta Sementes da Cidade para reiniciar com um bônus permanente.

Acesse `/historia` para ler os oito capítulos ilustrados de Fritz. As referências externas de cada capítulo documentam a memória local; cenas e diálogos são ficção. Guarde cada lembrança no diário para receber pétalas e +2% de produção permanente sem reiniciar sua partida.

O banco é criado automaticamente em `data/game.db`. O progresso antigo, os cliques e os geradores já comprados são preservados na atualização. A jornada inclui progresso offline, presente diário, melhorias, personagens colecionáveis, conquistas, lembranças narrativas e prestígio.

## Estrutura

- `lib/db.js` — conexão SQLite e criação das tabelas
- `lib/game.js` — regras do jogo (geradores, custos, progresso offline)
- `app/api/game` — GET: estado atual (aplica progresso offline)
- `app/api/click` — POST: clique manual
- `app/api/buy` — POST: compra de gerador
- `app/page.js` — interface

## Deploy no Render

O `render.yaml` já está configurado (Blueprint). O SQLite fica em um disco persistente
montado em `/var/data` (variável `DATA_DIR`). Discos exigem plano pago (`starter`) e
limitam o serviço a 1 instância — o que é o ideal para SQLite.

1. Suba o projeto para o GitHub/GitLab/Bitbucket.
2. Acesse https://dashboard.render.com/blueprint/new?repo=URL_DO_SEU_REPOSITORIO
3. Clique em **Apply**.
