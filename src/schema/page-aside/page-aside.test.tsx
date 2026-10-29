import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageAsideSchema } from './page-aside.schema.js';

describe('PageAside declaration', () => {
  it('accepts safe composition', () => {
    expect(pageAsideSchema.safeParse({ label: 'Page navigation' }).success).toBe(true);
    expect(
      pageAsideSchema.safeParse({
        ...{ label: 'Page navigation' },
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
      expect(
        pageAsideSchema.safeParse({ ...{ label: 'Page navigation' }, ...value })
          .success,
      ).toBe(false);
  });
});
