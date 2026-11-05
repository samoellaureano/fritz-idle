# Jogo Idle do Fritz

Stack: **Node.js + Next.js (App Router) + SQLite3 (better-sqlite3)**

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

O banco é criado automaticamente em `data/game.db`.

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
