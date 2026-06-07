# Orbit — Build Plan

*(Working name: **Orbit**. Note: "Orbit" is crowded on the App Store — including an
"Orbit: Stay in Touch Reminders" that overlaps the people-reminder use case — so finalize a
distinguishing qualifier before launch. Candidates that read as distinct: **Orbital**, **In Orbit**,
**Orbit HQ**, **Orbit Deck**, or a coined spelling like **Orbiq**/**Orbita**. Plan uses "Orbit" throughout.)*

A local-first reminders app built around five linkable entity types, with per-item configurable
reminders (and global defaults), optional Home Assistant integration, search/filter throughout, and a
UI designed in Claude Design as real React Native screens — deployable to iOS, Android, and as a
React Native **Web** build (for Docker / Home Assistant add-on).

---

## 1. Core Concept

Five first-class item types, each able to link to the others:

| Type | Recurs? | Success measured by | Contains | Reminder-bearing? |
|------|---------|---------------------|----------|-------------------|
| **Person** | — | (anchor) | reminders, links | **Yes** — birthdays, stay-in-touch nudges |
| **Task** | no | done / not done | — (leaf) | Yes — due dates |
| **Routine** | yes | did it happen on schedule | — | Yes — recurring |
| **Habit** | yes | streak / consistency | — | Yes — recurring |
| **Project** | — | milestones met | Tasks | Yes — milestone dates |

**Decisions locked in:**
- **Person is reminder-bearing** (first-class). You can attach reminders directly to a person
  (birthday, "nudge me to message every N days") *and* link them to Tasks/Projects.
- **Routine vs. Habit is a single recurring type with a "Track as streak" toggle.** When streak mode is
  on, completions build a streak/consistency score and the UI gamifies it (streak count, best streak,
  calendar heatmap). When off, it's a plain schedule where success = "it happened." This keeps the
  create flow simple and lets a user gamify *anything* they want.
  - Implementation note: internally we can still store `type = 'routine'` with a `data.trackAsStreak`
    boolean rather than two separate types — fewer concepts, one form.

The differentiator vs. other reminder apps is **links**: Person → Task ("buy gift"), Person → Project
("plan their party"), Project → Tasks → People (assignees). Everything connects.

---

## 2. Architecture Principles

- **Local-first, no external server.** All user data in on-device SQLite. Fully functional offline,
  zero accounts.
- **Deployable as RN Web** so the same codebase can ship as a Docker container or Home Assistant
  add-on later. This constrains some native-only choices (see §3, §11).
- **HA is optional, opt-in, outbound.** Integration, not dependency.
- **Storage behind a repository interface** so we can swap the ORM (start with Drizzle, switch later
  without touching the domain layer).
- **The OS notification queue is a cache, not the source of truth.** SQLite holds every reminder.

```
┌─────────────────────────────────────────────────┐
│                   UI (RN screens)                │
│   search bars · filters · per-item reminder cfg  │
├─────────────────────────────────────────────────┤
│   Domain / store (Zustand)                        │
│   entities · links · reminder rules · defaults    │
├────────────┬──────────────┬──────────┬───────────┤
│  Storage   │ Notification │ HA       │ Contact    │
│  Repo      │ Scheduler    │ Adapter  │ Deep-links │
│  (Drizzle) │ (rolling win)│ (opt-in) │            │
└────────────┴──────────────┴──────────┴───────────┘
```

---

## 3. Tech Stack

- **Expo + React Native + TypeScript** (matches CardLedger / KUfit).
- **Expo Router** — file-based navigation.
- **expo-sqlite** on native; for **web**, use the same API via its WASM/OPFS backend (validate early —
  see §11) or a thin repo swap to an IndexedDB/SQLite-WASM driver. The **repository interface** makes
  this swap painless.
- **Drizzle ORM** — typed queries + migrations, behind the repo interface so it's replaceable.
- **expo-notifications** — local scheduled notifications (native). On web, fall back to the
  Notifications API / in-app reminders (web can't do reliable background notifications — documented limitation).
- **expo-task-manager / expo-background-fetch** — background top-up of the notification queue (native only).
- **expo-secure-store** — HA token storage (native); web uses a guarded fallback.
- **Zustand** — state.
- **Reanimated 3** — animations (streak toggles, card interactions).
- **expo-linking / Linking** — contact deep-links (see §8).

Targets: **iOS, Android, Web** (web build → Docker / HA add-on).

---

## 4. Data Model

Generic-entity model so new types never require a schema reshape.

```sql
CREATE TABLE entities (
  id            TEXT PRIMARY KEY,         -- uuid
  type          TEXT NOT NULL,            -- 'person'|'task'|'routine'|'habit'|'project'
  title         TEXT NOT NULL,
  notes         TEXT,
  data          TEXT,                     -- JSON: type-specific fields
  parent_id     TEXT,                     -- Task -> Project
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,
  archived_at   INTEGER
);

CREATE TABLE links (
  id            TEXT PRIMARY KEY,
  from_id       TEXT NOT NULL,
  to_id         TEXT NOT NULL,
  relation      TEXT,                     -- 'assignee'|'about'|'gift_for'|free-form
  created_at    INTEGER NOT NULL
);

-- Reminder rules attach to ANY entity. Per-item, fully configurable (see §6).
CREATE TABLE reminders (
  id            TEXT PRIMARY KEY,
  entity_id     TEXT NOT NULL,
  kind          TEXT NOT NULL,            -- 'date'|'recurring'|'stay_in_touch'|'milestone'
  config        TEXT NOT NULL,            -- JSON ReminderConfig (see §6) — null fields = inherit default
  uses_default  INTEGER DEFAULT 1,        -- 1 = inherit global default; 0 = fully custom
  next_fire     INTEGER,                  -- denormalized for fast "soonest" queries
  enabled       INTEGER DEFAULT 1,
  ha_action     TEXT,                     -- optional JSON: HA event/service to fire alongside
  created_at    INTEGER NOT NULL
);

CREATE TABLE completions (
  id            TEXT PRIMARY KEY,
  entity_id     TEXT NOT NULL,
  date          INTEGER NOT NULL,
  status        TEXT NOT NULL             -- 'done'|'skipped'|'missed'
);

-- For Person stay-in-touch: when did the user last log contact?
CREATE TABLE contact_log (
  id            TEXT PRIMARY KEY,
  person_id     TEXT NOT NULL,
  contacted_at  INTEGER NOT NULL,
  channel       TEXT                      -- 'sms'|'whatsapp'|'instagram'|'manual'|...
);

-- Global default reminder settings (single row, or keyed by reminder kind)
CREATE TABLE settings (
  key           TEXT PRIMARY KEY,         -- e.g. 'default.stay_in_touch', 'default.recurring'
  value         TEXT NOT NULL             -- JSON ReminderConfig
);

-- FTS index for search (see §9)
CREATE VIRTUAL TABLE entities_fts USING fts5(title, notes, content='entities', content_rowid='rowid');
```

Type-specific fields live in `entities.data` JSON, e.g.
`Person: { birthday, handles: [{platform, value}], stayInTouchDays, giftIdeas[] }`.

---

## 5. Per-Item Configurable Reminders + Global Defaults

This is a headline feature. Every reminder-bearing item gets its **own** notification settings, with a
**global default** it can inherit or override.

**How inheritance works:**
- App ships with global defaults per reminder *kind*, editable in Settings
  (e.g. default stay-in-touch = every 21 days; default lead time = 1 day before; default time = 9:00 AM).
- When you add a reminder to an item, it starts with `uses_default = 1` (inherits the global default).
- A **"Use global default"** button on the per-item reminder screen resets it back to inheriting.
- Editing any field flips `uses_default = 0` and stores that item's custom `ReminderConfig`.
- Changing a global default automatically updates every item still set to inherit; custom items are untouched.

**`ReminderConfig` shape (the JSON in `reminders.config` and `settings.value`):**
```ts
interface ReminderConfig {
  // For 'stay_in_touch' (Person):
  cadenceDays?: number;          // nudge if no logged contact in N days (e.g. 21)
  // For 'recurring' (Routine/Habit):
  rrule?: string;                // iCal RRULE, e.g. FREQ=WEEKLY;BYDAY=TU
  // For 'date' (Task due, birthday, milestone):
  leadTimes?: number[];          // notify N minutes/days before (e.g. [0, 1440] = at time + 1 day before)
  // Common to all:
  timeOfDay?: string;            // "09:00"
  quietHours?: { start: string; end: string };
  repeatUntilDone?: boolean;     // keep nudging until marked done/contacted
  snoozeMinutes?: number;        // default snooze
  haAction?: { type: 'event'|'service'; name: string; data?: object } | null;
}
```

`null`/absent fields = inherit the matching field from the global default (field-level inheritance,
so a user can override just the time and inherit everything else).

**UI:** each item's detail screen has a "Reminders" section → tap a reminder → config sheet with a
prominent **"Use global default"** toggle/button at top, then the editable fields below (disabled/greyed
while inheriting, enabled once they choose to customize).

---

## 6. Notification Engine

**Constraint:** iOS allows only **64 pending scheduled local notifications** at once.

**Rolling-window strategy:**
1. SQLite is the full list; each reminder has a denormalized `next_fire`.
2. On app open + via background task, query the soonest ≤64 enabled, un-fired reminders.
3. Cancel the OS queue, reschedule exactly those (applying each item's resolved `ReminderConfig`).
4. On fire / app open, recompute `next_fire` for recurring + stay-in-touch items and top up.
5. Recurring rules count as one OS slot each — prefer them.

**Resolving a reminder = merge(item config over global default)** before scheduling, so inheritance is
computed at schedule time. Quiet hours shift the fire time; `repeatUntilDone` re-arms on next window.

**Android:** Doze can delay the background *top-up*, not delivery of already-scheduled notifications.
`SCHEDULE_EXACT_ALARM` for minute-precision on Android 12+.

**Web:** no reliable background notifications — show due reminders in-app on open and use the
Notifications API only while the tab is alive. Documented as a platform limitation of the web build.

Use a **development build** (not Expo Go) for production-accurate behavior.

---

## 7. Stay-in-Touch & Last-Contacted (the "no button" problem)

**Reality check:** there is **no API on iOS or Android** to read when a user last messaged a contact,
and **none at all** for third-party platforms (Instagram, LinkedIn, Facebook, WhatsApp, etc.) — app
sandboxing + platform privacy rules make passive detection impossible. Android's SMS/call-log
permissions exist but Google Play only grants them to default-SMS/dialer apps, which a reminder app
can't qualify as, and they wouldn't cover other platforms anyway.

**So the reset is folded into an action the user already takes — not a separate button:**

- **Per-platform deep-link buttons on each Person.** Store the person's handles
  (`{platform, value}[]`). Render buttons that open the real app to that contact AND stamp
  `contact_log` with `now`:
  - SMS `sms:+1555…`, Call `tel:`, Email `mailto:`, WhatsApp `whatsapp://send?phone=…`,
    Telegram `https://t.me/<user>`, Instagram `instagram://user?username=<user>`,
    LinkedIn `https://www.linkedin.com/in/<user>`, Facebook `fb://…`/web fallback.
  - Tap → `Linking.openURL(...)` + write `contact_log`. The nudge timer resets as a side effect of
    reaching out, which the user wanted to do anyway. **No extra button.**
- **Quick "Log contact" affordances** for cases where they messaged elsewhere: a Share-sheet target
  and (iOS) an **App Intent / Shortcut** so "Log contact with [Person]" works from a Back Tap, Focus
  automation, or Siri — still no in-app button needed.
- **Home Assistant backchannel (power users):** an HA automation can hit an app webhook/intent to
  stamp `contact_log` from whatever signals HA has. Niche but a real passive-ish path, and on-brand
  for your setup.
- **Decay framing:** "Haven't logged contact with Sam in ~3 weeks — reach out?" rather than a precise
  timer, since the data is user-logged, not observed. The `cadenceDays` in `ReminderConfig` (per-person,
  with a global default) drives when this fires.

---

## 8. Contact Deep-Link Map (reference)

| Platform | Scheme / URL | Stamps contact_log |
|----------|--------------|--------------------|
| SMS | `sms:<number>` | ✅ |
| Call | `tel:<number>` | ✅ |
| Email | `mailto:<addr>` | ✅ |
| WhatsApp | `whatsapp://send?phone=<number>` | ✅ |
| Telegram | `https://t.me/<username>` | ✅ |
| Instagram | `instagram://user?username=<u>` (web fallback) | ✅ |
| LinkedIn | `https://www.linkedin.com/in/<slug>` | ✅ |
| Facebook | `fb://profile/<id>` (web fallback) | ✅ |
| Signal | `sgnl://` (limited) | ✅ |
| Custom | user-entered URL | ✅ |

Each Person can hold multiple handles; buttons render only for handles that exist.

---

## 9. Search & Filters (throughout)

Search and filtering wherever a list of items appears.

- **Global search** (top of Items browser + a search entry on Today): SQLite **FTS5** over
  `title` + `notes` for fast fuzzy-ish matching; keep `entities_fts` in sync via triggers on
  `entities` insert/update/delete.
- **Per-type filters:** segmented control (Person/Task/Routine/Habit/Project/All).
- **Attribute filters:** by reminder status (due today / overdue / upcoming / none), by streak state
  (active streak / broken), by linked-to (e.g. "show everything linked to this Person/Project"),
  by archived.
- **Sort options:** soonest reminder, recently updated, alphabetical, longest-since-contact (People).
- **Link-aware search:** from an entity detail, a search box to find-and-link another entity
  ("link a Task to this Person").
- **Saved/quick filters** (later): pin common views like "Overdue tasks," "People I'm overdue to message."

Put a search bar on: Items browser, the link-picker, and anywhere a `FlatList` exceeds ~10 items.

---

## 10. Screen Inventory

```
app/
  (tabs)/
    index.tsx          # Today — soonest reminders, completion toggles, search, FAB
    items.tsx          # Browse all entities — search bar + type/attribute filters
    _layout.tsx        # Tab navigator
  entity/[id].tsx      # Entity detail — fields, reminders (per-item config), linked items
  entity/new.tsx       # Create — type picker -> type-specific form
  entity/[id]/reminder/[rid].tsx  # Per-item reminder config sheet (Use-global-default toggle)
  link-picker.tsx      # Search + select an entity to link
  settings/index.tsx   # General + global default reminder settings
  settings/home-assistant.tsx  # HA URL + token + test connection
  settings/defaults.tsx        # Edit global default ReminderConfig per kind
  _layout.tsx          # Root layout
```

---

## 11. Home Assistant Integration (optional, opt-in)

Settings → Home Assistant:
- **Base URL** field — accepts LAN (`http://homeassistant.local:8123`) **or** a remote URL
  (Nabu Casa / reverse proxy), so remote-server users work too.
- **Long-Lived Access Token** — pasted by user, stored in `expo-secure-store`.
- **Test Connection** button → `GET /api/` with `Authorization: Bearer <token>`.

Capabilities:
- Fire an HA **event** or call a **service/webhook** when a reminder triggers
  (`POST /api/events/<type>` or `POST /api/services/<domain>/<service>`), enabling automations
  (flash lights when a routine is due, TTS a birthday — fits your AV/stage + HA floorplan work).
- Optional: expose "next reminder" so HA dashboards can show it.

Adapter (everything HA behind this; if unconfigured, never called):
```ts
interface HAAdapter {
  testConnection(): Promise<boolean>;
  fireEvent(eventType: string, data: object): Promise<void>;
  callService(domain: string, service: string, data: object): Promise<void>;
}
```

All calls are direct device → HA, no third party — consistent with no-external-server.

---

## 12. Deployment posture (RN Web → Docker / HA add-on)

- Keep all native-only features (notifications, secure-store, background tasks) behind capability
  checks so the **web build** degrades gracefully (in-app reminders instead of OS notifications, etc.).
- The web bundle (Expo web export) can be served from a tiny static container; an HA add-on wraps that
  container. Document the web limitations (no reliable background notifications).
- Validate **expo-sqlite on web** (WASM/OPFS persistence) early — this is the riskiest cross-platform
  piece. The storage repository interface lets you swap to a SQLite-WASM or IndexedDB driver on web if
  needed without touching domain code.

---

## 13. Build Roadmap (priority: UI → data → notifications)

**Phase 0 — Scaffold.** Expo + TS + Router. Build the **design system (`theme.ts`)** first.

**Phase 1 — UI in Claude Design (priority #1).** Generate the screens as real RN `.tsx` (see §14),
including search bars and filter controls, wired to navigation against mock data.

**Phase 2 — Data + storage (priority #2).** SQLite + Drizzle behind the repo interface; entity/link/
reminder/settings/contact_log CRUD; FTS triggers; Zustand store. Swap mock data for real queries.

**Phase 3 — Notifications (priority #3).** expo-notifications + rolling-window scheduler + config
resolution (item-over-default merge) + background top-up.

**Phase 4 — Stay-in-touch + deep links.** Contact buttons, contact_log stamping, App Intent/Shortcut.

**Phase 5 — Home Assistant.** Settings, secure token, adapter, fire-on-reminder.

**Phase 6 — Web/Docker/HA-addon + polish.** Capability gating, web export, empty states, a11y,
dev build, store-compliance pass.

---

## 14. Using Claude Design for React Native (avoiding the index.html trap)

**Why it happened:** Claude Design / Artifacts default to **React-for-web** — browser preview,
`<div>`/CSS/Tailwind, packaged as `index.html`/web `.tsx`. Not React Native; won't drop into Expo.

**Fix:** explicitly constrain the primitives. RN has no `<div>`, no CSS files, no Tailwind by default —
it uses `<View>`, `<Text>`, `StyleSheet.create`, Flexbox.

### Prompt template (forces real RN output)

> Build this as a **React Native** screen for an **Expo Router** app, not a web page.
> Output a single `.tsx` file using only React Native primitives.
>
> **Hard requirements:**
> - Import from `react-native`: `View`, `Text`, `Pressable`, `ScrollView`, `FlatList`, `TextInput`, `StyleSheet`, `SafeAreaView`.
> - **No** `<div>`, `<span>`, `<button>`, `<input>`, `<img>`, HTML tags, CSS files, Tailwind, or `className`.
> - Styling **only** via `StyleSheet.create({...})` + inline style arrays. Flexbox for layout.
> - Taps via `Pressable`/`TouchableOpacity`, not `onClick`. Text input via `<TextInput>`, not `<input>`.
> - Images via `<Image source={...} />` from `react-native`.
> - Navigation via `expo-router` (`useRouter`), not anchors.
> - Wrap screens in `SafeAreaView`.
> - Pull colors/spacing/fonts from the `theme` object I provide.
> - Default-export the component. Assume Reanimated 3 is available (`react-native-reanimated`).
>
> Must run unmodified in an Expo project under `app/`. Do not produce HTML or a web preview.

### Per-screen example (Today)
> Screen: **Today**. `SafeAreaView` + header with today's date. A `TextInput` search bar under the
> header. A `FlatList` of reminder cards; each card: colored left-border accent by entity type, title,
> subtitle (time/relation), circular check `Pressable` toggling completion with a Reanimated spring.
> Progress bar under header for today's completion rate. FAB (bottom-right) → `router.push('/entity/new')`.
> Empty state when no reminders.

### Tips
- **Provide `theme.ts` first**, then generate screens — keeps them visually consistent.
- **One screen per request.** Verify it stayed in RN.
- **Grep each output** for `div`, `className`, `onClick`, `<img`, `<input`, `px` in styles —
  any hit = it drifted to web; regenerate repeating the constraint.
- Paste a sample existing RN component so it matches your conventions.

---

## 15. Open Decisions (smaller, for later)

- **Drizzle vs raw SQL** — going Drizzle, but repo interface keeps it swappable (your requirement).
- **expo-sqlite web persistence** — validate early (§12); riskiest cross-platform piece.
- **Streak visualization** — calendar heatmap vs ring vs simple count (UX choice during Phase 1).
- **Widget / lock-screen support** (native) — nice-to-have, post-MVP.
