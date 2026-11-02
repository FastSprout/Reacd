import { DEFAULT_DESIGN_PREFERENCES } from './preferences.js';
import type { DesignPreferences } from './preferences.js';

export interface ThemePreset {
  readonly key: string;
  readonly label: string;
  readonly preferences: DesignPreferences;
}

export const THEME_PRESETS: readonly ThemePreset[] = [
  { key: 'default', label: 'Default', preferences: DEFAULT_DESIGN_PREFERENCES },
  {
    key: 'mono',
    label: 'Mono',
    preferences: {
      primary: 'monochrome',
      neutral: 'zinc',
      font: 'system',
      radius: 'none',
      density: 'compact',
    },
  },
  {
    key: 'cobalt',
    label: 'Cobalt',
    preferences: {
      primary: 'blue',
      neutral: 'zinc',
      font: 'system',
      radius: 'small',
      density: 'comfortable',
    },
  },
  {
    key: 'sky',
    label: 'Sky',
    preferences: {
      primary: 'blue',
      neutral: 'slate',
      font: 'humanist',
      radius: 'large',
      density: 'comfortable',
    },
  },
  {
    key: 'mint',
    label: 'Mint',
    preferences: {
      primary: 'green',
      neutral: 'neutral',
      font: 'humanist',
      radius: 'medium',
      density: 'comfortable',
    },
  },
  {
    key: 'iris',
    label: 'Iris',
    preferences: {
      primary: 'violet',
      neutral: 'slate',
      font: 'humanist',
      radius: 'medium',
      density: 'comfortable',
    },
  },
  {
    key: 'crimson',
    label: 'Crimson',
    preferences: {
      primary: 'rose',
      neutral: 'zinc',
      font: 'system',
      radius: 'small',
      density: 'compact',
    },
  },
  {
    key: 'coral',
    label: 'Coral',
    preferences: {
      primary: 'rose',
      neutral: 'stone',
      font: 'humanist',
      radius: 'large',
      density: 'comfortable',
    },
  },
  {
    key: 'sunset',
    label: 'Sunset',
    preferences: {
      primary: 'amber',
      neutral: 'stone',
      font: 'humanist',
      radius: 'medium',
      density: 'comfortable',
    },
  },
  {
    key: 'carbon',
    label: 'Carbon',
    preferences: {
      primary: 'monochrome',
      neutral: 'gray',
      font: 'system',
      radius: 'small',
      density: 'compact',
    },
  },
  {
    key: 'bubblegum',
    label: 'Bubblegum',
    preferences: {
      primary: 'rose',
      neutral: 'neutral',
      font: 'humanist',
      radius: 'large',
      density: 'compact',
    },
  },
  {
    key: 'parchment',
    label: 'Parchment',
    preferences: {
      primary: 'amber',
      neutral: 'stone',
      font: 'system',
      radius: 'none',
      density: 'compact',
    },
  },
];

export function findThemePreset(
  preferences: DesignPreferences,
): ThemePreset | undefined {
  return THEME_PRESETS.find(
    (entry) =>
      entry.preferences.primary === preferences.primary &&
      entry.preferences.neutral === preferences.neutral &&
      entry.preferences.font === preferences.font &&
      entry.preferences.radius === preferences.radius &&
      entry.preferences.density === preferences.density,
  );
}
