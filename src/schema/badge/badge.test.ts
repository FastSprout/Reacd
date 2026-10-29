import { expect, it } from 'vitest';
import { badgeSchema } from './badge.schema.js';

it('accepts closed text badges and rejects interactive/styling escapes', () => {
  expect(badgeSchema.safeParse({ label: 'Ready' }).success).toBe(true);
  expect(
    badgeSchema.safeParse({
      label: 'Ready',
      leadingIcon: 'check',
      size: 'large',
      intent: 'primary',
    }).success,
  ).toBe(true);
  for (const change of [
    { label: '' },
    { leadingIcon: 'raw' },
    { size: 50 },
    { onClick: () => undefined },
    { href: '/badge' },
    { tabIndex: 0 },
    { className: 'badge' },
    { style: {} },
  ])
    expect(badgeSchema.safeParse({ label: 'Ready', ...change }).success).toBe(false);
});
