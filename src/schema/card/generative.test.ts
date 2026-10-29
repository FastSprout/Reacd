import { z } from 'zod';
import { expect, it } from 'vitest';
import { cardNodeSchema } from './generative.schema.js';
it('validates every bounded card transport slot', () => {
  const child = z.strictObject({ type: z.literal('Text'), content: z.string() });
  const schema = cardNodeSchema(child);
  const text = { type: 'Text', content: 'Content' };
  expect(
    schema.safeParse({ type: 'Card', children: [text], header: [text], footer: [text] })
      .success,
  ).toBe(true);
  expect(
    schema.safeParse({ type: 'Card', children: [], header: [{ html: '<div>' }] })
      .success,
  ).toBe(false);
  expect(
    schema.safeParse({ type: 'Card', children: [], footer: [{ type: 'Text' }] })
      .success,
  ).toBe(false);
});
