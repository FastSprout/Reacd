import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { footerSchema } from './footer.schema.js';

const valid = {};

describe('Footer schema', () => {
  it('accepts its closed declaration', () => {
    expect(footerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects raw styling and native children', () => {
    expect(footerSchema.safeParse({ ...valid, className: 'custom' }).success).toBe(
      false,
    );
    expect(
      footerSchema.safeParse({
        ...valid,
        children: createElement('div'),
      }).success,
    ).toBe(false);
  });
});
