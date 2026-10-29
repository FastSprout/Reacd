import { expect, it } from 'vitest';
import { colorModeButtonSchema } from '../color-mode-button/index.js';
import { colorModeSwitchSchema } from '../color-mode-switch/index.js';
import { colorModeSelectSchema } from '../color-mode-select/index.js';
import { colorModeAvatarSchema } from '../color-mode-avatar/index.js';
import { colorModeImageSchema } from '../color-mode-image/index.js';

const control = {
  label: 'Appearance',
  value: 'system',
  resolvedMode: 'light',
  onValueChange() {},
};

it('closes preference controls and rejects contradictory resolved state', () => {
  for (const schema of [
    colorModeButtonSchema,
    colorModeSwitchSchema,
    colorModeSelectSchema,
  ]) {
    expect(schema.safeParse(control).success).toBe(true);
    expect(schema.safeParse({ ...control, value: 'light' }).success).toBe(true);
    for (const extra of [
      { value: 'automatic' },
      { resolvedMode: 'system' },
      { value: 'dark' },
      { label: '' },
      { onValueChange: 'toggle' },
      { className: 'dark' },
      { style: { color: 'red' } },
      { as: 'button' },
    ])
      expect(schema.safeParse({ ...control, ...extra }).success).toBe(false);
  }
  expect(
    colorModeSelectSchema.safeParse({
      ...control,
      labels: { system: 'Device preference', light: 'Day', dark: 'Night' },
    }).success,
  ).toBe(true);
  expect(
    colorModeSelectSchema.safeParse({
      ...control,
      labels: { dark: 'Night' },
    }).success,
  ).toBe(false);
});

it('validates mode-aware image sources and logical sizing', () => {
  const sources = { mode: 'dark', light: '/light.svg', dark: '/dark.svg' };
  expect(colorModeAvatarSchema.safeParse({ ...sources, name: 'Team' }).success).toBe(
    true,
  );
  expect(colorModeImageSchema.safeParse({ ...sources, alt: 'Diagram' }).success).toBe(
    true,
  );
  for (const extra of [
    { light: 'javascript:alert(1)' },
    { dark: '//other.example/image.svg' },
    { dark: 'https://user:pass@example.com/image.svg' },
    { mode: 'system' },
    { style: {} },
    { width: 200 },
  ]) {
    expect(
      colorModeImageSchema.safeParse({
        ...sources,
        alt: 'Diagram',
        ...extra,
      }).success,
    ).toBe(false);
  }
  expect(
    colorModeImageSchema.safeParse({
      ...sources,
      alt: '',
    }).success,
  ).toBe(false);
});
