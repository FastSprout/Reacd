import { expect, it } from 'vitest';
import { userNodeSchema } from './generative.schema.js';

it('uses registered User action references and rejects executable callbacks', () => {
  for (const properties of [
    { type: 'User', name: 'Ada' },
    { type: 'User', name: 'Ada', href: '/ada' },
    { type: 'User', name: 'Ada', action: 'openProfile', disabled: false },
  ])
    expect(userNodeSchema.safeParse(properties).success).toBe(true);
  for (const change of [
    { action: 'openProfile', href: '/ada' },
    { disabled: true },
    { action: 'not a key' },
    { onPress: () => undefined },
  ])
    expect(
      userNodeSchema.safeParse({
        type: 'User',
        name: 'Ada',
        ...change,
      }).success,
    ).toBe(false);
});
