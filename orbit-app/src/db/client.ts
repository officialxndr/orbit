/**
 * Opens the on-device SQLite database and wraps it with Drizzle. The raw
 * `expoDb` handle is exported too for FTS queries and migrations that Drizzle
 * can't express.
 */
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { schema } from './schema';

export const DB_NAME = 'orbit.db';

export const expoDb = SQLite.openDatabaseSync(DB_NAME);

export const db = drizzle(expoDb, { schema });

export type Database = typeof db;
