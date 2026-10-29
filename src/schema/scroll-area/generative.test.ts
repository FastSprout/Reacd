import { z } from 'zod';
import { expect, it } from 'vitest';
import { scrollAreaNodeSchema } from './generative.schema.js';
it('validates every child declaration of a scroll area', () => {
  const schema = scrollAreaNodeSchema(z.strictObject({ type: z.literal('Text') }));
  expect(
    schema.safeParse({
      type: 'ScrollArea',
      label: 'Messages',
      children: [{ type: 'Text' }],
    }).success,
  ).toBe(true);
  expect(
    schema.safeParse({
      type: 'ScrollArea',
      label: 'Messages',
      children: [{ type: 'p' }],
    }).success,
  ).toBe(false);
});
