import { expect, expectTypeOf, it } from 'vitest';
import type { SelectProps } from '../../components/select/index.js';
import { selectSchema } from './select.schema.js';
import { selectNodeSchema, selectNodeBindings } from './generative.schema.js';

const items = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B', disabled: true },
];
const base = { label: 'Status', items, value: 'a', onValueChange() {} };

it('preserves single callers and declares distinct controlled multiple values', () => {
  expect(selectSchema.safeParse(base).success).toBe(true);
  expect(selectSchema.safeParse({ ...base, value: '', required: true }).success).toBe(
    true,
  );
  expect(
    selectSchema.safeParse({
      ...base,
      mode: 'multiple',
      value: ['a', 'b'],
      name: 'status',
      description: 'Business status',
      readOnly: true,
      loading: true,
      clearable: true,
      placeholder: 'Choose status',
    }).success,
  ).toBe(true);
  expect(selectSchema.safeParse({ ...base, items: [], value: '' }).success).toBe(true);
  for (const invalid of [
    { mode: 'multiple', value: 'a' },
    { value: ['a'] },
    { mode: 'multiple', value: ['a', 'a'] },
    { value: 'missing' },
    { mode: 'multiple', value: ['missing'] },
    { defaultValue: 'a' },
    { onOpenChange() {} },
    { className: 'escape' },
  ]) {
    expect(selectSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
  }
  expectTypeOf<Extract<SelectProps, { mode: 'multiple' }>['value']>().toEqualTypeOf<
    readonly string[]
  >();
  expectTypeOf<
    Exclude<SelectProps, { mode: 'multiple' }>['value']
  >().toEqualTypeOf<string>();
});

it('binds single to text and multiple to selection with matching access', () => {
  const node = {
    type: 'Select',
    label: 'Status',
    items,
    value: { state: 'status', mode: 'readWrite' },
  };
  const single = selectNodeSchema.parse(node);
  const multiple = selectNodeSchema.parse({
    ...node,
    mode: 'multiple',
    value: { state: 'statuses', mode: 'read' },
  });
  expect(selectNodeBindings(single)[0]?.kinds).toEqual(['text']);
  expect(selectNodeBindings(multiple)[0]?.kinds).toEqual(['selection']);
  expect(selectNodeBindings(multiple)[0]?.mode).toBe('read');
  expect(selectNodeSchema.safeParse({ ...node, onValueChange() {} }).success).toBe(
    false,
  );
  expect(selectNodeSchema.safeParse({ ...node, mode: 'wrong' }).success).toBe(false);
});
