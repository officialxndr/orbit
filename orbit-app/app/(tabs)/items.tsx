import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  EntityRow,
  Fab,
  Icon,
  Screen,
  ScreenHeader,
  SearchBar,
  SectionLabel,
  SegmentedControl,
  StreakBadge,
} from '@/components';
import { useStore } from '@/store/useStore';
import { toRowVM, type RowVM } from '@/domain/presenters';
import type { EntityType } from '@/domain/types';
import { colors, font } from '@/theme/theme';
import { useThemeSync } from '@/theme/useTheme';

const FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'person', label: 'People' },
  { value: 'task', label: 'Tasks' },
  { value: 'habit', label: 'Habits' },
  { value: 'project', label: 'Projects' },
];

export default function ItemsScreen() {
  useThemeSync();
  const router = useRouter();
  const entities = useStore((s) => s.entities);
  const now = useStore((s) => s.now);
  const ctxFn = useStore((s) => s.ctx);
  const toggleDone = useStore((s) => s.toggleDone);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  void now;
  const ctx = ctxFn();
  const q = query.trim().toLowerCase();

  const rows: RowVM[] = entities
    .filter((e) => (filter === 'all' || e.type === (filter as EntityType)))
    .filter((e) => !q || e.title.toLowerCase().includes(q) || (e.notes ?? '').toLowerCase().includes(q))
    .map((e) => toRowVM(e, ctx));

  const sectionTitle = filter === 'all' ? 'All items' : FILTERS.find((f) => f.value === filter)?.label ?? '';

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
        ) : r.type === 'person' || r.type === 'project' ? (
          <Icon name="chevron-right" size={18} color={colors.textSubtle} />
        ) : undefined
      }
      onPress={() => router.push(`/entity/${r.id}`)}
    />
  );

  return (
    <Screen floating={<Fab icon="plus" onPress={() => router.push('/new')} />}>
      <ScreenHeader title="Items" subtitle={`${entities.length} things in your orbit`} />
      <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} placeholder="Search everything" />
      <View style={{ marginTop: 12, marginBottom: 4 }}>
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <SectionLabel>{sectionTitle}</SectionLabel>
      <View style={{ gap: 9 }}>{rows.map(renderRow)}</View>

      {rows.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ fontFamily: font('sans', 400), fontSize: 14, color: colors.textSubtle }}>Nothing here yet.</Text>
        </View>
      )}
    </Screen>
  );
}
