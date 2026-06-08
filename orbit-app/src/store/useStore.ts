/**
 * Zustand store: the app's single source of truth at runtime. Holds an
 * in-memory snapshot (entities, reminders, today's completions, streaks,
 * last-contact) refreshed from the repository, and exposes the write actions
 * screens call. Every mutation refreshes the snapshot and re-syncs notifications.
 */
import { create } from 'zustand';
import { repository } from '@/data/sqliteRepository';
import { syncNotifications } from '@/notifications';
import { useThemeStore } from '@/theme/useTheme';
import type { PresentCtx } from '@/domain/presenters';
import type { StreakStats } from '@/data/repository';
import type {
  ContactChannel,
  Entity,
  EntityData,
  EntityType,
  Reminder,
  ReminderConfig,
  ReminderKind,
} from '@/domain/types';

export interface AddEntityInput {
  type: EntityType;
  title: string;
  data?: EntityData;
  trackAsStreak?: boolean;
  /** Optional per-item config applied to the type's primary reminder (cadence, recurrence). */
  reminderConfig?: ReminderConfig | null;
}

/** The reminder a type's date/cadence settings attach to. */
function primaryReminderKind(type: EntityType): ReminderKind {
  switch (type) {
    case 'person': return 'stay_in_touch';
    case 'task': return 'date';
    case 'routine':
    case 'habit': return 'recurring';
    case 'project': return 'milestone';
  }
}

interface OrbitState {
  ready: boolean;
  now: number;
  entities: Entity[];
  reminders: Reminder[];
  doneToday: Record<string, boolean>;
  streaks: Record<string, StreakStats>;
  lastContact: Record<string, number | null>;

  bootstrap: () => Promise<void>;
  refresh: () => Promise<void>;
  ctx: () => PresentCtx;
  getEntity: (id: string) => Entity | undefined;
  remindersFor: (id: string) => Reminder[];

  toggleDone: (id: string) => Promise<void>;
  logContact: (id: string, channel?: ContactChannel) => Promise<string>;
  addEntity: (input: AddEntityInput) => Promise<Entity>;
  updateEntity: (id: string, patch: Partial<Pick<Entity, 'title' | 'notes' | 'data'>>) => Promise<void>;
  deleteEntity: (id: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  updateReminder: (id: string, patch: { config?: ReminderConfig; usesDefault?: boolean; enabled?: boolean }) => Promise<void>;
  setDefaultConfig: (kind: ReminderKind, config: ReminderConfig) => Promise<void>;
}

/** Default reminders created alongside a new entity, by type. */
function defaultRemindersFor(type: EntityType, data: EntityData): { kind: ReminderKind }[] {
  switch (type) {
    case 'person':
      return data.birthday ? [{ kind: 'stay_in_touch' }, { kind: 'date' }] : [{ kind: 'stay_in_touch' }];
    case 'task':
      return [{ kind: 'date' }];
    case 'routine':
    case 'habit':
      return [{ kind: 'recurring' }];
    case 'project':
      return [{ kind: 'milestone' }];
    default:
      return [];
  }
}

export const useStore = create<OrbitState>((set, get) => ({
  ready: false,
  now: Date.now(),
  entities: [],
  reminders: [],
  doneToday: {},
  streaks: {},
  lastContact: {},

  async bootstrap() {
    await repository.init();
    await useThemeStore.getState().init();
    await get().refresh();
    set({ ready: true });
    // Sync the OS notification queue in the background; never block startup on it.
    syncNotifications().catch(() => {});
  },

  async refresh() {
    const now = Date.now();
    const entities = await repository.listEntities();
    const reminders = await repository.listReminders();

    const doneToday: Record<string, boolean> = {};
    const streaks: Record<string, StreakStats> = {};
    const lastContact: Record<string, number | null> = {};

    for (const e of entities) {
      if (e.type === 'routine' || e.type === 'habit') doneToday[e.id] = await repository.isDoneToday(e.id, now);
      if (e.data.trackAsStreak || e.type === 'habit') streaks[e.id] = await repository.getStreak(e.id);
      if (e.type === 'person') lastContact[e.id] = await repository.lastContact(e.id);
    }

    set({ entities, reminders, doneToday, streaks, lastContact, now });
  },

  ctx() {
    const { entities, reminders, doneToday, streaks, lastContact, now } = get();
    const remindersByEntity = new Map<string, Reminder[]>();
    for (const r of reminders) {
      const arr = remindersByEntity.get(r.entityId) ?? [];
      arr.push(r);
      remindersByEntity.set(r.entityId, arr);
    }
    void entities;
    return { remindersByEntity, doneToday, streaks, lastContact, now };
  },

  getEntity(id) {
    return get().entities.find((e) => e.id === id);
  },

  remindersFor(id) {
    return get().reminders.filter((r) => r.entityId === id);
  },

  async toggleDone(id) {
    const entity = get().getEntity(id);
    if (!entity) return;
    if (entity.type === 'task') {
      const next = entity.data.status === 'done' ? 'open' : 'done';
      await repository.updateEntity(id, { data: { ...entity.data, status: next } });
    } else if (entity.type === 'routine' || entity.type === 'habit') {
      const done = await repository.isDoneToday(id);
      if (done) await repository.removeCompletionForDay(id);
      else await repository.addCompletion(id, 'done');
    }
    await get().refresh();
    syncNotifications().catch(() => {});
  },

  async logContact(id, channel) {
    await repository.logContact(id, channel);
    const name = get().getEntity(id)?.title.split(' ')[0] ?? 'them';
    await get().refresh();
    syncNotifications().catch(() => {});
    return name;
  },

  async addEntity(input) {
    const data: EntityData = { ...input.data };
    if (input.type === 'routine' || input.type === 'habit') {
      data.trackAsStreak = input.trackAsStreak ?? input.type === 'habit';
      if (!data.rrule) data.rrule = 'FREQ=DAILY';
      if (!data.schedule) data.schedule = 'Daily';
    }
    const entity = await repository.createEntity({ type: input.type, title: input.title, data });
    const primaryKind = primaryReminderKind(input.type);
    const customConfig = input.reminderConfig;
    for (const r of defaultRemindersFor(input.type, data)) {
      const applyCustom = customConfig && r.kind === primaryKind;
      await repository.createReminder({
        entityId: entity.id,
        kind: r.kind,
        usesDefault: !applyCustom,
        config: applyCustom ? customConfig : {},
      });
    }
    await get().refresh();
    syncNotifications().catch(() => {});
    return entity;
  },

  async updateEntity(id, patch) {
    await repository.updateEntity(id, patch);
    await get().refresh();
    syncNotifications().catch(() => {});
  },

  async deleteEntity(id) {
    await repository.deleteEntity(id);
    await get().refresh();
    syncNotifications().catch(() => {});
  },

  async clearAllData() {
    await repository.clearAll();
    await get().refresh();
    syncNotifications().catch(() => {});
  },

  async updateReminder(id, patch) {
    await repository.updateReminder(id, patch);
    await get().refresh();
    syncNotifications().catch(() => {});
  },

  async setDefaultConfig(kind, config) {
    await repository.setDefaultConfig(kind, config);
    await get().refresh();
    syncNotifications().catch(() => {});
  },
}));
