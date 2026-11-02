import {
  PRIMARY_PRESETS,
  NEUTRAL_PRESETS,
  FONT_PRESETS,
  RADIUS_PRESETS,
  DENSITY_PRESETS,
} from '../../design/preferences.js';
import type { DesignPreferences } from '../../design/preferences.js';

function items(values: readonly string[]) {
  return values.map((value) => ({
    value,
    label: themeOptionLabel(value),
  }));
}

export function themeOptionLabel(value: string) {
  return value === 'humanist'
    ? 'Public Sans' : value.charAt(0).toUpperCase() + value.slice(1);
}
export const THEME_FIELDS: readonly {
  readonly key: keyof DesignPreferences;
  readonly label: string;
  readonly items: readonly { readonly value: string; readonly label: string }[];
}[] = [
  { key: 'primary', label: 'Primary color', items: items(PRIMARY_PRESETS) },
  { key: 'neutral', label: 'Neutral color', items: items(NEUTRAL_PRESETS) },
  { key: 'font', label: 'Font family', items: items(FONT_PRESETS) },
  { key: 'radius', label: 'Corner radius', items: items(RADIUS_PRESETS) },
  { key: 'density', label: 'Density', items: items(DENSITY_PRESETS) },
];
