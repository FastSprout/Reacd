import { expect, it } from 'vitest';
import { templateSchema } from '../../../src/schema/design/templates.schema.js';
import {
  DEFAULT_DESIGN_PREFERENCES,
  PRIMARY_PRESETS,
  NEUTRAL_PRESETS,
  FONT_PRESETS,
  RADIUS_PRESETS,
  DENSITY_PRESETS,
  parseDesignPreferences,
  resolveDesignTemplate,
} from './preferences.js';

it('rejects unknown or malformed persisted preferences', () => {
  for (const value of [
    null,
    [],
    false,
    {},
    { ...DEFAULT_DESIGN_PREFERENCES, primary: 'url(javascript:alert(1))' },
    { ...DEFAULT_DESIGN_PREFERENCES, extra: 'unsafe' },
  ]) {
    expect(parseDesignPreferences(value)).toEqual(DEFAULT_DESIGN_PREFERENCES);
  }
  for (const key of ['primary', 'neutral', 'font', 'radius', 'density']) {
    expect(parseDesignPreferences({ ...DEFAULT_DESIGN_PREFERENCES, [key]: 1 })).toEqual(
      DEFAULT_DESIGN_PREFERENCES,
    );
  }
  expect(
    parseDesignPreferences({
      primary: 'blue',
      neutral: 'gray',
      font: 'system',
      radius: 'large',
      extra: 1,
    }),
  ).toEqual(DEFAULT_DESIGN_PREFERENCES);
  expect(parseDesignPreferences(DEFAULT_DESIGN_PREFERENCES)).toEqual(
    DEFAULT_DESIGN_PREFERENCES,
  );
});

it('resolves every named preference combination into a valid SDK template', () => {
  for (const primary of PRIMARY_PRESETS)
    for (const neutral of NEUTRAL_PRESETS)
      for (const font of FONT_PRESETS)
        for (const radius of RADIUS_PRESETS)
          for (const density of DENSITY_PRESETS)
            for (const mode of ['light', 'dark'] as const) {
              const preferences = { primary, neutral, font, radius, density };
              expect(
                templateSchema.safeParse(resolveDesignTemplate(preferences, mode))
                  .success,
              ).toBe(true);
            }
});
