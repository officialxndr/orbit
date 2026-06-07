# Orbit — Design System

Orbit is a **local-first reminders app** built around five linkable entity types —
**Person, Task, Routine, Habit, Project** — with per-item configurable reminders,
streak gamification, search/filter throughout, and an optional Home Assistant
backchannel. It runs on iOS, Android, and as a React Native **Web** build
(Docker / Home Assistant add-on). No accounts, no cloud — everything stays on device.

The product's differentiator is **links**: a Person connects to a Task ("buy gift"),
a Project ("plan their party"), and so on. The visual identity leans into that idea —
an *orbit*: a calm center with everything circling and connected.

> **Source provided:** `uploads/orbit-app-plan.md` (the full build plan — concept,
> data model, reminder engine, screen inventory, RN stack). No existing codebase,
> Figma, or brand assets were supplied, so this system is an **original brand**
> designed to fit the plan. If/when real RN code or designs exist, reconcile against them.

---

## Brand in one breath
Warm, grounded, and quietly cosmic. Paper-colored surfaces, a deep indigo "Orbit"
brand color, and a five-hue entity spectrum that color-codes everything. Friendly
but precise — like a well-kept notebook, not a productivity dashboard.

---

## CONTENT FUNDAMENTALS

**Voice — a calm, encouraging friend.** Orbit speaks plainly and warmly. It never
nags, scolds, or guilt-trips (explicitly: stay-in-touch uses *decay framing*, not a
stopwatch). It celebrates small wins (streaks) without being loud about it.

- **Person:** second person, "you/your." The app addresses the user directly:
  "People to reach out to," "Today's progress," "Use global default."
- **Tone:** gentle, low-pressure, specific. Prefer "Haven't logged contact with Sam in
  ~3 weeks — reach out?" over "OVERDUE: 21 days." The tilde and "reach out?" matter —
  the data is user-logged, not surveilled, so language stays soft and honest.
- **Casing:** **Sentence case everywhere** — buttons ("Log contact," "Mark done today"),
  headers ("Stay in touch"), nav. Reserve Title Case for entity type names as proper
  nouns (Person, Task, Routine, Habit, Project) and screen titles ("Today," "Items,"
  "Settings"). Eyebrows and micro-labels are UPPERCASE mono ("ON YOUR PLATE," "OVERDUE").
- **Verbs first** on actions: "Add Person," "Log," "Mark done today," "Reach out."
- **Numbers are concrete and mono:** "17 day streak," "21 days since contact," "6 / 10."
  Approximate when the data is fuzzy ("~3 weeks").
- **Emoji:** essentially none in the UI chrome. One sanctioned exception: a 🎂 next to a
  birthday tag. Otherwise meaning is carried by Lucide icons + entity color, never emoji.
- **No jargon, no hype.** Never "supercharge," "effortless," "10x." Orbit is a utility
  you trust. Marketing display lines can be a touch lyrical ("Everything orbits,"
  "Stay close to the people who matter") but the in-app copy stays utilitarian.

Example copy in the wild:
> "Add to your orbit" · "What are you adding?" · "Reminder uses your global default —
> customize after saving." · "Local-first · no account · everything stays on this device."

---

## VISUAL FOUNDATIONS

**Color.** A **warm paper** neutral base (`--paper #FAF8F4`, never pure white app bg) with
near-black warm ink (`--ink-900 #1B1A17`). The brand color is **Orbit indigo**
(`--orbit-600 #4B43D9`) — used for primary actions, focus, links, the FAB glow. The
heart of the system is the **five-hue entity spectrum**, each with a base + soft tint:
Person coral `#E2613A`, Task blue `#2E73D8`, Routine teal `#0E9C88`, Habit violet
`#7E54E0`, Project amber `#C68A12`. These colors are *semantic* — they identify type
everywhere (left accent borders, icons, dots, tags). A separate **violet heat ramp**
(`--heat-0…4`) drives streak/consistency heatmaps. No gradients on brand surfaces —
color is flat and confident. Imagery, when used, is warm-toned, never cold.

**Type.** Three families:
- **Bricolage Grotesque** — display: screen titles, hero lines, the wordmark. Tight
  tracking (−0.018 to −0.03em), weights 700–800.
- **Hanken Grotesk** — UI + body: list rows, labels, paragraphs. Humanist, very legible
  at 13–17px. Weights 400–700.
- **JetBrains Mono** — numerals & micro-labels: streak counts, dates, "21d," RRULEs,
  UPPERCASE eyebrows. Tabular, calm.

Base body is 15px (mobile). Type scale runs 11 → 64px (see `tokens/typography.css`).

**Spacing & layout.** 4px grid (`--space-1…12`). Screen gutter 20px. 44px minimum tap
target. Bottom tab bar (64px) + FAB. Content is single-column, grouped into labeled
sections separated by hairline-flanked mono eyebrows.

**Radii.** Generously rounded but not pill-everything: inputs/buttons 10–14px, cards
18px, sheets 24px, avatars & FAB fully round. Entity icons sit in 10px rounded squares.

**Borders & cards.** Cards are white (`--surface`) on paper, 1px warm hairline border
(`--line #E9E3D9`) + a soft shadow. The **signature card treatment** is a **3px
entity-colored left accent border** (`--border-accent`) — this is how a glance tells you
a row's type. Cards never use a colored border *and* a colored fill (avoid that trope);
fill stays white, only the left edge carries color.

**Shadows.** Warm and soft — shadows are brown-black `rgba(44,36,22,…)`, never pure
black. A four-step elevation scale (`--shadow-xs…lg`) plus `--shadow-pop`, a colored
indigo glow reserved for the FAB. Inputs get a subtle 3px focus ring in `--orbit-100`.

**Motion.** Quick and springy, never showy. `--dur-fast 140ms` for presses,
`--dur-base 220ms` for sheets/toggles. `--ease-spring` (a gentle overshoot) powers the
completion check, the FAB, and switch thumbs; `--ease-out` for sheet entrances and
progress fills. Press state = scale down (0.9–0.97) and drop shadow. Bottom sheets slide
up from the bottom with a dimmed, slightly-blurred scrim. Reduced-motion is respected by
keeping end-states as the base style.

**Hover / press / states.** This is a touch-first product, so **press** is the primary
feedback: buttons and rows scale down slightly and lose elevation; the completion check
fills with the entity color and springs a checkmark. Disabled = 40–45% opacity. There is
no hover-heavy desktop styling; the web build inherits the same press affordances.

**Transparency & blur.** Used sparingly and purposefully: the bottom tab bar and iOS
glass pills use backdrop-blur over translucent surfaces; the bottom-sheet scrim is a
40%-ink wash with a 2px blur. Elsewhere surfaces are opaque.

**Backgrounds.** Flat warm paper. No photographic hero backgrounds, no repeating
patterns, no noise/grain in-app. The only "texture" is the streak heatmap grid. Marketing
contexts may place the app on a soft solid paper-gray (`#E9E5DE`) to let the device pop.

---

## ICONOGRAPHY

- **System:** [**Lucide**](https://lucide.dev) — clean, rounded, 2px-stroke open icons
  that match Orbit's friendly-but-precise tone. Loaded from CDN
  (`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js`); the `Icon` component
  renders any Lucide name (kebab-case) React-safely. **Substitution flag:** no bespoke
  icon set was provided, so Lucide is the chosen stand-in — swap if a custom set arrives.
- **Stroke & size:** 2px stroke (2.1–2.4 for emphasis/active). Common sizes 16/18/20/23px.
  Always `currentColor` so icons inherit entity/semantic color.
- **Entity icons** (canonical, in `ENTITY_META`): Person `user-round`, Task `circle-check`,
  Routine `repeat`, Habit `flame`, Project `folder`. Rendered in a soft-tinted rounded
  square (`EntityIcon`).
- **Contact deep-links** (Person): `message-square` (SMS), `phone`, `message-circle`
  (WhatsApp), `instagram`, `linkedin`, `mail` — each in its own tinted disc.
- **Emoji & unicode:** not used as iconography. The lone exception is 🎂 on birthday tags.
- **Logo:** the Orbit mark is a core indigo disc with a coral entity dot riding an
  orbital ring (`assets/orbit-mark.svg`). Do **not** redraw it ad hoc — use the provided
  SVGs (`orbit-mark`, `orbit-wordmark`, `orbit-wordmark-reversed`, `orbit-app-icon`).

---

## INDEX / MANIFEST

**Root**
- `styles.css` — global entry point (consumers link this); `@import`s the four token files.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter for use in Claude Code.

**`tokens/`** — `fonts.css` (webfonts), `colors.css`, `typography.css`, `spacing.css`
(spacing, radii, shadows, motion).

**`assets/`** — `orbit-mark.svg`, `orbit-wordmark.svg`, `orbit-wordmark-reversed.svg`,
`orbit-app-icon.svg`.

**`guidelines/`** — foundation specimen cards (Design System tab): colors (brand,
entities, neutrals, semantic, heatmap), type (display, body, mono, scale), spacing
(scale, radii, elevation), brand (logo).

**`components/`** — React primitives (namespace `window.OrbitDesignSystem_f3fc09`):
- `core/` — `Button`, `IconButton`, `Badge`, `Tag`, `Avatar`, `Card`, `Icon`
- `forms/` — `Input`, `SearchBar`, `SegmentedControl`, `Switch`, `CheckCircle`
- `data/` — `EntityIcon` (+ `ENTITY_META`), `EntityRow`, `StreakBadge`, `ProgressBar`, `Heatmap`
- `nav/` — `TabBar`, `ScreenHeader`, `Fab`

**`ui_kits/app/`** — interactive recreation of the Orbit iOS app. Open `index.html`.
See its `README.md`.

**Starting points:** `Button`, `EntityRow` (components) and the full Orbit app screen
(`ui_kits/app/orbit-app.startingpoint.html`).
