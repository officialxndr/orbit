/**
 * Reminder config: global defaults, field-level inheritance resolution, and
 * next-fire computation (RRULE recurrence, date lead-times, stay-in-touch
 * cadence, quiet-hours shifting). Pure functions — no I/O — so both the
 * repository and the notification scheduler can share them.
 */
import type { Entity, ReminderConfig, ReminderKind } from './types';

export const DAY_MS = 24 * 60 * 60 * 1000;

/** App-shipped global defaults per reminder kind (editable in Settings). */
export const DEFAULT_CONFIGS: Record<ReminderKind, ReminderConfig> = {
  stay_in_touch: { cadenceDays: 21, timeOfDay: '09:00', quietHours: { start: '22:00', end: '08:00' }, repeatUntilDone: false, snoozeMinutes: 60 },
  recurring: { rrule: 'FREQ=DAILY', timeOfDay: '09:00', quietHours: { start: '22:00', end: '08:00' }, repeatUntilDone: false, snoozeMinutes: 60 },
  date: { leadTimes: [0, DAY_MS / 60000], timeOfDay: '09:00', quietHours: { start: '22:00', end: '08:00' }, repeatUntilDone: true, snoozeMinutes: 60 },
  milestone: { leadTimes: [0, DAY_MS / 60000], timeOfDay: '09:00', quietHours: { start: '22:00', end: '08:00' }, repeatUntilDone: true, snoozeMinutes: 60 },
};

/**
 * Resolve the effective config by merging the per-item config over the global
 * default. When `usesDefault` is true the item inherits wholesale; otherwise
 * each non-null field overrides the default (field-level inheritance).
 */
export function resolveConfig(config: ReminderConfig, usesDefault: boolean, globalDefault: ReminderConfig): ReminderConfig {
  if (usesDefault) return { ...globalDefault };
  const merged: ReminderConfig = { ...globalDefault };
  (Object.keys(config) as (keyof ReminderConfig)[]).forEach((k) => {
    const v = config[k];
    if (v !== null && v !== undefined) (merged as Record<string, unknown>)[k] = v;
  });
  return merged;
}

function parseTimeOfDay(time?: string | null): { h: number; m: number } {
  if (!time) return { h: 9, m: 0 };
  const [h, m] = time.split(':').map((n) => parseInt(n, 10));
  return { h: isNaN(h) ? 9 : h, m: isNaN(m) ? 0 : m };
}

/** Set the clock time on a given day, returning epoch ms. */
function atTime(base: Date, time?: string | null): number {
  const { h, m } = parseTimeOfDay(time);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

function minutesOfDay(time: string): number {
  const { h, m } = parseTimeOfDay(time);
  return h * 60 + m;
}

/** If a fire time lands inside quiet hours, shift it to the quiet-hours end. */
export function applyQuietHours(ts: number, quiet?: ReminderConfig['quietHours']): number {
  if (!quiet) return ts;
  const d = new Date(ts);
  const cur = d.getHours() * 60 + d.getMinutes();
  const start = minutesOfDay(quiet.start);
  const end = minutesOfDay(quiet.end);
  const inQuiet = start > end ? cur >= start || cur < end : cur >= start && cur < end;
  if (!inQuiet) return ts;
  const { h, m } = parseTimeOfDay(quiet.end);
  const shifted = new Date(ts);
  // Quiet window crosses midnight and we're past midnight already -> same day; else next day.
  if (start > end && cur >= start) shifted.setDate(shifted.getDate() + 1);
  shifted.setHours(h, m, 0, 0);
  return shifted.getTime();
}

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

interface RRule {
  freq?: string;
  interval: number;
  byday?: number[]; // 0=SU..6=SA
}

function parseRRule(rrule?: string | null): RRule {
  const out: RRule = { interval: 1 };
  if (!rrule) return out;
  rrule
    .replace(/^RRULE:/i, '')
    .split(';')
    .forEach((part) => {
      const [k, v] = part.split('=');
      if (!k || !v) return;
      const key = k.toUpperCase();
      if (key === 'FREQ') out.freq = v.toUpperCase();
      else if (key === 'INTERVAL') out.interval = Math.max(1, parseInt(v, 10) || 1);
      else if (key === 'BYDAY') out.byday = v.split(',').map((d) => WEEKDAYS.indexOf(d.trim().toUpperCase())).filter((i) => i >= 0);
    });
  return out;
}

/** Next occurrence of an RRULE strictly after `after`, at the configured time. */
export function nextOccurrence(rrule: string | null | undefined, after: number, timeOfDay?: string | null): number {
  const rule = parseRRule(rrule);
  const freq = rule.freq ?? 'DAILY';
  const start = new Date(after);

  if (freq === 'WEEKLY' && rule.byday && rule.byday.length) {
    for (let i = 0; i < 14 * Math.max(1, rule.interval); i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      if (rule.byday.includes(d.getDay())) {
        const t = atTime(d, timeOfDay);
        if (t > after) return t;
      }
    }
  }

  // DAILY / WEEKLY-no-byday / MONTHLY: step from the next candidate forward.
  let candidate = atTime(start, timeOfDay);
  if (candidate <= after) {
    const d = new Date(candidate);
    if (freq === 'MONTHLY') d.setMonth(d.getMonth() + rule.interval);
    else if (freq === 'WEEKLY') d.setDate(d.getDate() + 7 * rule.interval);
    else d.setDate(d.getDate() + rule.interval);
    candidate = atTime(d, timeOfDay);
  }
  return candidate;
}

/** Next annual occurrence of a 'YYYY-MM-DD' (or 'MM-DD') birthday after `after`. */
function nextAnnual(dateStr: string, after: number, timeOfDay?: string | null): number | null {
  const m = dateStr.match(/(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10) - 1;
  const day = parseInt(m[2], 10);
  const now = new Date(after);
  let year = now.getFullYear();
  let candidate = atTime(new Date(year, month, day), timeOfDay);
  if (candidate <= after) candidate = atTime(new Date(year + 1, month, day), timeOfDay);
  return candidate;
}

export interface NextFireContext {
  kind: ReminderKind;
  resolved: ReminderConfig;
  entity: Entity;
  lastContactedAt?: number | null;
  now?: number;
}

/**
 * Compute the next time a reminder should fire, in epoch ms, or null if it has
 * no future fire (e.g. a one-off past-due date with no lead times remaining).
 */
export function computeNextFire({ kind, resolved, entity, lastContactedAt, now = Date.now() }: NextFireContext): number | null {
  let fire: number | null = null;

  if (kind === 'stay_in_touch') {
    const cadence = resolved.cadenceDays ?? 21;
    const base = (lastContactedAt ?? entity.createdAt) + cadence * DAY_MS;
    // If already overdue, nudge at the next configured time today/tomorrow.
    fire = base <= now ? atTime(new Date(now), resolved.timeOfDay) : atTime(new Date(base), resolved.timeOfDay);
    if (fire <= now) fire = atTime(new Date(now + DAY_MS), resolved.timeOfDay);
  } else if (kind === 'recurring') {
    fire = nextOccurrence(resolved.rrule, now, resolved.timeOfDay);
  } else if (kind === 'date' || kind === 'milestone') {
    let target: number | null = null;
    if (entity.type === 'task' && entity.data.due) target = entity.data.due;
    else if (entity.type === 'person' && entity.data.birthday) target = nextAnnual(entity.data.birthday, now, resolved.timeOfDay);
    else if (entity.type === 'project' && entity.data.milestones?.length) {
      const next = entity.data.milestones
        .filter((m) => !m.done && m.date)
        .map((m) => m.date as number)
        .sort((a, b) => a - b)[0];
      if (next) target = next;
    }
    if (target != null) {
      const leads = resolved.leadTimes && resolved.leadTimes.length ? resolved.leadTimes : [0];
      const candidates = leads
        .map((mins) => atTime(new Date(target), resolved.timeOfDay) - mins * 60000)
        .filter((t) => t > now)
        .sort((a, b) => a - b);
      fire = candidates.length ? candidates[0] : null;
    }
  }

  if (fire == null) return null;
  return applyQuietHours(fire, resolved.quietHours);
}
