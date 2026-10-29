import { describe, expect, it } from 'vitest';
import { pageLogosSchema } from './page-logos.schema.js';

describe('PageLogos contract', () => {
  it('requires safe meaningful images and unique identities', () => {
    const item = { key: 'example', src: '/example-missing.png', alt: 'Example mark' };
    const base = { label: 'Example marks', items: [item] };
    expect(pageLogosSchema.safeParse(base).success).toBe(true);
    for (const extra of [
      { items: [item, item] },
      { items: [{ ...item, alt: '' }] },
      { items: [{ ...item, src: 'javascript:alert(1)' }] },
      { className: 'custom' },
      { marquee: true },
    ])
      expect(pageLogosSchema.safeParse({ ...base, ...extra }).success).toBe(false);
  });
});
