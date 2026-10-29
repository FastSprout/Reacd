import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { Text } from '../../components/text/text.js';
import { tabsSchema } from './tabs.schema.js';

const base = {
  label: 'Settings',
  value: 'profile',
  items: [{ value: 'profile', label: 'Profile' }],
  onValueChange: () => undefined,
};

describe('closed tab declarations', () => {
  it('accepts safe panels, disabled alternatives and manual orientation', () => {
    expect(tabsSchema.safeParse(base).success).toBe(true);
    expect(
      tabsSchema.safeParse({
        ...base,
        orientation: 'vertical',
        activationMode: 'manual',
        items: [
          { ...base.items[0], content: <Text>Profile content</Text> },
          { value: 'billing', label: 'Billing', disabled: true },
        ],
      }).success,
    ).toBe(true);
  });

  it('rejects ambiguous identities, disabled selection and rendering escapes', () => {
    for (const overrides of [
      { items: [] },
      { items: [base.items[0], base.items[0]] },
      { items: [{ value: 'profile', label: 'Profile', disabled: true }] },
      { value: 'unknown' },
      { label: ' ' },
      { className: 'custom' },
      { orientation: 'diagonal' },
      { activationMode: 'hover' },
      { items: [{ value: 'profile', label: 'Profile', content: createElement('p') }] },
      { items: [{ value: 'profile', label: 'Profile', onClick: () => undefined }] },
    ])
      expect(tabsSchema.safeParse({ ...base, ...overrides }).success).toBe(false);
  });
});
