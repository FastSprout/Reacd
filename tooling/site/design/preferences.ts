export const PRIMARY_PRESETS = [
  'monochrome',
  'green',
  'blue',
  'violet',
  'rose',
  'amber',
] as const;
export const NEUTRAL_PRESETS = ['neutral', 'slate', 'gray', 'zinc', 'stone'] as const;
export const FONT_PRESETS = ['system', 'humanist'] as const;
export const RADIUS_PRESETS = ['none', 'small', 'medium', 'large'] as const;
export const DENSITY_PRESETS = ['comfortable', 'compact'] as const;

export type PrimaryPreset = (typeof PRIMARY_PRESETS)[number];
export type NeutralPreset = (typeof NEUTRAL_PRESETS)[number];

export interface DesignPreferences {
  readonly primary: PrimaryPreset;
  readonly neutral: NeutralPreset;
  readonly font: (typeof FONT_PRESETS)[number];
  readonly radius: (typeof RADIUS_PRESETS)[number];
  readonly density: (typeof DENSITY_PRESETS)[number];
}

export const DEFAULT_DESIGN_PREFERENCES: DesignPreferences = Object.freeze({
  primary: 'monochrome',
  neutral: 'neutral',
  font: 'humanist',
  radius: 'large',
  density: 'comfortable',
});
const KEYS = ['primary', 'neutral', 'font', 'radius', 'density'] as const;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function option<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && values.some((candidate) => candidate === value);
}
export function parseDesignPreferences(value: unknown): DesignPreferences {
  if (
    !record(value) ||
    Object.keys(value).length !== KEYS.length ||
    !KEYS.every((key) => Object.hasOwn(value, key))
  ) {
    return DEFAULT_DESIGN_PREFERENCES;
  }
  const primary = value['primary'];
  const neutral = value['neutral'];
  const font = value['font'];
  const radius = value['radius'];
  const density = value['density'];
  if (
    !option(PRIMARY_PRESETS, primary) ||
    !option(NEUTRAL_PRESETS, neutral) ||
    !option(FONT_PRESETS, font) ||
    !option(RADIUS_PRESETS, radius) ||
    !option(DENSITY_PRESETS, density)
  )
    return DEFAULT_DESIGN_PREFERENCES;
  return { primary, neutral, font, radius, density };
}

export { resolveDesignTemplate } from './template.js';
