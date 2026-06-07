// Orbit — mock data for the UI kit (fake, in-memory)
const ORBIT_PEOPLE = [
  { id: 'p1', type: 'person', name: 'Sam Rivera', handles: ['sms', 'whatsapp', 'instagram'], lastContactDays: 21, cadence: 21, birthday: 'Jun 16', linked: ['Plan birthday party', 'Buy birthday gift'] },
  { id: 'p2', type: 'person', name: 'Alex Kim', handles: ['sms', 'phone'], lastContactDays: 6, cadence: 14, birthday: null, linked: [] },
  { id: 'p3', type: 'person', name: 'Priya Nair', handles: ['whatsapp', 'instagram', 'linkedin'], lastContactDays: 34, cadence: 30, birthday: 'Sep 02', linked: ['Coffee catch-up'] },
];

const ORBIT_TODAY = [
  { id: 't1', type: 'task', title: 'Buy birthday gift', subtitle: 'Due today · linked to Sam', status: 'overdue', done: false },
  { id: 'h1', type: 'habit', title: 'Morning stretch', subtitle: 'Daily · 7:00 AM', streak: 17, done: true },
  { id: 'r1', type: 'routine', title: 'Water the plants', subtitle: 'Every Tuesday', done: false },
  { id: 't2', type: 'task', title: 'Send Q3 deck to Alex', subtitle: 'Today · 5:00 PM', done: false },
  { id: 'h2', type: 'habit', title: 'Read 20 minutes', subtitle: 'Daily · 9:30 PM', streak: 4, done: false },
  { id: 'pr1', type: 'project', title: 'Plan birthday party', subtitle: '3 of 7 milestones', done: false },
];

const ORBIT_ITEMS = [
  ...ORBIT_TODAY,
  { id: 'p1', type: 'person', title: 'Sam Rivera', subtitle: '21 days since contact', done: false },
  { id: 'p2', type: 'person', title: 'Alex Kim', subtitle: '6 days since contact', done: false },
  { id: 'p3', type: 'person', title: 'Priya Nair', subtitle: '34 days since contact', done: false },
  { id: 'h3', type: 'habit', title: 'No phone after 10pm', subtitle: 'Daily', streak: 0, done: false },
  { id: 't3', type: 'task', title: 'Renew passport', subtitle: 'Jul 30', done: false },
  { id: 'r2', type: 'routine', title: 'Weekly review', subtitle: 'Every Sunday', done: false },
  { id: 'pr2', type: 'project', title: 'Kitchen renovation', subtitle: '1 of 5 milestones', done: false },
];

// 16 weeks of streak intensity for the habit heatmap (0–4)
const ORBIT_HEATMAP = (() => {
  const out = [];
  for (let i = 0; i < 16 * 7; i++) {
    const r = Math.random();
    out.push(r < 0.12 ? 0 : r < 0.25 ? 1 : r < 0.45 ? 2 : r < 0.7 ? 3 : 4);
  }
  return out;
})();

const HANDLE_META = {
  sms:       { icon: 'message-square', label: 'Message', color: 'var(--routine)' },
  phone:     { icon: 'phone', label: 'Call', color: 'var(--task)' },
  whatsapp:  { icon: 'message-circle', label: 'WhatsApp', color: 'var(--success)' },
  instagram: { icon: 'instagram', label: 'Instagram', color: 'var(--person)' },
  linkedin:  { icon: 'linkedin', label: 'LinkedIn', color: 'var(--info)' },
  email:     { icon: 'mail', label: 'Email', color: 'var(--habit)' },
};

Object.assign(window, { ORBIT_PEOPLE, ORBIT_TODAY, ORBIT_ITEMS, ORBIT_HEATMAP, HANDLE_META });
