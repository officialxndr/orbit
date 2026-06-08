import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Avatar,
  Card,
  EntityRow,
  Fab,
  Icon,
  IconButton,
  ProgressBar,
  Screen,
  ScreenHeader,
  SearchBar,
  SectionLabel,
  StreakBadge,
} from '@/components';
import { useStore } from '@/store/useStore';
import { buildToday, type PersonNudgeVM, type RowVM } from '@/domain/presenters';
import { todayEyebrow } from '@/lib/datetime';
import { colors, font } from '@/theme/theme';
import { useThemeSync } from '@/theme/useTheme';

export default function TodayScreen() {
  useThemeSync();
  const router = useRouter();
  const entities = useStore((s) => s.entities);
  const now = useStore((s) => s.now);
  const ctxFn = useStore((s) => s.ctx);
  const toggleDone = useStore((s) => s.toggleDone);
  const [query, setQuery] = useState('');

  void now; // re-render trigger: `now` changes on every refresh
  const ctx = ctxFn();
  const sections = buildToday(entities, ctx);

  const q = query.trim().toLowerCase();
  const matchTitle = (t: string) => !q || t.toLowerCase().includes(q);
  const overdue = sections.overdue.filter((r) => matchTitle(r.title));
  const plate = sections.plate.filter((r) => matchTitle(r.title));
  const people = sections.people.filter((p) => matchTitle(p.name));

  const renderRow = (r: RowVM) => (
    <EntityRow
      key={r.id}
      type={r.type}
      title={r.title}
      subtitle={r.subtitle}
      checked={r.done}
      onToggle={() => toggleDone(r.id)}
      showCheck={r.type === 'task' || r.type === 'routine'}
      trailing={
        r.type === 'habit' ? (
          <StreakBadge count={r.streak ?? 0} active={(r.streak ?? 0) > 0} />
        ) : r.type === 'project' ? (
          <Icon name="chevron-right" size={18} color={colors.textSubtle} />
        ) : undefined
      }
      onPress={() => router.push(`/entity/${r.id}`)}
    />
  );

  const renderNudge = (p: PersonNudgeVM) => (
    <EntityRow
      key={p.id}
      type="person"
      leading={<Avatar name={p.name} />}
      title={p.name}
      subtitle={
        p.overdue ? `Haven't logged contact in ~${p.daysSinceContact} days` : `${p.daysSinceContact} days since contact`
      }
      showCheck={false}
      trailing={<Icon name="chevron-right" size={18} color={colors.textSubtle} />}
      onPress={() => router.push(`/entity/${p.id}`)}
    />
  );

  const empty = overdue.length === 0 && plate.length === 0 && people.length === 0;

  return (
    <Screen floating={<Fab icon="plus" onPress={() => router.push('/new')} />}>
      <ScreenHeader
        eyebrow={todayEyebrow(ctx.now)}
        title="Today"
        trailing={<IconButton icon="sliders-horizontal" variant="soft" accessibilityLabel="Filters" onPress={() => router.push('/(tabs)/items')} />}
      />

      <Card style={{ marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <Text style={{ fontFamily: font('sans', 600), fontSize: 14, color: colors.textBody }}>Today&apos;s progress</Text>
          <Text style={{ fontFamily: font('mono', 400), fontSize: 13, color: colors.textMuted }}>
            {sections.doneCount} / {sections.total}
          </Text>
        </View>
        <ProgressBar value={sections.doneCount} max={sections.total} />
      </Card>

      <View style={{ marginTop: 16 }}>
        <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} placeholder="Search people & items" />
      </View>

      {overdue.length > 0 && (
        <>
          <SectionLabel color={colors.danger}>Overdue</SectionLabel>
          <View style={{ gap: 9 }}>{overdue.map(renderRow)}</View>
        </>
      )}

      {plate.length > 0 && (
        <>
          <SectionLabel>On your plate</SectionLabel>
          <View style={{ gap: 9 }}>{plate.map(renderRow)}</View>
        </>
      )}

      {people.length > 0 && (
        <>
          <SectionLabel color={colors.person}>People to reach out to</SectionLabel>
          <View style={{ gap: 9 }}>{people.map(renderNudge)}</View>
        </>
      )}

      {empty && (
        <View style={{ alignItems: 'center', paddingVertical: 56, gap: 10 }}>
          <Icon name="sun" size={40} color={colors.textSubtle} strokeWidth={1.6} />
          <Text style={{ fontFamily: font('sans', 600), fontSize: 16, color: colors.textBody }}>
            {q ? 'Nothing matches' : "You're all caught up"}
          </Text>
          <Text style={{ fontFamily: font('sans', 400), fontSize: 13.5, color: colors.textMuted, textAlign: 'center' }}>
            {q ? 'Try a different search.' : 'Add something to your orbit with the + button.'}
          </Text>
        </View>
      )}
    </Screen>
  );
}
