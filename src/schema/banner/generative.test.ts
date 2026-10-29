import { z } from 'zod';
import { expect, it } from 'vitest';
import { bannerNodeSchema } from './generative.schema.js';
const schema = bannerNodeSchema(z.strictObject({ type: z.literal('Text') }));
it('requires writable boolean visibility and validates action declarations', () => {
  const valid = {
    type: 'Banner',
    title: 'Notice',
    open: { state: 'notice', mode: 'readWrite' },
  };
  expect(schema.safeParse(valid).success).toBe(true);
  expect(schema.safeParse({ ...valid, actions: [{ type: 'Text' }] }).success).toBe(
    true,
  );
  for (const change of [
    { open: true },
    { open: { state: 'notice', mode: 'read' } },
    { actions: [{ type: 'button' }] },
    { onOpenChange: () => undefined },
  ])
    expect(schema.safeParse({ ...valid, ...change }).success).toBe(false);
});
