import { expect, it } from 'vitest';
import { iconNodeSchema } from './index.js';
it('validates meaningful and decorative transport alternatives', () => {
  expect(
    iconNodeSchema.safeParse({ type: 'Icon', name: 'check', label: 'Complete' })
      .success,
  ).toBe(true);
  expect(
    iconNodeSchema.safeParse({ type: 'Icon', name: 'check', decorative: true }).success,
  ).toBe(true);
  expect(iconNodeSchema.safeParse({ type: 'Icon', name: 'check' }).success).toBe(false);
  expect(
    iconNodeSchema.safeParse({
      type: 'Icon',
      name: 'check',
      decorative: true,
      label: 'Duplicate',
    }).success,
  ).toBe(false);
});
