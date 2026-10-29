import { expect, it } from 'vitest';
import { switchSchema } from './switch.schema.js';
import { switchNodeSchema } from './generative.schema.js';

const base = { label: 'Notifications', checked: false, onCheckedChange() {} };

it('accepts controlled form intent and rejects native/styling escapes', () => {
  expect(switchSchema.safeParse(base).success).toBe(true);
  expect(
    switchSchema.safeParse({
      ...base,
      description: 'Account notifications',
      name: 'notifications',
      value: 'enabled',
      required: true,
      readOnly: true,
      disabled: false,
      loading: true,
    }).success,
  ).toBe(true);
  for (const invalid of [
    { checked: 'true' },
    { label: '' },
    { name: 'bad key' },
    { onCheckedChange: 'action' },
    { defaultChecked: true },
    { className: 'custom' },
    { style: {} },
    { onClick() {} },
  ])
    expect(switchSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
});

it('accepts explicit readable/writable boolean references without callbacks', () => {
  for (const mode of ['read', 'readWrite']) {
    const node = {
      type: 'Switch',
      label: 'Notifications',
      checked: { state: 'notifications', mode },
    };
    expect(switchNodeSchema.safeParse(node).success).toBe(true);
    expect(switchNodeSchema.safeParse({ ...node, onCheckedChange() {} }).success).toBe(
      false,
    );
  }
});
