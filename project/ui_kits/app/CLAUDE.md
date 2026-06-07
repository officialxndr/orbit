# CLAUDE.md — Orbit App (handoff)

Continuation notes for Claude Code. This folder is a **web React recreation** of the
Orbit iOS app, built against the Orbit Design System. Read `../../readme.md` (the
design guide) and `README.md` (this kit) first.

## Current state — what's done
- Interactive click-through prototype: **Today, Items, Person detail, Habit detail,
  Settings**, plus a **Create sheet** (5-type picker → form) and a **Reminder config
  sheet** (the "Use global default" inheritance toggle).
- All screens compose design-system primitives from `window.OrbitDesignSystem_f3fc09`
  (`EntityRow`, `EntityIcon`, `StreakBadge`, `Heatmap`, `ProgressBar`, `SearchBar`,
  `SegmentedControl`, `Switch`, `CheckCircle`, `Button`, `IconButton`, `Tag`, `Avatar`,
  `Badge`, `ScreenHeader`, `TabBar`, `Fab`). Icons are Lucide (CDN).
- Device bezel from `ios-frame.jsx` (starter). State + nav live in `OrbitApp.jsx`.

## File map
| File | Contains |
|------|----------|
| `index.html` | Entry — loads React, Babel, Lucide, `_ds_bundle.js`, then the JSX files, mounts `<OrbitApp/>`. |
| `data.jsx` | Mock in-memory data (`ORBIT_PEOPLE/TODAY/ITEMS/HEATMAP`, `HANDLE_META`). |
| `screens.jsx` | `TodayScreen`, `ItemsScreen`, `SectionLabel`, `PersonNudgeRow`. |
| `detail.jsx` | `PersonDetail`, `HabitDetail`, `BackBar`, `ContactButton`, `InfoCard`. |
| `create.jsx` | `BottomSheet`, `NewSheet`, `ReminderSheet`, `Field`. |
| `OrbitApp.jsx` | App shell: tab nav, routing, sheets, toasts, `SettingsScreen`. |

## Conventions (keep these)
- Each `*.jsx` is a separate Babel script; share across files via `Object.assign(window, {…})`
  and read with `window.X` (or destructure from `window.OrbitDesignSystem_f3fc09`).
  Load order in `index.html` matters: data → ios-frame → screens → detail → create → OrbitApp.
- Style with the DS CSS custom properties (`var(--person)`, `var(--radius-lg)`, …), not hex.
- Sentence-case copy, calm/non-nagging tone, mono for numbers. No emoji except 🎂.

## Not done yet / next steps
1. **Missing screens** (stubs welcome): Settings → **Home Assistant connect** (URL +
   token + Test Connection), **link-picker** (search + link an entity), **global
   defaults editor** (per-kind `ReminderConfig`), **entity/new** full forms per type.
2. **Self-host fonts** — currently Google Fonts CDN. Swap to local woff2 when provided.
3. **Real data layer** — replace mock data with the SQLite/Drizzle repo from the plan
   (`uploads/orbit-app-plan.md`, §4–6) behind the repository interface.

## ⚠️ Production target is React Native, not web
This kit is web React for **design review only**. The real app is **Expo + React Native**
(`<View>`/`<Text>`/`StyleSheet`, Expo Router, Zustand, expo-sqlite/Drizzle,
expo-notifications). When porting a screen, treat these files as the **visual spec** and
re-implement with RN primitives — see `uploads/orbit-app-plan.md` §14 for the RN prompt
template and the 64-notification rolling-window scheduler (§6). Do **not** ship this HTML.
