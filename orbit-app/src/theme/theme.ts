/**
 * Orbit — design tokens, ported 1:1 from the Orbit Design System CSS tokens
 * (project/tokens/*.css). Warm "paper" neutrals, cosmic-indigo brand, and a
 * five-hue entity spectrum. Use these everywhere instead of raw hex.
 */
import type { TextStyle, ViewStyle } from 'react-native';

export type Scheme = 'light' | 'dark';

/** Raw palette: warm "paper" light theme. */
const lightRaw = {
  // Warm neutrals (paper)
  paper: '#FAF8F4',
  paperSunk: '#F1ECE4',
  surface: '#FFFFFF',
  surface2: '#FBF9F6',

  ink900: '#1B1A17',
  ink700: '#423E37',
  ink500: '#6E6960',
  ink400: '#948D81',
  ink300: '#B7B0A4',

  line: '#E9E3D9',
  lineStrong: '#D9D2C6',
  fill: '#F2EDE5',
  fillHover: '#EAE3D8',

  // Brand: Orbit indigo
  orbit50: '#F4F3FD',
  orbit100: '#E8E6FB',
  orbit200: '#CFCBF6',
  orbit400: '#6A62E8',
  orbit500: '#574EE2',
  orbit600: '#4B43D9',
  orbit700: '#3A33B6',
  orbit800: '#2C268C',

  // Entity spectrum (base + soft tint)
  person: '#E2613A',
  personSoft: '#FBEADF',
  task: '#2E73D8',
  taskSoft: '#E4EDFB',
  routine: '#0E9C88',
  routineSoft: '#DCF2EE',
  habit: '#7E54E0',
  habitSoft: '#EEE7FB',
  project: '#C68A12',
  projectSoft: '#F8EFD7',

  // Streak / consistency heatmap ramp (violet)
  heat0: '#ECE7DE',
  heat1: '#DDD3F3',
  heat2: '#BCA6EA',
  heat3: '#9A78E2',
  heat4: '#7E54E0',

  // Semantic
  success: '#1F9D5B',
  successSoft: '#DFF2E7',
  warning: '#D98A1A',
  warningSoft: '#FBEEDA',
  danger: '#D4483B',
  dangerSoft: '#FBE6E3',
  info: '#2E73D8',
  infoSoft: '#E4EDFB',
  white: '#FFFFFF',
};

export type RawPalette = typeof lightRaw;

/** Dark theme: warm near-black surfaces, light ink, brightened indigo, dark tints. */
const darkRaw: RawPalette = {
  ...lightRaw,

  paper: '#14130E',
  paperSunk: '#0E0D09',
  surface: '#1E1C16',
  surface2: '#26231B',

  ink900: '#F6F3EB',
  ink700: '#DFD9CC',
  ink500: '#A69D8C',
  ink400: '#7E7667',
  ink300: '#544E43',

  line: '#2B2922',
  lineStrong: '#3B382F',
  fill: '#26241D',
  fillHover: '#302D24',

  // Indigo brightened for dark surfaces; orbit100 becomes a dark tint and
  // orbit700 a light on-tint foreground (it's used as text on accentTint).
  orbit100: '#26244F',
  orbit400: '#948DF2',
  orbit500: '#8079EE',
  orbit600: '#6E66EC',
  orbit700: '#C5C0F4',

  // Entity base hues stay vivid (legible on dark); soft tints go dark.
  personSoft: '#3A241A',
  taskSoft: '#16243C',
  routineSoft: '#0F302A',
  habitSoft: '#271B41',
  projectSoft: '#352713',

  heat0: '#26241D',

  successSoft: '#12301F',
  warningSoft: '#33260F',
  dangerSoft: '#3A1E1A',
  infoSoft: '#16243C',
};

/** Build semantic aliases from a raw palette. */
function semantic(p: RawPalette) {
  return {
    ...p,
    textStrong: p.ink900,
    textBody: p.ink700,
    textMuted: p.ink500,
    textSubtle: p.ink400,
    textDisabled: p.ink300,
    textOnBrand: p.white,
    textLink: p.orbit600,

    surfacePage: p.paper,
    surfaceCard: p.surface,
    surfaceRaised: p.surface2,
    surfaceSunk: p.paperSunk,

    borderDefault: p.line,
    borderStrong: p.lineStrong,

    accent: p.orbit600,
    accentHover: p.orbit500,
    accentPressed: p.orbit700,
    accentTint: p.orbit100,
    focusRing: p.orbit400,
  };
}

/**
 * Live theme objects. These are mutated in place by `applyScheme`, so the ~250
 * `colors.x` references across the app pick up the active scheme without any
 * per-call-site changes — components just need to re-render (see useTheme).
 */
export const palette: RawPalette = { ...lightRaw };
export const colors = semantic(lightRaw);

/** Swap the live palette/colors to the given scheme (mutates in place). */
export function applyScheme(scheme: Scheme): void {
  const raw = scheme === 'dark' ? darkRaw : lightRaw;
  Object.assign(palette, raw);
  Object.assign(colors, semantic(raw));
}

/** 4px-grid spacing scale. */
export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
  11: 80,
  12: 96,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  pill: 999,
} as const;

export const border = {
  hairline: 1,
  accent: 3,
} as const;

/** Type-size scale (px). */
export const fontSize = {
  '2xs': 11,
  xs: 12,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
  '4xl': 48,
  '5xl': 64,
} as const;

/**
 * Font-family names — these MUST match the keys passed to `useFonts` in
 * src/theme/fonts.ts. React Native needs a distinct family per weight, so we
 * resolve weight -> concrete loaded family rather than relying on fontWeight.
 */
export const fonts = {
  display: {
    400: 'BricolageGrotesque_400Regular',
    500: 'BricolageGrotesque_500Medium',
    600: 'BricolageGrotesque_600SemiBold',
    700: 'BricolageGrotesque_700Bold',
    800: 'BricolageGrotesque_800ExtraBold',
  },
  sans: {
    400: 'HankenGrotesk_400Regular',
    500: 'HankenGrotesk_500Medium',
    600: 'HankenGrotesk_600SemiBold',
    700: 'HankenGrotesk_700Bold',
    800: 'HankenGrotesk_800ExtraBold',
  },
  mono: {
    400: 'JetBrainsMono_400Regular',
    500: 'JetBrainsMono_500Medium',
    600: 'JetBrainsMono_600SemiBold',
    700: 'JetBrainsMono_700Bold',
  },
} as const;

export type FontFamily = keyof typeof fonts;
export type FontWeight = 400 | 500 | 600 | 700 | 800;

/** Resolve a (family, weight) pair to a concrete loaded font name. */
export function font(family: FontFamily, weight: FontWeight = 400): string {
  const set = fonts[family] as Record<number, string>;
  return set[weight] ?? set[400];
}

/** Letter-spacing — design uses em; RN uses px, so we keep px values tuned for UI sizes. */
export const tracking = {
  tighter: -1.1, // big display
  tight: -0.5, // headings
  snug: -0.2, // UI titles
  normal: 0,
  wide: 0.5, // small caps, mono labels
  wider: 1.3, // uppercase eyebrows
} as const;

/** Soft, warm-tinted shadows mapped to RN shadow props (+ Android elevation). */
const SHADOW_COLOR = '#2C2416';
export const shadow: Record<
  'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pop',
  ViewStyle
> = {
  xs: { shadowColor: SHADOW_COLOR, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 1 },
  sm: { shadowColor: SHADOW_COLOR, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  md: { shadowColor: SHADOW_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 14, elevation: 5 },
  lg: { shadowColor: SHADOW_COLOR, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.14, shadowRadius: 24, elevation: 12 },
  xl: { shadowColor: SHADOW_COLOR, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.16, shadowRadius: 40, elevation: 18 },
  pop: { shadowColor: '#4B43D9', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 10 },
};

/** Layout constants. */
export const layout = {
  tapTarget: 44,
  screenPad: 20,
  tabbarHeight: 64,
  headerHeight: 56,
} as const;

/** Animation durations (ms). */
export const duration = {
  fast: 140,
  base: 220,
  slow: 360,
} as const;

/** Convenience text-style presets used across screens. */
export const text = {
  screenTitle: {
    fontFamily: font('display', 800),
    fontSize: fontSize.xl + 4, // 28
    color: colors.textStrong,
    letterSpacing: tracking.tight,
    lineHeight: 30,
  } as TextStyle,
  sectionLabel: {
    fontFamily: font('mono', 600),
    fontSize: fontSize['2xs'],
    letterSpacing: tracking.wider,
    textTransform: 'uppercase',
    color: colors.textSubtle,
  } as TextStyle,
  rowTitle: {
    fontFamily: font('sans', 600),
    fontSize: 15.5,
    color: colors.textStrong,
    letterSpacing: tracking.snug,
  } as TextStyle,
  rowSubtitle: {
    fontFamily: font('sans', 400),
    fontSize: fontSize.sm,
    color: colors.textMuted,
  } as TextStyle,
  body: {
    fontFamily: font('sans', 400),
    fontSize: fontSize.base,
    color: colors.textBody,
  } as TextStyle,
  mono: {
    fontFamily: font('mono', 500),
    fontSize: fontSize.sm,
    color: colors.textMuted,
  } as TextStyle,
} as const;

export const theme = {
  colors,
  palette,
  space,
  radius,
  border,
  fontSize,
  fonts,
  font,
  tracking,
  shadow,
  layout,
  duration,
  text,
};

export type Theme = typeof theme;
export default theme;
