import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { headerSchema } from './header.schema.js';

const valid = { title: 'reacd' };

describe('Header schema', () => {
  it('accepts its closed declaration', () => {
    expect(headerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects raw styling and native children', () => {
    expect(headerSchema.safeParse({ ...valid, className: 'custom' }).success).toBe(
      false,
    );
    expect(
      headerSchema.safeParse({
        ...valid,
        children: createElement('div'),
      }).success,
    ).toBe(false);
  });
});
