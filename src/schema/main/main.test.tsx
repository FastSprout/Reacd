import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { mainSchema } from './main.schema.js';

const valid = {};

describe('Main schema', () => {
  it('accepts its closed declaration', () => {
    expect(mainSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects raw styling and native children', () => {
    expect(mainSchema.safeParse({ ...valid, className: 'custom' }).success).toBe(false);
    expect(
      mainSchema.safeParse({
        ...valid,
        children: createElement('div'),
      }).success,
    ).toBe(false);
  });
});
