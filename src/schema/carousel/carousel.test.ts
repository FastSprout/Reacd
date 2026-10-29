import { expect, it } from 'vitest';
import { carouselSchema, carouselValueSchema } from './carousel.schema.js';
const base = {
  label: 'Highlights',
  items: [{ id: 'one', label: 'First' }],
  value: 0,
  onValueChange: () => undefined,
};
it('accepts bounded empty and controlled single/multiple slides', () => {
  expect(carouselSchema.safeParse(base).success).toBe(true);
  expect(carouselSchema.safeParse({ ...base, items: [] }).success).toBe(true);
  expect(
    carouselSchema.safeParse({
      ...base,
      items: [...base.items, { id: 'two', label: 'Second' }],
      value: 1,
      loop: true,
      orientation: 'vertical',
      onRetry: () => undefined,
    }).success,
  ).toBe(true);
  expect(carouselValueSchema(0).safeParse(0).success).toBe(true);
});
it('rejects invalid indexes, duplicate items and arbitrary presentation', () => {
  for (const change of [
    { value: -1 },
    { value: 1 },
    { value: 0.5 },
    { value: Number.NaN },
    { value: 1, items: [] },
    { items: [...base.items, ...base.items] },
    { items: [{ id: '', label: 'Bad' }] },
    { items: [{ id: 'a', label: '' }] },
    { onValueChange: 'next' },
    { style: {} },
    { className: 'carousel' },
    { onKeyDown: () => undefined },
    { autoplay: true },
    { orientation: 'diagonal' },
    {
      items: Array.from({ length: 21 }, (_, index) => ({
        id: `i${index}`,
        label: 'Item',
      })),
    },
  ])
    expect(carouselSchema.safeParse({ ...base, ...change }).success).toBe(false);
});
