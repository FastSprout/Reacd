import { expect, it } from 'vitest';
import { chatShimmerSchema } from './chat-shimmer.schema.js';

it('accepts active/plain text and rejects styling or animation escapes', () => {
  expect(chatShimmerSchema.safeParse({ text: 'Working' }).success).toBe(true);
  expect(chatShimmerSchema.safeParse({ text: 'Working', active: false }).success).toBe(
    true,
  );
  for (const change of [
    { text: '' },
    { active: 'yes' },
    { duration: 99 },
    { style: {} },
    { className: 'x' },
    { children: 'Native text' },
  ])
    expect(chatShimmerSchema.safeParse({ text: 'Working', ...change }).success).toBe(
      false,
    );
});
