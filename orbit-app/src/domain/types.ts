/**
 * Orbit domain model. Mirrors the SQLite schema in the build plan (§4–6):
 * a generic-entity model so new types never require a schema reshape.
 */

export type EntityType = 'person' | 'task' | 'routine' | 'habit' | 'project';

export type ReminderKind = 'date' | 'recurring' | 'stay_in_touch' | 'milestone';

export type CompletionStatus = 'done' | 'skipped' | 'missed';

export type ContactChannel =
  | 'sms'
  | 'phone'
  | 'email'
  | 'whatsapp'
  | 'telegram'
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'signal'
  | 'custom'
  | 'manual';

/** A contact handle on a Person, e.g. { platform: 'sms', value: '+15551234' }. */
export interface Handle {
  platform: ContactChannel;
  value: string;
}

export interface ProjectMilestone {
  title: string;
  date?: number | null; // epoch ms
  done: boolean;
}

/** Type-specific fields that live in `entities.data` (JSON). */
export interface EntityData {
  // Person
  birthday?: string | null; // ISO 'YYYY-MM-DD' or display string
  handles?: Handle[];
  stayInTouchDays?: number | null;
  giftIdeas?: string[];
  // Task
  due?: number | null; // epoch ms
  status?: 'open' | 'done';
  // Routine / Habit
  rrule?: string | null;
  trackAsStreak?: boolean;
  schedule?: string | null; // human label, e.g. "Every Tuesday"
  // Project
  milestones?: ProjectMilestone[];
}

export interface Entity {
  id: string;
  type: EntityType;
  title: string;
  notes?: string | null;
  data: EntityData;
  parentId?: string | null;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number | null;
}

export interface Link {
  id: string;
  fromId: string;
  toId: string;
  relation?: string | null; // 'assignee' | 'about' | 'gift_for' | free-form
  createdAt: number;
}

/** Optional Home Assistant action fired alongside a reminder. */
export interface HAAction {
  type: 'event' | 'service';
  name: string;
  data?: Record<string, unknown>;
}

/**
 * Per-item reminder config. `null`/absent fields inherit the matching field of
 * the global default (field-level inheritance), resolved at schedule time.
 */
export interface ReminderConfig {
  cadenceDays?: number | null; // stay_in_touch
  rrule?: string | null; // recurring
  leadTimes?: number[] | null; // date — minutes before [0, 1440, ...]
  timeOfDay?: string | null; // "09:00"
  quietHours?: { start: string; end: string } | null;
  repeatUntilDone?: boolean | null;
  snoozeMinutes?: number | null;
  haAction?: HAAction | null;
}

export interface Reminder {
  id: string;
  entityId: string;
  kind: ReminderKind;
  config: ReminderConfig;
  usesDefault: boolean;
  nextFire?: number | null; // denormalized epoch ms for fast "soonest" queries
  enabled: boolean;
  haAction?: HAAction | null;
  createdAt: number;
}

export interface Completion {
  id: string;
  entityId: string;
  date: number; // epoch ms (day-stamp)
  status: CompletionStatus;
}

export interface ContactLogEntry {
  id: string;
  personId: string;
  contactedAt: number;
  channel?: ContactChannel | null;
}

/** Global default reminder settings, keyed by `default.<kind>` plus misc keys. */
export type SettingKey =
  | 'default.stay_in_touch'
  | 'default.recurring'
  | 'default.date'
  | 'default.milestone'
  | 'ha.connected'
  | 'appearance';

export interface SettingRow {
  key: string;
  value: string; // JSON
}
