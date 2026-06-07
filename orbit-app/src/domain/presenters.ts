/**
 * Presenters: pure functions that turn domain entities + an in-memory context
 * (reminders, today's completions, streaks, last-contact) into the view-models
 * the screens render. Keeps screens thin and free of business logic.
 */
import { daysSince, daysUntil, formatMonthDay, startOfDay } from '@/lib/datetime';
import type { Entity, EntityType, Reminder } from './types';
import type { StreakStats } from '@/data/repository';

export interface PresentCtx {
  remindersByEntity: Map<string, Reminder[]>;
  doneToday: Record<string, boolean>;
  streaks: Record<string, StreakStats>;
  lastContact: Record<string, number | null>;
  now: number;
}

export type DueState = 'overdue' | 'today' | 'upcoming' | 'none';

export interface RowVM {
  id: string;
  type: EntityType;
  title: string;
  subtitle: string;
  done: boolean;
  streak?: number;
  streakActive?: boolean;
  dueState: DueState;
}

export interface PersonNudgeVM {
  id: string;
  name: string;
  daysSinceContact: number | null;
  cadence: number;
  overdue: boolean;
}

export function isDone(entity: Entity, ctx: PresentCtx): boolean {
  if (entity.type === 'task') return entity.data.status === 'done';
  if (entity.type === 'routine' || entity.type === 'habit') return Boolean(ctx.doneToday[entity.id]);
  return false;
}

/** Soonest enabled reminder fire time for an entity, or null. */
export function soonestFire(entityId: string, ctx: PresentCtx): number | null {
  const rs = ctx.remindersByEntity.get(entityId) ?? [];
  const times = rs.filter((r) => r.enabled && r.nextFire != null).map((r) => r.nextFire as number);
  return times.length ? Math.min(...times) : null;
}

export function dueStateOf(entity: Entity, ctx: PresentCtx): DueState {
  if (entity.type === 'task' && entity.data.due && entity.data.status !== 'done') {
    const d = daysUntil(entity.data.due, ctx.now);
    return d < 0 ? 'overdue' : d === 0 ? 'today' : 'upcoming';
  }
  const fire = soonestFire(entity.id, ctx);
  if (fire == null) return 'none';
  if (fire < startOfDay(ctx.now)) return 'overdue';
  if (fire <= startOfDay(ctx.now) + 86400000 - 1) return 'today';
  return 'upcoming';
}

export function getCadence(entity: Entity): number {
  return entity.data.stayInTouchDays ?? 21;
}

export function personNudge(entity: Entity, ctx: PresentCtx): PersonNudgeVM {
  const last = ctx.lastContact[entity.id] ?? null;
  const since = last != null ? daysSince(last, ctx.now) : null;
  const cadence = getCadence(entity);
  return {
    id: entity.id,
    name: entity.title,
    daysSinceContact: since,
    cadence,
    overdue: since != null && since >= cadence,
  };
}

export function rowSubtitle(entity: Entity, ctx: PresentCtx): string {
  switch (entity.type) {
    case 'person': {
      const last = ctx.lastContact[entity.id] ?? null;
      const since = last != null ? daysSince(last, ctx.now) : null;
      return since == null ? 'No contact logged yet' : `${since} days since contact`;
    }
    case 'task': {
      if (entity.data.status === 'done') return 'Done';
      const due = entity.data.due;
      if (!due) return 'No due date';
      const d = daysUntil(due, ctx.now);
      if (d < 0) return 'Overdue';
      if (d === 0) return 'Due today';
      if (d === 1) return 'Due tomorrow';
      return `Due ${formatMonthDay(due)}`;
    }
    case 'routine':
      return entity.data.schedule ?? 'Routine';
    case 'habit':
      return entity.data.schedule ?? 'Daily';
    case 'project': {
      const ms = entity.data.milestones ?? [];
      const done = ms.filter((m) => m.done).length;
      return `${done} of ${ms.length} milestones`;
    }
    default:
      return '';
  }
}

export function toRowVM(entity: Entity, ctx: PresentCtx): RowVM {
  const streak = ctx.streaks[entity.id];
  return {
    id: entity.id,
    type: entity.type,
    title: entity.title,
    subtitle: rowSubtitle(entity, ctx),
    done: isDone(entity, ctx),
    streak: streak?.current,
    streakActive: streak ? streak.current > 0 : undefined,
    dueState: dueStateOf(entity, ctx),
  };
}

export interface TodaySections {
  overdue: RowVM[];
  plate: RowVM[];
  people: PersonNudgeVM[];
  doneCount: number;
  total: number;
}

/** Assemble the Today screen: overdue + on-your-plate items and people to reach out to. */
export function buildToday(entities: Entity[], ctx: PresentCtx): TodaySections {
  const actionable = entities.filter((e) => e.type !== 'person');
  const rows: RowVM[] = [];
  for (const e of actionable) {
    const state = dueStateOf(e, ctx);
    const done = isDone(e, ctx);
    // Show items due today/overdue, plus anything completed today (so it stays visible & checked).
    if (state === 'overdue' || state === 'today' || done) rows.push(toRowVM(e, ctx));
  }
  const overdue = rows.filter((r) => r.dueState === 'overdue' && !r.done);
  const plate = rows.filter((r) => !(r.dueState === 'overdue' && !r.done));

  const people = entities
    .filter((e) => e.type === 'person')
    .map((e) => personNudge(e, ctx))
    .filter((p) => p.overdue);

  const total = rows.length;
  const doneCount = rows.filter((r) => r.done).length;
  return { overdue, plate, people, doneCount, total };
}
