# Orbit — App UI Kit

A high-fidelity, interactive recreation of the Orbit iOS app (a local-first
reminders app built around five linkable entity types). Open `index.html` for the
clickable prototype inside an iPhone frame.

## Screens

| File | Screen | Notes |
|------|--------|-------|
| `screens.jsx` | **Today** + **Items** | Today: progress, search, overdue, on-your-plate, people-to-reach-out-to. Items: search + segmented type filter. |
| `detail.jsx` | **Person detail** + **Habit detail** | Person: contact deep-link buttons, stay-in-touch card, reminders, linked items. Habit: streak stats + 16-week heatmap. |
| `create.jsx` | **Create sheet** + **Reminder config sheet** | Create: entity-type picker → form. Reminder: prominent "Use global default" toggle over per-field config. |
| `OrbitApp.jsx` | **App shell** | Tab navigation (Today / Items / Settings), FAB, toasts, in-memory state, Settings screen. |

## Interactions to try
- Toggle completion checks on Today.
- Tap a **person** (Today → "People to reach out to", or Items → People) to open their detail; tap a contact button or **Log** to reset the stay-in-touch timer (toast confirms).
- Tap a **habit** to see the streak heatmap.
- Tap the **+ FAB** → pick a type → add an item (appears on Today).
- In a person's **Reminders**, tap one to open the config sheet and flip **Use global default**.

## Composition
Everything is built from the design-system primitives (`window.OrbitDesignSystem_f3fc09`):
`EntityRow`, `EntityIcon`, `StreakBadge`, `Heatmap`, `ProgressBar`, `SearchBar`,
`SegmentedControl`, `Switch`, `CheckCircle`, `Button`, `IconButton`, `Tag`,
`Avatar`, `Badge`, `ScreenHeader`, `TabBar`, `Fab`. The device bezel comes from
`ios-frame.jsx` (starter component). Icons are Lucide (CDN).

## Caveats
This is a **web recreation** for design review — not the production React Native
code. The plan targets Expo + React Native (`<View>`/`<Text>`/`StyleSheet`); these
screens use web React to mirror the visual language. Data is mock and in-memory.
