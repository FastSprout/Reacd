import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageColumnsSchema } from './page-columns.schema.js';

describe('PageColumns declaration', () => {
  it('accepts safe composition', () => {
    expect(pageColumnsSchema.safeParse({}).success).toBe(true);
    expect(
      pageColumnsSchema.safeParse({
        ...{},
        children: 'Page content',
      }).success,
    ).toBe(true);
  });

  it('rejects arbitrary rendering hooks and native children', () => {
    for (const value of [
      { children: createElement('div') },
      { as: 'main' },
      { style: {} },
      { className: 'custom' },
      { onClick: () => undefined },
    ])
      expect(pageColumnsSchema.safeParse({ ...{}, ...value }).success).toBe(false);
  });
});
