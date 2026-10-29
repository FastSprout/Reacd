import { expect, it } from 'vitest';
import { buttonComponentSchema } from './button.schema.js';

const base = { label: 'Save', onPress: () => undefined };
it('accepts closed busy, semantic icon and existing button declarations', () => {
  expect(buttonComponentSchema.safeParse(base).success).toBe(true);
  expect(
    buttonComponentSchema.safeParse({
      ...base,
      loading: true,
      loadingLabel: 'Saving',
      leadingIcon: 'check',
      trailingIcon: 'external',
      disabled: true,
      intent: 'danger',
    }).success,
  ).toBe(true);
  for (const change of [
    { leadingIcon: 'arbitrary-library-icon' },
    { loadingLabel: '' },
    { children: 'Raw children' },
    { href: '/save' },
    { asChild: true },
    { onClick: () => undefined },
    { style: {} },
    { className: 'button' },
    { onPress: 'save' },
  ])
    expect(buttonComponentSchema.safeParse({ ...base, ...change }).success).toBe(false);
});
