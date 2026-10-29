import { describe, expect, it } from 'vitest';
import { defaultProperties } from './default-properties.js';

describe('closed appearance defaults', () => {
  it('uses defaults for absent or undefined optional values', () => {
    expect(defaultProperties({ role: undefined }, { role: 'caption' })).toEqual({
      role: 'caption',
    });
    expect(defaultProperties(null, { role: 'caption' })).toEqual({ role: 'caption' });
    expect(defaultProperties(undefined, undefined)).toEqual({});
  });

  it('preserves explicit false, zero and empty values', () => {
    expect(
      defaultProperties(
        { active: false, count: 0, label: '' },
        {
          active: true,
          count: 1,
          label: 'Default',
        },
      ),
    ).toEqual({ active: false, count: 0, label: '' });
  });
});
