import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageListSchema } from './page-list.schema.js';

describe('PageList declaration', () => {
  it('accepts safe composition', () => {
    expect(pageListSchema.safeParse({}).success).toBe(true);
    expect(
      pageListSchema.safeParse({
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
      expect(pageListSchema.safeParse({ ...{}, ...value }).success).toBe(false);
  });
});
