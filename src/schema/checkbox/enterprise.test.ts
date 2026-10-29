import { expect, it } from 'vitest';
import { checkboxSchema } from './checkbox.schema.js';
import { checkboxNodeSchema, checkboxNodeBindings } from './generative.schema.js';

const base = { label: 'Approve', checked: false, onCheckedChange() {} };

it('accepts closed mixed and native-form semantics', () => {
  expect(
    checkboxSchema.safeParse({
      ...base,
      indeterminate: true,
      required: true,
      readOnly: true,
      description: 'Account approval',
      name: 'approved',
      value: 'accepted',
    }).success,
  ).toBe(true);
  for (const invalid of [
    { checked: 'indeterminate' },
    { indeterminate: 'mixed' },
    { name: 'invalid name' },
    { defaultChecked: true },
    { style: {} },
    { onClick() {} },
    { required: 'true' },
  ]) {
    expect(checkboxSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
  }
});

it('owns readable/writable checked state and readonly mixed-state references', () => {
  const node = {
    type: 'Checkbox',
    label: 'Approve',
    checked: { state: 'checked', mode: 'readWrite' },
    indeterminate: { state: 'mixed', mode: 'read' },
  };
  const parsed = checkboxNodeSchema.parse(node);
  expect(
    checkboxNodeBindings(parsed).map(({ property, mode }) => ({ property, mode })),
  ).toEqual([
    { property: 'checked', mode: 'readWrite' },
    { property: 'indeterminate', mode: 'read' },
  ]);
  const reader = checkboxNodeSchema.parse({
    ...node,
    indeterminate: false,
    checked: { state: 'checked', mode: 'read' },
  });
  expect(checkboxNodeBindings(reader)).toHaveLength(1);
  expect(
    checkboxNodeSchema.safeParse({
      ...node,
      indeterminate: {
        state: 'mixed',
        mode: 'readWrite',
      },
    }).success,
  ).toBe(false);
  expect(checkboxNodeSchema.safeParse({ ...node, onCheckedChange() {} }).success).toBe(
    false,
  );
});
