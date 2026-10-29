import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageCardSchema } from './page-card.schema.js';

describe('PageCard safe composition', () => {
  it('accepts a closed surface and independently interactive content', () => {
    expect(
      pageCardSchema.safeParse({
        title: 'Details',
        description: 'Safe supporting text',
        href: '/',
        variant: 'soft',
        intent: 'primary',
        highlight: true,
      }).success,
    ).toBe(true);
  });

  it('rejects ambiguous or unnamed actions and native styling', () => {
    for (const value of [
      { href: '/', onPress: () => undefined, title: 'Ambiguous' },
      { href: '/' },
      { onPress: () => undefined },
      { title: 'Invalid', href: 'javascript:alert(1)' },
      { title: 'No target', newWindow: true },
      { style: {} },
      { className: 'custom' },
      { variant: 'custom' },
      { children: createElement('div') },
    ])
      expect(pageCardSchema.safeParse(value).success).toBe(false);
  });
});
