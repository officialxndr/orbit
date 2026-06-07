# Orbit — app

A local-first reminders app built around five linkable entity types
(Person · Task · Routine · Habit · Project), with per-item configurable reminders
and global defaults, FTS search, streaks, contact deep-links, and optional Home
Assistant integration.

This is the real **Expo + React Native + TypeScript** implementation of the
design in `../project/` (the Claude Design handoff bundle). It targets **iOS and
Android**; the same codebase can also run on web with documented degradations
(no reliable background notifications).

## Stack

- **Expo SDK 56** (new architecture) · Expo Router (file-based nav)
- **expo-sqlite + Drizzle ORM** behind a repository interface (`src/data/`)
- **Zustand** store (`src/store/`)
- **expo-notifications** rolling-window scheduler + `expo-background-task` top-up
- **expo-secure-store** for the Home Assistant token
- Bricolage Grotesque / Hanken Grotesk / JetBrains Mono via `@expo-google-fonts`
- Lucide icons via `lucide-react-native`

## Project layout

```
app/                         # Expo Router routes (screens)
  _layout.tsx                # root: fonts, bootstrap, notifications, toast host
  (tabs)/                    # Today · Items · Settings
  entity/[id].tsx            # entity detail (branches per type)
  new.tsx                    # create sheet (type picker → form)   [modal]
  reminder/[rid].tsx         # per-item reminder config            [modal]
  settings/defaults.tsx      # global default reminder editor
  settings/home-assistant.tsx
src/
  theme/                     # design tokens (theme.ts) + font loader
  components/                # RN port of the Orbit Design System
  domain/                    # types, entity metadata, reminder logic, presenters, seed
  db/                        # Drizzle schema, client, migrations (FTS5 + triggers)
  data/                      # repository interface + sqlite implementation
  store/                     # Zustand store + toast
  notifications/             # scheduler, background top-up, content
  integrations/              # Home Assistant adapter
  lib/                       # id + datetime helpers
```

## Run locally

A **development build** is required (not Expo Go) because the app uses native
modules (SQLite, notifications, secure-store, reanimated/worklets).

```bash
npm install --legacy-peer-deps        # see note below
npx expo run:ios                      # or: npx expo run:android   (needs Xcode / Android SDK)
# then, for fast JS iteration:
npx expo start --dev-client
```

> **Install note:** `expo-router`'s web peer deps (radix/vaul) trip npm's strict
> peer resolution, so install with `--legacy-peer-deps` (Expo's own installer
> applies the same override).

## Verify

```bash
npx tsc --noEmit          # typecheck
npx expo-doctor           # config / dependency health (expect 21/21)
npx expo export --platform ios   # bundles the full JS graph
```

## Deploy (EAS → iOS / Android)

`eas.json` defines `development`, `preview`, and `production` profiles.

```bash
npm i -g eas-cli
eas login
eas init                  # links/creates the EAS project, writes extra.eas.projectId

# internal test builds
eas build --profile preview --platform ios
eas build --profile preview --platform android

# store builds
eas build --profile production --platform all
eas submit --profile production --platform ios       # needs Apple Developer account
eas submit --profile production --platform android    # needs Google Play account
```

Bundle id / package: `com.zanderhalverson.orbit` (change in `app.json` if needed).

## Notes & known follow-ups

- **App name:** "Orbit" is crowded on the App Store — pick a distinguishing
  qualifier before submitting (see `../orbit-app-plan.md`).
- **Icons/splash:** still using the create-expo-app placeholder assets in
  `assets/`. Replace with the Orbit mark from `../project/assets/` before launch.
- **Home Assistant fire-on-reminder:** the adapter + connect screen are wired and
  the token is stored securely; hooking `fireEvent`/`callService` to actual
  reminder firing (via a notification-response listener) is a small follow-up.
- **Seed data:** a populated sample dataset is inserted on first launch so the app
  opens to something explorable; it no-ops once real data exists.
