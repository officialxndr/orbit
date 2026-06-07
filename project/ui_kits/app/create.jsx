// Orbit UI kit — bottom sheets: create (type picker + form) and reminder config
const { Button, Input, Switch, SegmentedControl, EntityIcon, IconButton, Icon, ENTITY_META } = window.OrbitDesignSystem_f3fc09;

function BottomSheet({ children, onClose, height }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(27,26,23,0.4)', backdropFilter: 'blur(2px)' }} />
      <div style={{ position: 'relative', background: 'var(--surface-page)', borderRadius: '24px 24px 0 0',
        boxShadow: 'var(--shadow-xl)', padding: '10px 20px calc(20px + 16px)', maxHeight: height || '88%', overflow: 'auto',
        animation: 'sheetUp var(--dur-base) var(--ease-out)' }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: 'var(--line-strong)', margin: '0 auto 14px' }} />
        {children}
      </div>
      <style>{`@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

const TYPE_DESC = {
  person:  'Someone to stay close to',
  task:    'A one-off to-do',
  routine: 'Something on a schedule',
  habit:   'Build a streak',
  project: 'A goal with milestones',
};

function NewSheet({ onClose, onAdd }) {
  const [type, setType] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [streak, setStreak] = React.useState(true);

  if (!type) {
    return (
      <BottomSheet onClose={onClose}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: 'var(--tracking-tight)', marginBottom: 4 }}>Add to your orbit</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>What are you adding?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {Object.keys(ENTITY_META).map((t) => (
            <button key={t} onClick={() => setType(t)} style={{ display: 'flex', alignItems: 'center', gap: 13,
              padding: 12, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)',
              border: '1px solid var(--border-default)', borderLeft: '3px solid ' + ENTITY_META[t].color,
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer', textAlign: 'left', WebkitTapHighlightColor: 'transparent' }}>
              <EntityIcon type={t} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>{ENTITY_META[t].label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 1 }}>{TYPE_DESC[t]}</div>
              </div>
              <Icon name="chevron-right" size={18} color="var(--text-subtle)" />
            </button>
          ))}
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <IconButton icon="chevron-left" variant="soft" ariaLabel="Back" onClick={() => setType(null)} />
        <EntityIcon type={type} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: 'var(--tracking-tight)' }}>New {ENTITY_META[type].label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder={type === 'person' ? 'e.g. Sam Rivera' : 'e.g. ' + (type === 'habit' ? 'Morning stretch' : 'Buy groceries')} icon="pen-line" />
        {(type === 'habit' || type === 'routine') && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>Track as streak</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Gamify consistency</div>
            </div>
            <Switch checked={streak} onChange={setStreak} color="var(--habit)" />
          </div>
        )}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          <Icon name="bell" size={15} color="var(--text-subtle)" />
          Reminder uses your global default — customize after saving.
        </div>
        <Button fullWidth size="lg" iconLeft="plus" onClick={() => onAdd(type, title || ('New ' + ENTITY_META[type].label))}>Add {ENTITY_META[type].label}</Button>
      </div>
    </BottomSheet>
  );
}

function Field({ label, children, disabled }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0',
      borderBottom: '1px solid var(--border-default)', opacity: disabled ? 0.45 : 1 }}>
      <span style={{ fontSize: 15, color: 'var(--text-body)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-strong)', fontWeight: 500 }}>{children}</span>
    </div>
  );
}

function ReminderSheet({ kind = 'stay_in_touch', onClose }) {
  const [useDefault, setUseDefault] = React.useState(true);
  const isContact = kind === 'stay_in_touch';
  return (
    <BottomSheet onClose={onClose}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: 'var(--tracking-tight)', marginBottom: 2 }}>
        {isContact ? 'Stay-in-touch reminder' : 'Birthday reminder'}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 16 }}>Per-item settings · overrides the global default</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--accent-tint)', borderRadius: 'var(--radius-md)', padding: '13px 14px', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--orbit-700)' }}>Use global default</div>
          <div style={{ fontSize: 12.5, color: 'var(--orbit-700)', opacity: 0.8, marginTop: 2 }}>Inherit changes you make in Settings</div>
        </div>
        <Switch checked={useDefault} onChange={setUseDefault} />
      </div>

      <div style={{ padding: '0 2px', marginBottom: 18 }}>
        {isContact
          ? <Field label="Nudge me every" disabled={useDefault}>21 days</Field>
          : <Field label="Notify before" disabled={useDefault}>1 day</Field>}
        <Field label="Time of day" disabled={useDefault}>09:00</Field>
        <Field label="Quiet hours" disabled={useDefault}>22:00–08:00</Field>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', opacity: useDefault ? 0.45 : 1 }}>
          <span style={{ fontSize: 15, color: 'var(--text-body)' }}>Repeat until done</span>
          <Switch checked={!isContact} onChange={() => {}} disabled={useDefault} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
        <Button fullWidth onClick={onClose}>Save</Button>
      </div>
    </BottomSheet>
  );
}

Object.assign(window, { BottomSheet, NewSheet, ReminderSheet });
