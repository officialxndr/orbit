/**
 * Drizzle + expo-sqlite implementation of OrbitRepository. Drizzle handles the
 * typed CRUD and JSON (de)serialization; raw SQL is used only for the FTS5
 * search join. All next_fire values are kept current via recompute helpers.
 */
import { and, asc, desc, eq, inArray, isNull, or } from 'drizzle-orm';
import { db, expoDb } from '@/db/client';
import { completions, contactLog, entities, links, reminders, settings } from '@/db/schema';
import { runMigrations } from '@/db/migrate';
import { computeNextFire, DEFAULT_CONFIGS, resolveConfig } from '@/domain/reminderConfig';
import { startOfDay } from '@/lib/datetime';
import { newId } from '@/lib/id';
import type {
  Completion,
  ContactChannel,
  ContactLogEntry,
  Entity,
  Link,
  Reminder,
  ReminderConfig,
  ReminderKind,
} from '@/domain/types';
import type {
  CreateEntityInput,
  CreateReminderInput,
  EntityFilter,
  EntityPatch,
  OrbitRepository,
  ReminderPatch,
  StreakStats,
} from './repository';

const DAY_MS = 24 * 60 * 60 * 1000;

class SqliteRepository implements OrbitRepository {
  async init(): Promise<void> {
    await runMigrations();
  }

  /** Wipe all user data. Entities are deleted last so FTS sync triggers fire. Settings/defaults are kept. */
  async clearAll(): Promise<void> {
    db.delete(reminders).run();
    db.delete(links).run();
    db.delete(completions).run();
    db.delete(contactLog).run();
    db.delete(entities).run();
  }

  // ---- Entities ---------------------------------------------------------
  async listEntities(filter?: EntityFilter): Promise<Entity[]> {
    const conds = [];
    if (filter?.type && filter.type !== 'all') conds.push(eq(entities.type, filter.type));
    if (!filter?.includeArchived) conds.push(isNull(entities.archivedAt));
    const where = conds.length ? and(...conds) : undefined;
    return db.select().from(entities).where(where).orderBy(desc(entities.updatedAt)).all() as Entity[];
  }

  async getEntity(id: string): Promise<Entity | null> {
    return (db.select().from(entities).where(eq(entities.id, id)).get() as Entity | undefined) ?? null;
  }

  async createEntity(input: CreateEntityInput): Promise<Entity> {
    const now = Date.now();
    const entity: Entity = {
      id: newId(),
      type: input.type,
      title: input.title,
      notes: input.notes ?? null,
      data: input.data ?? {},
      parentId: input.parentId ?? null,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };
    db.insert(entities).values(entity).run();
    return entity;
  }

  async updateEntity(id: string, patch: EntityPatch): Promise<Entity | null> {
    db.update(entities)
      .set({ ...patch, updatedAt: Date.now() })
      .where(eq(entities.id, id))
      .run();
    const updated = await this.getEntity(id);
    if (updated) await this.recomputeForEntity(id);
    return updated;
  }

  async deleteEntity(id: string): Promise<void> {
    db.delete(reminders).where(eq(reminders.entityId, id)).run();
    db.delete(links).where(or(eq(links.fromId, id), eq(links.toId, id))).run();
    db.delete(completions).where(eq(completions.entityId, id)).run();
    db.delete(contactLog).where(eq(contactLog.personId, id)).run();
    db.delete(entities).where(eq(entities.id, id)).run();
  }

  async searchEntities(query: string, filter?: EntityFilter): Promise<Entity[]> {
    const q = query.trim();
    if (!q) return this.listEntities(filter);
    const match = q
      .split(/\s+/)
      .map((t) => t.replace(/["'*()^:]/g, '').trim())
      .filter(Boolean)
      .map((t) => `${t}*`)
      .join(' ');
    if (!match) return this.listEntities(filter);

    const idRows = expoDb.getAllSync(
      `SELECT e.id AS id FROM entities_fts f
       JOIN entities e ON e.rowid = f.rowid
       WHERE entities_fts MATCH ? AND e.archived_at IS NULL
       ORDER BY rank`,
      match,
    ) as { id: string }[];
    const ids = idRows.map((r) => r.id);
    if (!ids.length) return [];

    const rows = db.select().from(entities).where(inArray(entities.id, ids)).all() as Entity[];
    const byId = new Map(rows.map((r) => [r.id, r]));
    let result = ids.map((id) => byId.get(id)).filter((e): e is Entity => Boolean(e));
    if (filter?.type && filter.type !== 'all') result = result.filter((r) => r.type === filter.type);
    return result;
  }

  // ---- Links ------------------------------------------------------------
  async listLinks(entityId: string): Promise<Link[]> {
    return db
      .select()
      .from(links)
      .where(or(eq(links.fromId, entityId), eq(links.toId, entityId)))
      .all() as Link[];
  }

  async createLink(fromId: string, toId: string, relation?: string | null): Promise<Link> {
    const link: Link = { id: newId(), fromId, toId, relation: relation ?? null, createdAt: Date.now() };
    db.insert(links).values(link).run();
    return link;
  }

  async deleteLink(id: string): Promise<void> {
    db.delete(links).where(eq(links.id, id)).run();
  }

  // ---- Reminders --------------------------------------------------------
  async listReminders(entityId?: string): Promise<Reminder[]> {
    const where = entityId ? eq(reminders.entityId, entityId) : undefined;
    return db.select().from(reminders).where(where).all() as Reminder[];
  }

  async getReminder(id: string): Promise<Reminder | null> {
    return (db.select().from(reminders).where(eq(reminders.id, id)).get() as Reminder | undefined) ?? null;
  }

  async createReminder(input: CreateReminderInput): Promise<Reminder> {
    const reminder: Reminder = {
      id: newId(),
      entityId: input.entityId,
      kind: input.kind,
      config: input.config ?? {},
      usesDefault: input.usesDefault ?? true,
      nextFire: null,
      enabled: input.enabled ?? true,
      haAction: null,
      createdAt: Date.now(),
    };
    db.insert(reminders).values(reminder).run();
    await this.recomputeNextFire(reminder.id);
    return (await this.getReminder(reminder.id)) ?? reminder;
  }

  async updateReminder(id: string, patch: ReminderPatch): Promise<Reminder | null> {
    db.update(reminders).set(patch).where(eq(reminders.id, id)).run();
    await this.recomputeNextFire(id);
    return this.getReminder(id);
  }

  async deleteReminder(id: string): Promise<void> {
    db.delete(reminders).where(eq(reminders.id, id)).run();
  }

  async listUpcomingReminders(limit: number, _now = Date.now()): Promise<Reminder[]> {
    const rows = db
      .select()
      .from(reminders)
      .where(eq(reminders.enabled, true))
      .orderBy(asc(reminders.nextFire))
      .all() as Reminder[];
    return rows.filter((r) => r.nextFire != null).slice(0, limit);
  }

  async recomputeNextFire(reminderId: string): Promise<void> {
    const reminder = await this.getReminder(reminderId);
    if (!reminder) return;
    const entity = await this.getEntity(reminder.entityId);
    if (!entity) return;
    const globalDefault = await this.getDefaultConfig(reminder.kind);
    const resolved = resolveConfig(reminder.config, reminder.usesDefault, globalDefault);
    const lastContactedAt = reminder.kind === 'stay_in_touch' ? await this.lastContact(reminder.entityId) : null;
    const nextFire = computeNextFire({ kind: reminder.kind, resolved, entity, lastContactedAt });
    db.update(reminders).set({ nextFire }).where(eq(reminders.id, reminderId)).run();
  }

  async recomputeAllNextFire(): Promise<void> {
    const all = (db.select().from(reminders).all() as Reminder[]).map((r) => r.id);
    for (const id of all) await this.recomputeNextFire(id);
  }

  private async recomputeForEntity(entityId: string): Promise<void> {
    const rows = db.select().from(reminders).where(eq(reminders.entityId, entityId)).all() as Reminder[];
    for (const r of rows) await this.recomputeNextFire(r.id);
  }

  // ---- Completions ------------------------------------------------------
  async addCompletion(entityId: string, status: Completion['status'] = 'done', date = Date.now()): Promise<Completion> {
    const day = startOfDay(date);
    db.delete(completions).where(and(eq(completions.entityId, entityId), eq(completions.date, day))).run();
    const completion: Completion = { id: newId(), entityId, date: day, status };
    db.insert(completions).values(completion).run();
    await this.recomputeForEntity(entityId);
    return completion;
  }

  async removeCompletionForDay(entityId: string, date = Date.now()): Promise<void> {
    const day = startOfDay(date);
    db.delete(completions).where(and(eq(completions.entityId, entityId), eq(completions.date, day))).run();
    await this.recomputeForEntity(entityId);
  }

  async listCompletions(entityId: string): Promise<Completion[]> {
    return db.select().from(completions).where(eq(completions.entityId, entityId)).orderBy(desc(completions.date)).all() as Completion[];
  }

  async isDoneToday(entityId: string, now = Date.now()): Promise<boolean> {
    const day = startOfDay(now);
    const row = db
      .select()
      .from(completions)
      .where(and(eq(completions.entityId, entityId), eq(completions.date, day), eq(completions.status, 'done')))
      .get();
    return Boolean(row);
  }

  async getStreak(entityId: string): Promise<StreakStats> {
    const rows = (await this.listCompletions(entityId)).filter((c) => c.status === 'done');
    if (!rows.length) return { current: 0, best: 0, rate: 0 };

    const days = Array.from(new Set(rows.map((c) => startOfDay(c.date)))).sort((a, b) => b - a); // desc
    const today = startOfDay(Date.now());

    // Current streak: walk back from today (or yesterday) while consecutive.
    let current = 0;
    if (days[0] === today || days[0] === today - DAY_MS) {
      let cursor = days[0];
      for (const d of days) {
        if (d === cursor) {
          current++;
          cursor -= DAY_MS;
        } else if (d < cursor) {
          break;
        }
      }
    }

    // Best streak: longest consecutive run.
    const asc = [...days].sort((a, b) => a - b);
    let best = 1;
    let run = 1;
    for (let i = 1; i < asc.length; i++) {
      if (asc[i] - asc[i - 1] === DAY_MS) run++;
      else run = 1;
      if (run > best) best = run;
    }

    const span = Math.max(1, Math.round((today - asc[0]) / DAY_MS) + 1);
    const rate = Math.min(100, Math.round((days.length / span) * 100));
    return { current, best, rate };
  }

  // ---- Contact log ------------------------------------------------------
  async logContact(personId: string, channel?: ContactChannel): Promise<ContactLogEntry> {
    const entry: ContactLogEntry = { id: newId(), personId, contactedAt: Date.now(), channel: channel ?? 'manual' };
    db.insert(contactLog).values(entry).run();
    await this.recomputeForEntity(personId);
    return entry;
  }

  async lastContact(personId: string): Promise<number | null> {
    const row = db
      .select()
      .from(contactLog)
      .where(eq(contactLog.personId, personId))
      .orderBy(desc(contactLog.contactedAt))
      .get() as ContactLogEntry | undefined;
    return row?.contactedAt ?? null;
  }

  // ---- Settings & defaults ---------------------------------------------
  async getSetting(key: string): Promise<string | null> {
    const row = db.select().from(settings).where(eq(settings.key, key)).get();
    return row?.value ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } }).run();
  }

  async getDefaultConfig(kind: ReminderKind): Promise<ReminderConfig> {
    const raw = await this.getSetting(`default.${kind}`);
    if (!raw) return { ...DEFAULT_CONFIGS[kind] };
    try {
      return { ...DEFAULT_CONFIGS[kind], ...(JSON.parse(raw) as ReminderConfig) };
    } catch {
      return { ...DEFAULT_CONFIGS[kind] };
    }
  }

  async setDefaultConfig(kind: ReminderKind, config: ReminderConfig): Promise<void> {
    await this.setSetting(`default.${kind}`, JSON.stringify(config));
    await this.recomputeAllNextFire();
  }
}

export const repository: OrbitRepository = new SqliteRepository();
export default repository;
