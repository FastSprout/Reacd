import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { separatorSchema } from './separator.schema.js';

const valid = {};

describe('Separator schema', () => {
  it('accepts its closed declaration', () => {
    expect(separatorSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects raw styling and native children', () => {
    expect(separatorSchema.safeParse({ ...valid, className: 'custom' }).success).toBe(
      false,
    );
    expect(
      separatorSchema.safeParse({
        ...valid,
        children: createElement('div'),
      }).success,
    ).toBe(false);
  });
});
