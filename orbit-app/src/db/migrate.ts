/**
 * Idempotent schema setup. Creates all tables, indexes, the FTS5 search index,
 * and the triggers that keep it in sync. Safe to run on every launch (uses
 * IF NOT EXISTS); PRAGMA user_version is reserved for future ordered migrations.
 */
import { expoDb } from './client';

const SCHEMA_VERSION = 1;

const DDL = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  data TEXT NOT NULL DEFAULT '{}',
  parent_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  relation TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  config TEXT NOT NULL DEFAULT '{}',
  uses_default INTEGER NOT NULL DEFAULT 1,
  next_fire INTEGER,
  enabled INTEGER NOT NULL DEFAULT 1,
  ha_action TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS completions (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  date INTEGER NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_log (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  contacted_at INTEGER NOT NULL,
  channel TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type);
CREATE INDEX IF NOT EXISTS idx_entities_archived ON entities(archived_at);
CREATE INDEX IF NOT EXISTS idx_reminders_next ON reminders(next_fire);
CREATE INDEX IF NOT EXISTS idx_reminders_entity ON reminders(entity_id);
CREATE INDEX IF NOT EXISTS idx_completions_entity ON completions(entity_id);
CREATE INDEX IF NOT EXISTS idx_contactlog_person ON contact_log(person_id);
CREATE INDEX IF NOT EXISTS idx_links_from ON links(from_id);
CREATE INDEX IF NOT EXISTS idx_links_to ON links(to_id);

CREATE VIRTUAL TABLE IF NOT EXISTS entities_fts USING fts5(
  title, notes, content='entities', content_rowid='rowid'
);

CREATE TRIGGER IF NOT EXISTS entities_ai AFTER INSERT ON entities BEGIN
  INSERT INTO entities_fts(rowid, title, notes) VALUES (new.rowid, new.title, new.notes);
END;

CREATE TRIGGER IF NOT EXISTS entities_ad AFTER DELETE ON entities BEGIN
  INSERT INTO entities_fts(entities_fts, rowid, title, notes) VALUES('delete', old.rowid, old.title, old.notes);
END;

CREATE TRIGGER IF NOT EXISTS entities_au AFTER UPDATE ON entities BEGIN
  INSERT INTO entities_fts(entities_fts, rowid, title, notes) VALUES('delete', old.rowid, old.title, old.notes);
  INSERT INTO entities_fts(rowid, title, notes) VALUES (new.rowid, new.title, new.notes);
END;
`;

let migrated = false;

export async function runMigrations(): Promise<void> {
  if (migrated) return;
  await expoDb.execAsync(DDL);
  await expoDb.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  migrated = true;
}
