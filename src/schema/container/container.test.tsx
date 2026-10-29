import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { containerSchema } from './container.schema.js';

const valid = {};

describe('Container schema', () => {
  it('accepts its closed declaration', () => {
    expect(containerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects raw styling and native children', () => {
    expect(containerSchema.safeParse({ ...valid, className: 'custom' }).success).toBe(
      false,
    );
    expect(
      containerSchema.safeParse({
        ...valid,
        children: createElement('div'),
      }).success,
    ).toBe(false);
  });
});
