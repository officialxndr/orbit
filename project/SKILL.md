---
name: orbit-design
description: Use this skill to generate well-branded interfaces and assets for Orbit (a local-first reminders app built around five linkable entity types — Person, Task, Routine, Habit, Project), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `readme.md` — the full design guide: brand, content/voice, visual foundations, iconography, manifest. Read this first.
- `styles.css` — link this one file to inherit every token (it `@import`s `tokens/`). Tokens are CSS custom properties (`--orbit-600`, `--person`, `--text-body`, `--radius-lg`, `--shadow-pop`, …).
- `tokens/` — colors, typography, spacing/radii/shadows/motion, fonts (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono from Google Fonts).
- `components/` — React UI primitives. In an HTML page: link `styles.css`, the Lucide UMD script, and `_ds_bundle.js`, then `const { Button, EntityRow, … } = window.OrbitDesignSystem_f3fc09`.
- `ui_kits/app/` — a full interactive recreation of the Orbit app to learn the patterns from.
- `assets/` — logo / wordmark / app-icon SVGs.

## House rules (summary — see readme.md for detail)
- Warm paper surfaces, deep indigo brand, five-hue entity spectrum. Type identified by a 3px entity-colored **left** accent border on white cards (never a colored fill).
- Sentence case copy; calm, encouraging, never nagging. Mono for numbers/dates/eyebrows.
- Lucide icons (2px stroke, currentColor). No emoji except 🎂 on birthdays.
- Soft warm shadows; springy, quick motion; press-to-shrink feedback; touch-first 44px targets.
