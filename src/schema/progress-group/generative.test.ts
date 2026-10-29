import { expect, it } from 'vitest';
import { progressGroupNodeSchema } from './generative.schema.js';
it('transports a validated segmented progress declaration without code', () => {
  const node = {
    type: 'ProgressGroup',
    label: 'Storage',
    items: [{ id: 'apps', label: 'Apps', value: 24 }],
  };
  expect(progressGroupNodeSchema.safeParse(node).success).toBe(true);
  expect(progressGroupNodeSchema.safeParse({ ...node, render: 'html' }).success).toBe(
    false,
  );
});
