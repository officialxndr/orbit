// Orbit UI kit — Person detail, Habit detail, Reminder config sheet
const { IconButton, Icon, Avatar, Tag, Badge, Button, Switch, StreakBadge,
        Heatmap, EntityRow, SegmentedControl } = window.OrbitDesignSystem_f3fc09;
const { SectionLabel } = window; // defined in screens.jsx (loads first)

function BackBar({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0 10px' }}>
      <IconButton icon="chevron-left" variant="soft" ariaLabel="Back" onClick={onBack} />
      <span style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700,
        color: 'var(--text-strong)', textAlign: 'center', letterSpacing: 'var(--tracking-snug)' }}>{title}</span>
      <IconButton icon="ellipsis" variant="soft" ariaLabel="More" />
    </div>
  );
}

function ContactButton({ handle, onClick }) {
  const m = window.HANDLE_META[handle];
  return (
    <button onClick={onClick} style={{ flex: '1 0 0', minWidth: 72, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 6, padding: '12px 6px', borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)', border: '1px solid var(--border-default)', cursor: 'pointer',
      boxShadow: 'var(--shadow-xs)', WebkitTapHighlightColor: 'transparent' }}>
      <span style={{ width: 38, height: 38, borderRadius: 999, display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', background: 'color-mix(in srgb, ' + m.color + ' 14%, transparent)', color: m.color }}>
        <Icon name={m.icon} size={20} />
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}>{m.label}</span>
    </button>
  );
}

function InfoCard({ children, style }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 16, ...style }}>{children}</div>
  );
}

function PersonDetail({ person, onBack, onLogContact, onOpenReminder }) {
  const overdue = person.lastContactDays >= person.cadence;
  return (
    <div style={{ padding: '0 var(--screen-pad) 120px' }}>
      <BackBar title="Person" onBack={onBack} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '8px 0 18px' }}>
        <Avatar name={person.name} size="lg" style={{ width: 76, height: 76, fontSize: 28 }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
          letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)' }}>{person.name}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag type="person" />
          {person.birthday && <Tag color="var(--project)" dot={false}>🎂 {person.birthday}</Tag>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {person.handles.map((h) => <ContactButton key={h} handle={h} onClick={() => onLogContact(person.id)} />)}
      </div>

      <InfoCard style={{ marginBottom: 16, borderLeft: '3px solid ' + (overdue ? 'var(--person)' : 'var(--routine)') }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>Stay in touch</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Every {person.cadence} days · last logged {person.lastContactDays}d ago</div>
          </div>
          <Button size="sm" variant={overdue ? 'primary' : 'secondary'} iconLeft="check" onClick={() => onLogContact(person.id)}>Log</Button>
        </div>
      </InfoCard>

      <SectionLabel>Reminders</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <EntityRow type="person" title="Stay-in-touch nudge" subtitle={`Every ${person.cadence} days · inherits default`}
          onClick={() => onOpenReminder('stay_in_touch')}
          trailing={<Icon name="chevron-right" size={18} color="var(--text-subtle)" />} />
        {person.birthday && (
          <EntityRow type="person" title="Birthday reminder" subtitle={`${person.birthday} · 1 day before, 9:00 AM`}
            onClick={() => onOpenReminder('date')}
            trailing={<Icon name="chevron-right" size={18} color="var(--text-subtle)" />} />
        )}
      </div>

      {person.linked.length > 0 && (
        <React.Fragment>
          <SectionLabel>Linked items</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {person.linked.map((l, idx) => (
              <EntityRow key={idx} type={l.includes('party') ? 'project' : 'task'} title={l}
                subtitle={l.includes('party') ? '3 of 7 milestones' : 'Linked to ' + person.name}
                trailing={<Icon name="link-2" size={16} color="var(--text-subtle)" />} showCheck={false} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function StatBlock({ value, label, color }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 600, color: color || 'var(--text-strong)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)' }}>{label}</div>
    </div>
  );
}

function HabitDetail({ habit, onBack, onToggleStreak }) {
  const streakMode = habit.streak !== undefined;
  return (
    <div style={{ padding: '0 var(--screen-pad) 120px' }}>
      <BackBar title="Habit" onBack={onBack} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0 16px' }}>
        <span style={{ width: 60, height: 60, borderRadius: 'var(--radius-lg)', background: 'var(--habit-soft)',
          color: 'var(--habit)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="flame" size={30} />
        </span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)' }}>{habit.title}</div>
        <Tag type="habit" />
      </div>

      <InfoCard style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex' }}>
          <StatBlock value={habit.streak} label="Current" color="var(--habit)" />
          <div style={{ width: 1, background: 'var(--border-default)' }} />
          <StatBlock value="23" label="Best" />
          <div style={{ width: 1, background: 'var(--border-default)' }} />
          <StatBlock value="86%" label="Consistency" />
        </div>
      </InfoCard>

      <InfoCard style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>Last 16 weeks</div>
        <Heatmap data={window.ORBIT_HEATMAP} columns={16} cell={13} gap={4} />
      </InfoCard>

      <InfoCard style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>Track as streak</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Gamify with a streak count & heatmap</div>
          </div>
          <Switch checked={streakMode} onChange={onToggleStreak} color="var(--habit)" />
        </div>
      </InfoCard>

      <Button fullWidth size="lg" iconLeft="check">Mark done today</Button>
    </div>
  );
}

Object.assign(window, { PersonDetail, HabitDetail, BackBar, InfoCard });
