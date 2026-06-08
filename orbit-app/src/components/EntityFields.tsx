import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Input } from './Input';
import { SegmentedControl } from './SegmentedControl';
import { Switch } from './Switch';
import { DateField } from './DateField';
import { colors, font, radius } from '@/theme/theme';
import type { EntityData, EntityType, ReminderConfig, ReminderKind } from '@/domain/types';

export type Freq = 'DAILY' | 'WEEKLY' | 'MONTHLY';

/** Flat editable state covering every entity type's type-specific fields. */
export interface EntityFormState {
  title: string;
  // person
  birthday: number | null; // epoch ms; persisted as YYYY-MM-DD (annual)
  cadenceDays: number;
  // task
  due: number | null;
  // routine / habit
  freq: Freq;
  hour: number;
  trackAsStreak: boolean;
  // project
  milestoneTitle: string;
  milestoneDate: number | null;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number) => String(n).padStart(2, '0');

function monthDay(ts: number): string {
  const d = new Date(ts);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function toISODate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseBirthday(s?: string | null): number | null {
  if (!s) return null;
  const full = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (full) return new Date(+full[1], +full[2] - 1, +full[3]).getTime();
  const md = s.match(/(\d{1,2})-(\d{1,2})$/);
  if (md) return new Date(new Date().getFullYear(), +md[1] - 1, +md[2]).getTime();
  return null;
}

function scheduleLabel(freq: Freq): string {
  return freq === 'DAILY' ? 'Daily' : freq === 'WEEKLY' ? 'Weekly' : 'Monthly';
}

/** Build the starting form state for a new entity, or from an existing one to edit. */
export function initialFormState(type: EntityType, entity?: { title: string; data: EntityData }): EntityFormState {
  const data = entity?.data;
  return {
    title: entity?.title ?? '',
    birthday: parseBirthday(data?.birthday),
    cadenceDays: data?.stayInTouchDays ?? 21,
    due: data?.due ?? null,
    freq: ((data?.rrule?.match(/FREQ=(\w+)/)?.[1] as Freq) ?? 'DAILY'),
    hour: 9,
    trackAsStreak: data?.trackAsStreak ?? type === 'habit',
    milestoneTitle: data?.milestones?.[0]?.title ?? '',
    milestoneDate: data?.milestones?.[0]?.date ?? null,
  };
}

/** Merge the form's type-specific fields into entity data (preserving unrelated fields in `base`). */
export function buildEntityData(type: EntityType, state: EntityFormState, base: EntityData = {}): EntityData {
  const data: EntityData = { ...base };
  switch (type) {
    case 'person':
      data.birthday = state.birthday != null ? toISODate(state.birthday) : null;
      data.stayInTouchDays = state.cadenceDays;
      break;
    case 'task':
      data.due = state.due;
      break;
    case 'routine':
    case 'habit':
      data.rrule = `FREQ=${state.freq}`;
      data.schedule = scheduleLabel(state.freq);
      data.trackAsStreak = state.trackAsStreak;
      break;
    case 'project': {
      if (state.milestoneTitle.trim() || state.milestoneDate != null) {
        const first = { title: state.milestoneTitle.trim() || 'Milestone', date: state.milestoneDate, done: base.milestones?.[0]?.done ?? false };
        data.milestones = [first, ...(base.milestones?.slice(1) ?? [])];
      }
      break;
    }
  }
  return data;
}

/** The reminder a type's date/cadence settings attach to. */
export function primaryReminderKind(type: EntityType): ReminderKind {
  switch (type) {
    case 'person': return 'stay_in_touch';
    case 'task': return 'date';
    case 'routine':
    case 'habit': return 'recurring';
    case 'project': return 'milestone';
  }
}

/**
 * Per-item reminder overrides implied by the form, or null to inherit the global
 * default. Date/due/birthday/milestone live on the entity, so only cadence and
 * recurrence (which live on the reminder config) need to be surfaced here.
 */
export function buildReminderConfig(type: EntityType, state: EntityFormState): ReminderConfig | null {
  switch (type) {
    case 'person':
      return state.cadenceDays !== 21 ? { cadenceDays: state.cadenceDays } : null;
    case 'routine':
    case 'habit': {
      const changed = state.freq !== 'DAILY' || state.hour !== 9;
      return changed ? { rrule: `FREQ=${state.freq}`, timeOfDay: `${pad(state.hour)}:00` } : null;
    }
    default:
      return null;
  }
}

// ---- UI bits ----------------------------------------------------------------

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14 }}>
      <Text style={{ fontFamily: font('sans', 600), fontSize: 14, color: colors.textStrong }}>{label}</Text>
      {children}
    </View>
  );
}

function Stepper({ value, onDec, onInc }: { value: string; onDec: () => void; onInc: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable onPress={onDec} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 18, color: colors.textBody, lineHeight: 20 }}>−</Text>
      </Pressable>
      <Text style={{ minWidth: 60, textAlign: 'center', fontFamily: font('mono', 500), fontSize: 14, color: colors.textStrong }}>{value}</Text>
      <Pressable onPress={onInc} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 18, color: colors.textBody, lineHeight: 20 }}>+</Text>
      </Pressable>
    </View>
  );
}

export interface EntityFieldsProps {
  type: EntityType;
  state: EntityFormState;
  update: (patch: Partial<EntityFormState>) => void;
}

/** Renders the type-specific reminder/date fields for an entity. */
export function EntityFields({ type, state, update }: EntityFieldsProps) {
  if (type === 'person') {
    return (
      <>
        <DateField label="Birthday" icon="cake" value={state.birthday} onChange={(v) => update({ birthday: v })} placeholder="Add birthday" format={monthDay} />
        <Row label="Stay in touch every">
          <Stepper value={`${state.cadenceDays} days`} onDec={() => update({ cadenceDays: Math.max(1, state.cadenceDays - 1) })} onInc={() => update({ cadenceDays: state.cadenceDays + 1 })} />
        </Row>
      </>
    );
  }

  if (type === 'task') {
    return <DateField label="Due date" value={state.due} onChange={(v) => update({ due: v })} placeholder="No due date" relativeChips />;
  }

  if (type === 'routine' || type === 'habit') {
    return (
      <>
        <Row label="Repeat">
          <View style={{ width: 200 }}>
            <SegmentedControl
              value={state.freq}
              onChange={(v) => update({ freq: v as Freq })}
              options={[
                { value: 'DAILY', label: 'Daily' },
                { value: 'WEEKLY', label: 'Weekly' },
                { value: 'MONTHLY', label: 'Monthly' },
              ]}
            />
          </View>
        </Row>
        <Row label="Time of day">
          <Stepper value={`${pad(state.hour)}:00`} onDec={() => update({ hour: (state.hour + 23) % 24 })} onInc={() => update({ hour: (state.hour + 1) % 24 })} />
        </Row>
        <Row label="Track as streak">
          <Switch checked={state.trackAsStreak} onChange={(v) => update({ trackAsStreak: v })} color={colors.habit} />
        </Row>
      </>
    );
  }

  // project
  return (
    <>
      <Input label="First milestone" value={state.milestoneTitle} onChangeText={(v) => update({ milestoneTitle: v })} icon="folder" placeholder="e.g. Launch v1" />
      <DateField label="Milestone date" value={state.milestoneDate} onChange={(v) => update({ milestoneDate: v })} placeholder="No date" relativeChips />
    </>
  );
}

export default EntityFields;
