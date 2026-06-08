/**
 * Theme store: tracks the appearance mode (system / light / dark), resolves it
 * against the OS setting, and swaps the live `colors` palette via applyScheme.
 * Screens call useThemeSync() so they re-render (and re-read `colors`) on change.
 */
import { create } from 'zustand';
import { Appearance } from 'react-native';
import { applyScheme, type Scheme } from './theme';
import { repository } from '@/data/sqliteRepository';

export type ThemeMode = 'system' | 'light' | 'dark';

function resolve(mode: ThemeMode, system: Scheme): Scheme {
  return mode === 'system' ? system : mode;
}

interface ThemeState {
  mode: ThemeMode;
  systemScheme: Scheme;
  scheme: Scheme;
  setMode: (mode: ThemeMode) => void;
  init: () => Promise<void>;
}

const initialSystem: Scheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
// Apply at module load so the very first render uses the right palette.
applyScheme(initialSystem);

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  systemScheme: initialSystem,
  scheme: initialSystem,

  setMode(mode) {
    const scheme = resolve(mode, get().systemScheme);
    applyScheme(scheme);
    set({ mode, scheme });
    repository.setSetting('appearance', mode).catch(() => {});
  },

  async init() {
    Appearance.addChangeListener(({ colorScheme }) => {
      const systemScheme: Scheme = colorScheme === 'dark' ? 'dark' : 'light';
      const scheme = resolve(get().mode, systemScheme);
      applyScheme(scheme);
      set({ systemScheme, scheme });
    });
    try {
      const saved = (await repository.getSetting('appearance')) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        const scheme = resolve(saved, get().systemScheme);
        applyScheme(scheme);
        set({ mode: saved, scheme });
      }
    } catch {
      /* first run / no saved preference */
    }
  },
}));

/** Subscribe a component to the active scheme so it re-renders when the theme changes. */
export function useThemeSync(): Scheme {
  return useThemeStore((s) => s.scheme);
}
