import { expect, it } from 'vitest';
import { buttonComponentSchema } from './button.schema.js';

const base = { label: 'Save', onPress: () => undefined };
it('preserves optional controlled pressed booleans and rejects other values', () => {
  for (const pressed of [true, false])
    expect(buttonComponentSchema.parse({ ...base, pressed })).toEqual({
      ...base, pressed,
    });
  expect(buttonComponentSchema.parse(base)).not.toHaveProperty('pressed');
  for (const pressed of [null, 'true', 'false', 'mixed', 0, 1])
    expect(buttonComponentSchema.safeParse({ ...base, pressed }).success).toBe(false);
});
it('requires a semantic icon for icon-only actions', () => {
  expect(buttonComponentSchema.safeParse({ ...base, iconOnly: true }).success)
    .toBe(false);
  expect(buttonComponentSchema.safeParse({
    ...base, leadingIcon: 'settings', iconOnly: true,
  }).success).toBe(true);
  expect(buttonComponentSchema.safeParse({
    ...base, trailingIcon: 'layout', iconOnly: true,
  }).success).toBe(true);
});
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
