import { expect, it } from 'vitest';
import { marqueeSchema } from './marquee.schema.js';
const base = {
  label: 'Notices',
  paused: true,
  onPausedChange: () => undefined,
  items: [{ id: 'one', label: 'Notice' }],
};
it('accepts bounded controlled text and empty states', () => {
  expect(marqueeSchema.safeParse(base).success).toBe(true);
  expect(
    marqueeSchema.safeParse({ ...base, items: [], direction: 'backward', pace: 'fast' })
      .success,
  ).toBe(true);
});
it('rejects duplicate, interactive and arbitrary visual content', () => {
  for (const change of [
    { items: [...base.items, ...base.items] },
    { items: [{ id: 'one', label: '' }] },
    { items: [{ id: 'one', label: 'Notice', href: '/notice' }] },
    { items: [{ id: 'one', label: 'Notice', children: 'Content' }] },
    {
      items: Array.from({ length: 21 }, (_, index) => ({
        id: `i${index}`,
        label: 'Notice',
      })),
    },
    { paused: 'yes' },
    { onPausedChange: 'pause' },
    { duration: 10 },
    { pace: 'arbitrary' },
    { className: 'ticker' },
    { style: {} },
  ])
    expect(marqueeSchema.safeParse({ ...base, ...change }).success).toBe(false);
});
