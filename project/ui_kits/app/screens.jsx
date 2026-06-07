// Orbit UI kit — Today & Items screens
const { ScreenHeader, SearchBar, SegmentedControl, EntityRow, ProgressBar,
        IconButton, StreakBadge, Icon, Avatar, Badge } = window.OrbitDesignSystem_f3fc09;

function SectionLabel({ children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 2px 9px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
        letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase',
        color: color || 'var(--text-subtle)' }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
    </div>
  );
}

function PersonNudgeRow({ person, onOpen }) {
  const overdue = person.lastContactDays >= person.cadence;
  return (
    <div onClick={onOpen} style={{ display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)', borderLeft: '3px solid var(--person)',
      boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
      <Avatar name={person.name} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 15.5, fontWeight: 600, color: 'var(--text-strong)' }}>{person.name}</div>
        <div style={{ fontSize: 13, color: overdue ? 'var(--person)' : 'var(--text-muted)', marginTop: 2 }}>
          {overdue ? `Haven't logged contact in ~${person.lastContactDays} days` : `${person.lastContactDays} days since contact`}
        </div>
      </div>
      <Icon name="chevron-right" size={18} color="var(--text-subtle)" />
    </div>
  );
}

function TodayScreen({ items, onToggle, onOpenPerson, onOpenHabit, query, setQuery }) {
  const done = items.filter((i) => i.done).length;
  const overdue = items.filter((i) => i.status === 'overdue');
  const rest = items.filter((i) => i.status !== 'overdue');
  const people = window.ORBIT_PEOPLE.filter((p) => p.lastContactDays >= p.cadence);

  return (
    <div style={{ padding: '0 var(--screen-pad) 120px' }}>
      <ScreenHeader eyebrow="Friday · Jun 12" title="Today"
        trailing={<IconButton icon="sliders-horizontal" variant="soft" ariaLabel="Filters" />} />

      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 16, marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-body)' }}>Today's progress</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>{done} / {items.length}</span>
        </div>
        <ProgressBar value={done} max={items.length} />
      </div>

      <div style={{ marginTop: 16 }}>
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search people & items" />
      </div>

      {overdue.length > 0 && (
        <React.Fragment>
          <SectionLabel color="var(--danger)">Overdue</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {overdue.map((i) => (
              <EntityRow key={i.id} type={i.type} title={i.title} subtitle={i.subtitle}
                checked={i.done} onToggle={() => onToggle(i.id)} />
            ))}
          </div>
        </React.Fragment>
      )}

      <SectionLabel>On your plate</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rest.map((i) => (
          <EntityRow key={i.id} type={i.type} title={i.title} subtitle={i.subtitle}
            checked={i.done} onToggle={() => onToggle(i.id)}
            onClick={i.type === 'habit' ? () => onOpenHabit(i.id) : undefined}
            trailing={i.type === 'habit' ? <StreakBadge count={i.streak} active={i.streak > 0} /> : undefined}
            showCheck={i.type !== 'habit'} />
        ))}
      </div>

      <SectionLabel color="var(--person)">People to reach out to</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {people.map((p) => <PersonNudgeRow key={p.id} person={p} onOpen={() => onOpenPerson(p.id)} />)}
      </div>
    </div>
  );
}

function ItemsScreen({ items, onToggle, onOpenPerson, onOpenHabit, query, setQuery, filter, setFilter }) {
  const opts = [
    { value: 'all', label: 'All' }, { value: 'person', label: 'People' },
    { value: 'task', label: 'Tasks' }, { value: 'habit', label: 'Habits' },
    { value: 'project', label: 'Projects' },
  ];
  const filtered = items.filter((i) =>
    (filter === 'all' || i.type === filter) &&
    (!query || i.title.toLowerCase().includes(query.toLowerCase())));

  return (
    <div style={{ padding: '0 var(--screen-pad) 120px' }}>
      <ScreenHeader title="Items" subtitle={`${items.length} things in your orbit`} />
      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search everything" />
      <div style={{ marginTop: 12, marginBottom: 4 }}>
        <SegmentedControl options={opts} value={filter} onChange={setFilter} />
      </div>
      <SectionLabel>{filter === 'all' ? 'All items' : opts.find((o) => o.value === filter).label}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {filtered.map((i) => (
          <EntityRow key={i.id} type={i.type} title={i.title} subtitle={i.subtitle}
            checked={i.done} onToggle={() => onToggle(i.id)}
            onClick={i.type === 'person' ? () => onOpenPerson(i.id) : i.type === 'habit' ? () => onOpenHabit(i.id) : undefined}
            trailing={i.type === 'habit' ? <StreakBadge count={i.streak} active={i.streak > 0} />
              : i.type === 'person' || i.type === 'project' ? <Icon name="chevron-right" size={18} color="var(--text-subtle)" /> : undefined}
            showCheck={i.type === 'task' || i.type === 'routine'} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-subtle)', padding: '40px 0', fontSize: 14 }}>Nothing here yet.</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { TodayScreen, ItemsScreen, SectionLabel });
