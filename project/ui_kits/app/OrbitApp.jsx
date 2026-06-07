// Orbit UI kit — app shell (navigation, state, device frame)
const { TabBar, Fab, Icon, Switch, Badge } = window.OrbitDesignSystem_f3fc09;
const { IOSDevice } = window;

function SettingsRow({ icon, color, title, detail, last, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
      borderBottom: last ? 'none' : '1px solid var(--border-default)', cursor: onClick ? 'pointer' : 'default' }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: color, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', color: '#fff', flex: 'none' }}>
        <Icon name={icon} size={17} />
      </span>
      <span style={{ flex: 1, fontSize: 15.5, color: 'var(--text-strong)' }}>{title}</span>
      {detail && <span style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{detail}</span>}
      <Icon name="chevron-right" size={17} color="var(--text-subtle)" />
    </div>
  );
}

function SettingsGroup({ header, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase', color: 'var(--text-subtle)', margin: '0 2px 8px' }}>{header}</div>
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function SettingsScreen() {
  const { ScreenHeader } = window.OrbitDesignSystem_f3fc09;
  return (
    <div style={{ padding: '0 var(--screen-pad) 120px' }}>
      <ScreenHeader title="Settings" />
      <SettingsGroup header="Default reminders">
        <SettingsRow icon="users" color="var(--person)" title="Stay-in-touch cadence" detail="21 days" />
        <SettingsRow icon="clock" color="var(--task)" title="Default time of day" detail="09:00" />
        <SettingsRow icon="bell-ring" color="var(--routine)" title="Lead time" detail="1 day" last />
      </SettingsGroup>
      <SettingsGroup header="Integrations">
        <SettingsRow icon="house" color="var(--habit)" title="Home Assistant" detail="Not connected" last />
      </SettingsGroup>
      <SettingsGroup header="App">
        <SettingsRow icon="palette" color="var(--project)" title="Appearance" detail="Light" />
        <SettingsRow icon="database" color="var(--info)" title="Local data" detail="On device" />
        <SettingsRow icon="info" color="var(--ink-500)" title="About Orbit" last />
      </SettingsGroup>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text-subtle)', marginTop: 8 }}>
        Local-first · no account · everything stays on this device
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 90, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ink-900)', color: '#fff',
        padding: '11px 16px', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-lg)', fontSize: 14, fontWeight: 600,
        animation: 'toastIn var(--dur-base) var(--ease-spring)' }}>
        <Icon name="check-circle-2" size={17} color="var(--routine)" />{message}
      </div>
      <style>{`@keyframes toastIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}

function OrbitApp() {
  const [items, setItems] = React.useState(window.ORBIT_TODAY.map((i) => ({ ...i })));
  const [allItems, setAllItems] = React.useState(window.ORBIT_ITEMS.map((i) => ({ ...i })));
  const [people, setPeople] = React.useState(window.ORBIT_PEOPLE.map((p) => ({ ...p })));
  const [tab, setTab] = React.useState('today');
  const [view, setView] = React.useState(null); // {name:'person'|'habit', id}
  const [sheet, setSheet] = React.useState(null); // {type:'new'|'reminder', kind}
  const [toast, setToast] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 1900); };

  const toggle = (id) => {
    setItems((xs) => xs.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
    setAllItems((xs) => xs.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };
  const logContact = (id) => {
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, lastContactDays: 0 } : p)));
    const p = people.find((x) => x.id === id);
    flash(`Logged contact with ${p ? p.name.split(' ')[0] : 'them'}`);
    setView(null);
  };
  const addItem = (type, title) => {
    const sub = { person: 'Just added', task: 'No due date', routine: 'No schedule yet', habit: 'Daily · new', project: '0 milestones' }[type];
    const it = { id: 'n' + Date.now(), type, title, subtitle: sub, done: false, streak: type === 'habit' ? 0 : undefined };
    setItems((xs) => [it, ...xs]);
    setAllItems((xs) => [it, ...xs]);
    setSheet(null);
    flash(`${title} added`);
  };

  const personById = (id) => people.find((p) => p.id === id);
  const habitById = (id) => allItems.find((i) => i.id === id) || items.find((i) => i.id === id);

  let screen;
  if (view && view.name === 'person') {
    screen = <window.PersonDetail person={personById(view.id)} onBack={() => setView(null)}
      onLogContact={logContact} onOpenReminder={(kind) => setSheet({ type: 'reminder', kind })} />;
  } else if (view && view.name === 'habit') {
    screen = <window.HabitDetail habit={habitById(view.id)} onBack={() => setView(null)} onToggleStreak={() => {}} />;
  } else if (tab === 'today') {
    screen = <window.TodayScreen items={items} onToggle={toggle}
      onOpenPerson={(id) => setView({ name: 'person', id })} onOpenHabit={(id) => setView({ name: 'habit', id })}
      query={query} setQuery={setQuery} />;
  } else if (tab === 'items') {
    screen = <window.ItemsScreen items={allItems} onToggle={toggle}
      onOpenPerson={(id) => setView({ name: 'person', id })} onOpenHabit={(id) => setView({ name: 'habit', id })}
      query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} />;
  } else {
    screen = <SettingsScreen />;
  }

  const showFab = !view;

  return (
    <IOSDevice>
      <div style={{ position: 'relative', height: '100%', background: 'var(--surface-page)' }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 52 }}>
          {screen}
        </div>

        {showFab && (
          <div style={{ position: 'absolute', right: 20, bottom: 92, zIndex: 40 }}>
            <Fab icon="plus" onClick={() => setSheet({ type: 'new' })} />
          </div>
        )}

        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingBottom: 20, zIndex: 30 }}>
          <TabBar active={tab} onChange={(t) => { setTab(t); setView(null); }} tabs={[
            { key: 'today', label: 'Today', icon: 'sun' },
            { key: 'items', label: 'Items', icon: 'layers' },
            { key: 'settings', label: 'Settings', icon: 'settings' },
          ]} />
        </div>

        {sheet && sheet.type === 'new' && <window.NewSheet onClose={() => setSheet(null)} onAdd={addItem} />}
        {sheet && sheet.type === 'reminder' && <window.ReminderSheet kind={sheet.kind} onClose={() => setSheet(null)} />}

        <Toast message={toast} />
      </div>
    </IOSDevice>
  );
}

Object.assign(window, { OrbitApp });
