/**
 * Storage repository interface. The domain/UI layers depend only on this, so
 * the ORM (Drizzle today) can be swapped without touching anything above it.
 */
import type {
  Completion,
  ContactChannel,
  ContactLogEntry,
  Entity,
  EntityData,
  EntityType,
  Link,
  Reminder,
  ReminderConfig,
  ReminderKind,
} from '@/domain/types';

export interface EntityFilter {
  type?: EntityType | 'all';
  includeArchived?: boolean;
}

export interface CreateEntityInput {
  type: EntityType;
  title: string;
  notes?: string | null;
  data?: EntityData;
  parentId?: string | null;
}

export type EntityPatch = Partial<Pick<Entity, 'title' | 'notes' | 'data' | 'parentId' | 'archivedAt'>>;

export interface CreateReminderInput {
  entityId: string;
  kind: ReminderKind;
  config?: ReminderConfig;
  usesDefault?: boolean;
  enabled?: boolean;
}

export type ReminderPatch = Partial<Pick<Reminder, 'config' | 'usesDefault' | 'enabled' | 'haAction'>>;

export interface StreakStats {
  current: number;
  best: number;
  rate: number; // 0..100
}

export interface OrbitRepository {
  init(): Promise<void>;

  // Entities
  listEntities(filter?: EntityFilter): Promise<Entity[]>;
  getEntity(id: string): Promise<Entity | null>;
  createEntity(input: CreateEntityInput): Promise<Entity>;
  updateEntity(id: string, patch: EntityPatch): Promise<Entity | null>;
  deleteEntity(id: string): Promise<void>;
  searchEntities(query: string, filter?: EntityFilter): Promise<Entity[]>;

  // Links
  listLinks(entityId: string): Promise<Link[]>;
  createLink(fromId: string, toId: string, relation?: string | null): Promise<Link>;
  deleteLink(id: string): Promise<void>;

  // Reminders
  listReminders(entityId?: string): Promise<Reminder[]>;
  getReminder(id: string): Promise<Reminder | null>;
  createReminder(input: CreateReminderInput): Promise<Reminder>;
  updateReminder(id: string, patch: ReminderPatch): Promise<Reminder | null>;
  deleteReminder(id: string): Promise<void>;
  listUpcomingReminders(limit: number, now?: number): Promise<Reminder[]>;
  recomputeNextFire(reminderId: string): Promise<void>;
  recomputeAllNextFire(): Promise<void>;

  // Completions
  addCompletion(entityId: string, status?: Completion['status'], date?: number): Promise<Completion>;
  removeCompletionForDay(entityId: string, date?: number): Promise<void>;
  listCompletions(entityId: string): Promise<Completion[]>;
  getStreak(entityId: string): Promise<StreakStats>;
  isDoneToday(entityId: string, now?: number): Promise<boolean>;

  // Contact log
  logContact(personId: string, channel?: ContactChannel): Promise<ContactLogEntry>;
  lastContact(personId: string): Promise<number | null>;

  // Settings & defaults
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  getDefaultConfig(kind: ReminderKind): Promise<ReminderConfig>;
  setDefaultConfig(kind: ReminderKind, config: ReminderConfig): Promise<void>;
}
