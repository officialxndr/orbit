/**
 * Drizzle schema for Orbit's local SQLite database. Mirrors the build plan §4.
 * The FTS5 virtual table + sync triggers are created in migrate.ts (Drizzle
 * can't express them). JSON columns use Drizzle's json mode for typed (de)serialization.
 */
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { EntityData, HAAction, ReminderConfig } from '@/domain/types';

export const entities = sqliteTable('entities', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  notes: text('notes'),
  data: text('data', { mode: 'json' }).$type<EntityData>().notNull().default({}),
  parentId: text('parent_id'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  archivedAt: integer('archived_at'),
});

export const links = sqliteTable('links', {
  id: text('id').primaryKey(),
  fromId: text('from_id').notNull(),
  toId: text('to_id').notNull(),
  relation: text('relation'),
  createdAt: integer('created_at').notNull(),
});

export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  entityId: text('entity_id').notNull(),
  kind: text('kind').notNull(),
  config: text('config', { mode: 'json' }).$type<ReminderConfig>().notNull().default({}),
  usesDefault: integer('uses_default', { mode: 'boolean' }).notNull().default(true),
  nextFire: integer('next_fire'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  haAction: text('ha_action', { mode: 'json' }).$type<HAAction | null>(),
  createdAt: integer('created_at').notNull(),
});

export const completions = sqliteTable('completions', {
  id: text('id').primaryKey(),
  entityId: text('entity_id').notNull(),
  date: integer('date').notNull(),
  status: text('status').notNull(),
});

export const contactLog = sqliteTable('contact_log', {
  id: text('id').primaryKey(),
  personId: text('person_id').notNull(),
  contactedAt: integer('contacted_at').notNull(),
  channel: text('channel'),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const schema = { entities, links, reminders, completions, contactLog, settings };
export type DbSchema = typeof schema;
