import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Avatar,
  BackBar,
  Button,
  Card,
  EntityRow,
  Heatmap,
  Icon,
  Screen,
  SectionLabel,
  StreakBadge,
  Switch,
  Tag,
} from '@/components';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { repository } from '@/data/sqliteRepository';
import { ENTITY_META, HANDLE_META } from '@/domain/entityMeta';
import { describeReminder } from '@/domain/reminderPresenter';
import { toRowVM } from '@/domain/presenters';
import { birthdayDisplay, daysSince, formatMonthDay, startOfDay } from '@/lib/datetime';
import type { Completion, Entity, Handle } from '@/domain/types';
import { colors, font, radius, tracking } from '@/theme/theme';

const DAY = 86400000;

export default function EntityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const showToast = useToast((s) => s.show);

  const entities = useStore((s) => s.entities);
  const now = useStore((s) => s.now);
  const ctxFn = useStore((s) => s.ctx);
  const remindersFor = useStore((s) => s.remindersFor);
  const streaks = useStore((s) => s.streaks);
  const lastContactMap = useStore((s) => s.lastContact);
  const doneToday = useStore((s) => s.doneToday);
  const toggleDone = useStore((s) => s.toggleDone);
  const logContact = useStore((s) => s.logContact);

  void now;
  const entity = entities.find((e) => e.id === id);
  const reminders = id ? remindersFor(id) : [];
  const ctx = ctxFn();

  const [links, setLinks] = useState<{ id: string; entity: Entity; relation?: string | null }[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!entity) return;
      const ls = await repository.listLinks(entity.id);
      const linked = await Promise.all(
        ls.map(async (l) => {
          const otherId = l.fromId === entity.id ? l.toId : l.fromId;
          const e = await repository.getEntity(otherId);
          return e ? { id: l.id, entity: e, relation: l.relation } : null;
        }),
      );
      const isStreak = entity.data.trackAsStreak || entity.type === 'habit';
      const comps = isStreak ? await repository.listCompletions(entity.id) : [];
      if (!active) return;
      setLinks(linked.filter((x): x is NonNullable<typeof x> => x !== null));
      setCompletions(comps);
    })();
    return () => {
      active = false;
    };
  }, [entity?.id, entity?.updatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const heat = useMemo(() => {
    const set = new Set(completions.map((c) => startOfDay(c.date)));
    const today = startOfDay(Date.now());
    const arr: number[] = [];
    for (let i = 111; i >= 0; i--) arr.push(set.has(today - i * DAY) ? 4 : 0);
    return arr;
  }, [completions]);

  if (!entity) {
    return (
      <Screen contentPaddingBottom={40}>
        <BackBar title="Not found" />
        <Text style={{ fontFamily: font('sans', 400), color: colors.textMuted, textAlign: 'center', marginTop: 40 }}>
          This item no longer exists.
        </Text>
      </Screen>
    );
  }

  const meta = ENTITY_META[entity.type];

  const remindersSection = reminders.length > 0 && (
    <>
      <SectionLabel>Reminders</SectionLabel>
      <View style={{ gap: 9 }}>
        {reminders.map((r) => {
          const d = describeReminder(r, entity);
          return (
            <EntityRow
              key={r.id}
              type={entity.type}
              title={d.title}
              subtitle={d.subtitle}
              showCheck={false}
              trailing={<Icon name="chevron-right" size={18} color={colors.textSubtle} />}
              onPress={() => router.push(`/reminder/${r.id}`)}
            />
          );
        })}
      </View>
    </>
  );

  const linkedSection = links.length > 0 && (
    <>
      <SectionLabel>Linked items</SectionLabel>
      <View style={{ gap: 9 }}>
        {links.map((l) => {
          const vm = toRowVM(l.entity, ctx);
          return (
            <EntityRow
              key={l.id}
              type={l.entity.type}
              title={vm.title}
              subtitle={vm.subtitle}
              showCheck={false}
              trailing={<Icon name="link-2" size={16} color={colors.textSubtle} />}
              onPress={() => router.push(`/entity/${l.entity.id}`)}
            />
          );
        })}
      </View>
    </>
  );

  // ---- Person ----------------------------------------------------------
  if (entity.type === 'person') {
    const last = lastContactMap[entity.id] ?? null;
    const since = last != null ? daysSince(last, ctx.now) : null;
    const cadence = entity.data.stayInTouchDays ?? 21;
    const overdue = since != null && since >= cadence;
    const bd = birthdayDisplay(entity.data.birthday);
    const handles = entity.data.handles ?? [];

    const onContact = async (h: Handle) => {
      const hm = HANDLE_META[h.platform];
      const url = hm.url(h.value);
      try {
        if (url) await Linking.openURL(url);
      } catch {
        /* app not installed / unsupported scheme */
      }
      const name = await logContact(entity.id, h.platform);
      showToast(`Logged contact with ${name}`);
    };

    return (
      <Screen contentPaddingBottom={48}>
        <BackBar title="Person" />
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 8, paddingBottom: 18 }}>
          <Avatar name={entity.title} size={76} />
          <Text style={{ fontFamily: font('display', 800), fontSize: 26, letterSpacing: tracking.tight, color: colors.textStrong }}>
            {entity.title}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tag type="person" />
            {bd && <Tag color={colors.project} dot={false}>{`🎂 ${bd}`}</Tag>}
          </View>
        </View>

        {handles.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {handles.map((h, i) => {
              const hm = HANDLE_META[h.platform];
              return (
                <Pressable
                  key={`${h.platform}-${i}`}
                  onPress={() => onContact(h)}
                  style={{ flexGrow: 1, flexBasis: 72, alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 6, borderRadius: radius.md, backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault }}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: hm.color + '24' }}>
                    <Icon name={hm.icon} size={20} color={hm.color} />
                  </View>
                  <Text style={{ fontFamily: font('sans', 600), fontSize: 12, color: colors.textBody }}>{hm.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Card style={{ marginBottom: 16, borderLeftWidth: 3, borderLeftColor: overdue ? colors.person : colors.routine }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font('sans', 700), fontSize: 14, color: colors.textStrong }}>Stay in touch</Text>
              <Text style={{ fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted, marginTop: 3 }}>
                Every {cadence} days · {since == null ? 'no contact logged' : `last logged ${since}d ago`}
              </Text>
            </View>
            <Button
              size="sm"
              variant={overdue ? 'primary' : 'secondary'}
              iconLeft="check"
              onPress={async () => {
                const name = await logContact(entity.id, 'manual');
                showToast(`Logged contact with ${name}`);
              }}
            >
              Log
            </Button>
          </View>
        </Card>

        {remindersSection}
        {linkedSection}
      </Screen>
    );
  }

  // ---- Type header (non-person) ----------------------------------------
  const TypeHeader = (
    <View style={{ alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 16 }}>
      <View style={{ width: 60, height: 60, borderRadius: radius.lg, backgroundColor: meta.soft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={meta.icon} size={30} color={meta.color} />
      </View>
      <Text style={{ fontFamily: font('display', 800), fontSize: 24, letterSpacing: tracking.tight, color: colors.textStrong, textAlign: 'center' }}>
        {entity.title}
      </Text>
      <Tag type={entity.type} />
    </View>
  );

  // ---- Habit / streak routine ------------------------------------------
  const isStreak = entity.data.trackAsStreak || entity.type === 'habit';
  if ((entity.type === 'habit' || entity.type === 'routine') && isStreak) {
    const stats = streaks[entity.id] ?? { current: 0, best: 0, rate: 0 };
    const done = Boolean(doneToday[entity.id]);
    return (
      <Screen contentPaddingBottom={48}>
        <BackBar title={meta.label} />
        {TypeHeader}

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row' }}>
            <StatBlock value={String(stats.current)} label="Current" color={colors.habit} />
            <View style={{ width: 1, backgroundColor: colors.borderDefault }} />
            <StatBlock value={String(stats.best)} label="Best" />
            <View style={{ width: 1, backgroundColor: colors.borderDefault }} />
            <StatBlock value={`${stats.rate}%`} label="Consistency" />
          </View>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontFamily: font('sans', 700), fontSize: 13, color: colors.textStrong, marginBottom: 12 }}>Last 16 weeks</Text>
          <Heatmap data={heat} columns={16} cell={13} gap={4} />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: font('sans', 700), fontSize: 14, color: colors.textStrong }}>Track as streak</Text>
              <Text style={{ fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted, marginTop: 3 }}>Gamify with a streak count & heatmap</Text>
            </View>
            <Switch
              checked
              color={colors.habit}
              onChange={() => useStore.getState().updateEntity(entity.id, { data: { ...entity.data, trackAsStreak: false } })}
            />
          </View>
        </Card>

        {remindersSection}
        {linkedSection}

        <View style={{ marginTop: 16 }}>
          <Button fullWidth size="lg" iconLeft="check" variant={done ? 'secondary' : 'primary'} onPress={() => toggleDone(entity.id)}>
            {done ? 'Done today' : 'Mark done today'}
          </Button>
        </View>
      </Screen>
    );
  }

  // ---- Plain routine ---------------------------------------------------
  if (entity.type === 'routine') {
    const done = Boolean(doneToday[entity.id]);
    return (
      <Screen contentPaddingBottom={48}>
        <BackBar title={meta.label} />
        {TypeHeader}
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontFamily: font('sans', 700), fontSize: 14, color: colors.textStrong }}>Schedule</Text>
          <Text style={{ fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted, marginTop: 3 }}>{entity.data.schedule ?? 'No schedule set'}</Text>
        </Card>
        {remindersSection}
        {linkedSection}
        <View style={{ marginTop: 16 }}>
          <Button fullWidth size="lg" iconLeft="check" variant={done ? 'secondary' : 'primary'} onPress={() => toggleDone(entity.id)}>
            {done ? 'Done today' : 'Mark done today'}
          </Button>
        </View>
      </Screen>
    );
  }

  // ---- Task ------------------------------------------------------------
  if (entity.type === 'task') {
    const done = entity.data.status === 'done';
    const due = entity.data.due;
    return (
      <Screen contentPaddingBottom={48}>
        <BackBar title={meta.label} />
        {TypeHeader}
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontFamily: font('sans', 700), fontSize: 14, color: colors.textStrong }}>Due date</Text>
          <Text style={{ fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted, marginTop: 3 }}>
            {due ? formatMonthDay(due) : 'No due date'}
          </Text>
        </Card>
        {remindersSection}
        {linkedSection}
        <View style={{ marginTop: 16 }}>
          <Button fullWidth size="lg" iconLeft="check" variant={done ? 'secondary' : 'primary'} onPress={() => toggleDone(entity.id)}>
            {done ? 'Completed' : 'Mark complete'}
          </Button>
        </View>
      </Screen>
    );
  }

  // ---- Project ---------------------------------------------------------
  const milestones = entity.data.milestones ?? [];
  const doneCount = milestones.filter((m) => m.done).length;
  return (
    <Screen contentPaddingBottom={48}>
      <BackBar title={meta.label} />
      {TypeHeader}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 14, color: colors.textStrong, marginBottom: 10 }}>
          Milestones · {doneCount} of {milestones.length}
        </Text>
        <View style={{ gap: 10 }}>
          {milestones.map((m, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 20, height: 20, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: m.done ? colors.project : 'transparent', borderWidth: m.done ? 0 : 2, borderColor: colors.lineStrong }}>
                {m.done && <Icon name="check" size={12} color={colors.white} strokeWidth={3} />}
              </View>
              <Text style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 14.5, color: m.done ? colors.textMuted : colors.textStrong, textDecorationLine: m.done ? 'line-through' : 'none' }}>
                {m.title}
              </Text>
              {m.date ? <Text style={{ fontFamily: font('mono', 400), fontSize: 12, color: colors.textSubtle }}>{formatMonthDay(m.date)}</Text> : null}
            </View>
          ))}
        </View>
      </Card>
      {remindersSection}
      {linkedSection}
    </Screen>
  );
}

function StatBlock({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={{ fontFamily: font('mono', 600), fontSize: 28, color: color ?? colors.textStrong, lineHeight: 30 }}>{value}</Text>
      <Text style={{ fontFamily: font('sans', 400), fontSize: 11, color: colors.textMuted, marginTop: 5, textTransform: 'uppercase', letterSpacing: tracking.wide }}>{label}</Text>
    </View>
  );
}
