/** Build user-facing notification copy for a reminder + its entity. */
import { birthdayDisplay, formatMonthDay } from '@/lib/datetime';
import type { Entity, Reminder } from '@/domain/types';

export interface NotificationCopy {
  title: string;
  body: string;
}

export function buildNotificationCopy(reminder: Reminder, entity: Entity): NotificationCopy {
  const name = entity.title.split(' ')[0];
  switch (reminder.kind) {
    case 'stay_in_touch':
      return { title: `Reach out to ${name}`, body: `It's been a while — send ${entity.title} a message?` };
    case 'date':
      if (entity.type === 'person') {
        const bd = birthdayDisplay(entity.data.birthday);
        return { title: `${name}'s birthday 🎂`, body: bd ? `${bd} — wish them a happy birthday` : 'Wish them a happy birthday' };
      }
      return { title: entity.title, body: entity.data.due ? `Due ${formatMonthDay(entity.data.due)}` : 'Reminder' };
    case 'recurring':
      return { title: entity.title, body: entity.data.schedule ?? 'Time for your routine' };
    case 'milestone': {
      const ms = (entity.data.milestones ?? []).filter((m) => !m.done && m.date).sort((a, b) => (a.date as number) - (b.date as number))[0];
      return { title: entity.title, body: ms ? `Milestone: ${ms.title}` : 'Milestone coming up' };
    }
    default:
      return { title: entity.title, body: 'Reminder' };
  }
}
