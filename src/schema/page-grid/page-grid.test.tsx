import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageGridSchema } from './page-grid.schema.js';

describe('PageGrid declaration', () => {
  it('accepts safe composition', () => {
    expect(pageGridSchema.safeParse({}).success).toBe(true);
    expect(
      pageGridSchema.safeParse({
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
      expect(pageGridSchema.safeParse({ ...{}, ...value }).success).toBe(false);
  });
});
