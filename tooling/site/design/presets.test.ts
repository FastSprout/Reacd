import { expect, it } from 'vitest';
import { templateSchema } from '../../../src/schema/design/templates.schema.js';
import {
  DEFAULT_DESIGN_PREFERENCES,
  parseDesignPreferences,
  resolveDesignTemplate,
} from './preferences.js';
import { THEME_PRESETS, findThemePreset } from './presets.js';

it('offers twelve distinct valid named configurations with the exact default', () => {
  expect(THEME_PRESETS.map((entry) => entry.label)).toEqual([
    'Default',
    'Mono',
    'Cobalt',
    'Sky',
    'Mint',
    'Iris',
    'Crimson',
    'Coral',
    'Sunset',
    'Carbon',
    'Bubblegum',
    'Parchment',
  ]);
  expect(new Set(THEME_PRESETS.map((entry) => entry.key)).size).toBe(12);
  expect(
    new Set(THEME_PRESETS.map((entry) => JSON.stringify(entry.preferences))).size,
  ).toBe(12);
  expect(THEME_PRESETS[0]?.preferences).toBe(DEFAULT_DESIGN_PREFERENCES);
  for (const entry of THEME_PRESETS) {
    expect(parseDesignPreferences(entry.preferences)).toEqual(entry.preferences);
    for (const appearance of ['light', 'dark'] as const) {
      expect(
        templateSchema.safeParse(resolveDesignTemplate(entry.preferences, appearance))
          .success,
      ).toBe(true);
    }
  }
});

it('matches all five fields by value without requiring object identity', () => {
  for (const entry of THEME_PRESETS) {
    expect(findThemePreset(entry.preferences)).toBe(entry);
    expect(findThemePreset({ ...entry.preferences })).toBe(entry);
  }
});

it('reports Custom for nonpreset data differing in any single field', () => {
  for (const change of [
    { primary: 'violet' },
    { neutral: 'stone' },
    { font: 'system' },
    { radius: 'medium' },
    { density: 'compact' },
  ] as const) {
    expect(
      findThemePreset({ ...DEFAULT_DESIGN_PREFERENCES, ...change }),
    ).toBeUndefined();
  }
});
