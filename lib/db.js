import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const globalForDb = globalThis;

function createDb() {
  return new Database(path.join(dataDir, 'game.db'));
}

function initializeDb(db) {
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS player (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      coins REAL NOT NULL DEFAULT 0,
      total_clicks INTEGER NOT NULL DEFAULT 0,
      last_update INTEGER NOT NULL,
      lifetime REAL NOT NULL DEFAULT 0,
      seeds INTEGER NOT NULL DEFAULT 0,
      last_daily INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS generators (
      id TEXT PRIMARY KEY,
      owned INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS upgrades (
      id TEXT PRIMARY KEY,
      owned INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS story_memories (
      chapter_id TEXT PRIMARY KEY,
      read_at INTEGER NOT NULL
    );
  `);

  const playerColumns = new Set(db.pragma('table_info(player)').map((column) => column.name));
  if (!playerColumns.has('lifetime')) {
    db.exec('ALTER TABLE player ADD COLUMN lifetime REAL NOT NULL DEFAULT 0');
    db.exec('UPDATE player SET lifetime = coins WHERE id = 1');
  }
  if (!playerColumns.has('seeds')) {
    db.exec('ALTER TABLE player ADD COLUMN seeds INTEGER NOT NULL DEFAULT 0');
  }
  if (!playerColumns.has('last_daily')) {
    db.exec('ALTER TABLE player ADD COLUMN last_daily INTEGER NOT NULL DEFAULT 0');
  }

  db.prepare(
    'INSERT OR IGNORE INTO player (id, coins, total_clicks, last_update) VALUES (1, 0, 0, ?)'
  ).run(Date.now());

  return db;
}

export const db = initializeDb(globalForDb.__fritzDb ?? createDb());
if (process.env.NODE_ENV !== 'production') globalForDb.__fritzDb = db;
