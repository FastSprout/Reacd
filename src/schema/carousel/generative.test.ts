import { z } from 'zod';
import { expect, it } from 'vitest';
import { carouselNodeSchema } from './index.js';
it('validates every child collection and closed shared index references', () => {
  const schema = carouselNodeSchema(
    z.strictObject({ type: z.literal('Text'), content: z.string() }),
  );
  const node = {
    type: 'Carousel',
    label: 'Slides',
    value: { state: 'index', mode: 'readWrite' },
    items: [
      { id: 'first', label: 'First', children: [{ type: 'Text', content: 'First' }] },
    ],
  };
  expect(schema.safeParse(node).success).toBe(true);
  expect(
    schema.safeParse({ ...node, items: [...node.items, ...node.items] }).success,
  ).toBe(false);
  expect(
    schema.safeParse({
      ...node,
      items: [{ id: 'first', label: 'First', children: [{ html: 'raw' }] }],
    }).success,
  ).toBe(false);
  expect(schema.safeParse({ ...node, value: 1 }).success).toBe(false);
});
