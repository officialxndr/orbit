/** Human-readable descriptions of a reminder for detail rows and the config sheet. */
import { birthdayDisplay, formatMonthDay } from '@/lib/datetime';
import { DEFAULT_CONFIGS, resolveConfig } from './reminderConfig';
import type { Entity, Reminder, ReminderConfig } from './types';

const WEEKDAY_NAMES: Record<string, string> = {
  SU: 'Sunday', MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday', FR: 'Friday', SA: 'Saturday',
};

export function rruleText(rrule?: string | null): string {
  if (!rrule) return 'Recurring';
  const parts = Object.fromEntries(
    rrule
      .replace(/^RRULE:/i, '')
      .split(';')
      .map((p) => p.split('=').map((s) => s.trim().toUpperCase())),
  ) as Record<string, string>;
  const interval = parts.INTERVAL ? parseInt(parts.INTERVAL, 10) : 1;
  switch (parts.FREQ) {
    case 'DAILY':
      return interval > 1 ? `Every ${interval} days` : 'Daily';
    case 'WEEKLY':
      if (parts.BYDAY) {
        const day = WEEKDAY_NAMES[parts.BYDAY.split(',')[0]] ?? 'week';
        return `Every ${day}`;
      }
      return interval > 1 ? `Every ${interval} weeks` : 'Weekly';
    case 'MONTHLY':
      return interval > 1 ? `Every ${interval} months` : 'Monthly';
    default:
      return 'Recurring';
  }
}

/** "1 day", "2 hours", "at time" — describe the largest positive lead time. */
export function leadLabel(leadTimes?: number[] | null): string {
  const lead = (leadTimes ?? []).filter((m) => m > 0).sort((a, b) => b - a)[0];
  if (!lead) return 'at time';
  if (lead % 1440 === 0) {
    const d = lead / 1440;
    return `${d} day${d === 1 ? '' : 's'}`;
  }
  const h = Math.round(lead / 60);
  return `${h} hour${h === 1 ? '' : 's'}`;
}

export interface ReminderDescription {
  title: string;
  subtitle: string;
}

export function describeReminder(reminder: Reminder, entity: Entity, globalDefault?: ReminderConfig): ReminderDescription {
  const def = globalDefault ?? DEFAULT_CONFIGS[reminder.kind];
  const cfg = resolveConfig(reminder.config, reminder.usesDefault, def);
  const inherit = reminder.usesDefault ? 'inherits default' : 'custom';

  switch (reminder.kind) {
    case 'stay_in_touch':
      return { title: 'Stay-in-touch nudge', subtitle: `Every ${cfg.cadenceDays ?? 21} days · ${inherit}` };
    case 'recurring':
      return { title: 'Recurring reminder', subtitle: `${rruleText(cfg.rrule)} · ${cfg.timeOfDay ?? '09:00'} · ${inherit}` };
    case 'date':
      if (entity.type === 'person') {
        const bd = birthdayDisplay(entity.data.birthday) ?? 'Birthday';
        return { title: 'Birthday reminder', subtitle: `${bd} · ${leadLabel(cfg.leadTimes)} before, ${cfg.timeOfDay ?? '09:00'}` };
      }
      return {
        title: 'Due date',
        subtitle: `${entity.data.due ? formatMonthDay(entity.data.due) : 'No date'} · ${leadLabel(cfg.leadTimes)} before, ${cfg.timeOfDay ?? '09:00'}`,
      };
    case 'milestone': {
      const next = (entity.data.milestones ?? []).filter((m) => !m.done && m.date).sort((a, b) => (a.date as number) - (b.date as number))[0];
      return { title: 'Milestone reminder', subtitle: `${next ? next.title : 'No upcoming milestone'} · ${inherit}` };
    }
    default:
      return { title: 'Reminder', subtitle: inherit };
  }
}
