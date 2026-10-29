import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageBodySchema } from './page-body.schema.js';

describe('PageBody declaration', () => {
  it('accepts safe composition', () => {
    expect(pageBodySchema.safeParse({}).success).toBe(true);
    expect(
      pageBodySchema.safeParse({
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
      expect(pageBodySchema.safeParse({ ...{}, ...value }).success).toBe(false);
  });
});
