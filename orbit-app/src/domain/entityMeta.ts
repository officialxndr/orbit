/**
 * Canonical metadata for Orbit's five linkable entity types and the contact
 * channels a Person can hold. Ported from the design system's EntityIcon and
 * the app kit's HANDLE_META, with deep-link URL templates from plan §8.
 */
import { colors } from '@/theme/theme';
import type { ContactChannel, EntityType } from './types';

export interface EntityMeta {
  label: string;
  color: string;
  soft: string;
  icon: string; // lucide icon name
  description: string;
}

// Base hues are theme-invariant; the soft tints change with the active scheme,
// so `soft` is a live getter that reads the mutated `colors` at access time.
export const ENTITY_META: Record<EntityType, EntityMeta> = {
  person: { label: 'Person', color: colors.person, get soft() { return colors.personSoft; }, icon: 'user-round', description: 'Someone to stay close to' },
  task: { label: 'Task', color: colors.task, get soft() { return colors.taskSoft; }, icon: 'circle-check', description: 'A one-off to-do' },
  routine: { label: 'Routine', color: colors.routine, get soft() { return colors.routineSoft; }, icon: 'repeat', description: 'Something on a schedule' },
  habit: { label: 'Habit', color: colors.habit, get soft() { return colors.habitSoft; }, icon: 'flame', description: 'Build a streak' },
  project: { label: 'Project', color: colors.project, get soft() { return colors.projectSoft; }, icon: 'folder', description: 'A goal with milestones' },
};

export const ENTITY_ORDER: EntityType[] = ['person', 'task', 'routine', 'habit', 'project'];

export interface HandleMeta {
  icon: string;
  label: string;
  color: string;
  /** Build a deep link from a handle value; `null` if not linkable. */
  url: (value: string) => string | null;
}

export const HANDLE_META: Record<ContactChannel, HandleMeta> = {
  sms: { icon: 'message-square', label: 'Message', color: colors.routine, url: (v) => `sms:${v}` },
  phone: { icon: 'phone', label: 'Call', color: colors.task, url: (v) => `tel:${v}` },
  email: { icon: 'mail', label: 'Email', color: colors.habit, url: (v) => `mailto:${v}` },
  whatsapp: { icon: 'message-circle', label: 'WhatsApp', color: colors.success, url: (v) => `whatsapp://send?phone=${v}` },
  telegram: { icon: 'send', label: 'Telegram', color: colors.info, url: (v) => `https://t.me/${v}` },
  instagram: { icon: 'camera', label: 'Instagram', color: colors.person, url: (v) => `https://instagram.com/${v}` },
  linkedin: { icon: 'briefcase', label: 'LinkedIn', color: colors.info, url: (v) => `https://www.linkedin.com/in/${v}` },
  facebook: { icon: 'users', label: 'Facebook', color: colors.task, url: (v) => `https://facebook.com/${v}` },
  signal: { icon: 'message-square', label: 'Signal', color: colors.info, url: (v) => `sgnl://signal.me/#p/${v}` },
  custom: { icon: 'link', label: 'Open', color: colors.accent, url: (v) => v },
  manual: { icon: 'check', label: 'Log contact', color: colors.routine, url: () => null },
};
