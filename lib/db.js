import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const globalForDb = globalThis;

function createDb() {
  const db = new Database(path.join(dataDir, 'game.db'));
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS player (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      coins REAL NOT NULL DEFAULT 0,
      total_clicks INTEGER NOT NULL DEFAULT 0,
      last_update INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS generators (
      id TEXT PRIMARY KEY,
      owned INTEGER NOT NULL DEFAULT 0
    );
  `);

  db.prepare(
    'INSERT OR IGNORE INTO player (id, coins, total_clicks, last_update) VALUES (1, 0, 0, ?)'
  ).run(Date.now());

  return db;
}

export const db = globalForDb.__fritzDb ?? createDb();
if (process.env.NODE_ENV !== 'production') globalForDb.__fritzDb = db;
