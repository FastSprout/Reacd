import { expect, it, vi } from 'vitest';
import { listboxSchema } from './listbox.schema.js';
import { listboxNodeSchema } from './generative.schema.js';
import { SELECTION_POLICY } from '../../core/selection-policy.js';

const items = [
  { value: '42', label: 'Answer', description: 'Opaque identifier' },
  { value: 'locked', label: 'Unavailable', disabled: true },
] as const;
const single = { label: 'Choice', items, value: '42', onValueChange: vi.fn() };

it('accepts canonical empty, single and multiple controlled selections', () => {
  expect(listboxSchema.parse(single).value).toBe('42');
  expect(listboxSchema.safeParse({ ...single, value: '' }).success).toBe(true);
  expect(listboxSchema.safeParse({ ...single, items: [], value: '' }).success).toBe(
    true,
  );
  expect(listboxSchema.safeParse({ ...single, value: 'locked' }).success).toBe(true);
  expect(
    listboxSchema.safeParse({
      ...single,
      mode: 'multiple',
      value: ['locked', '42'],
      required: true,
    }).success,
  ).toBe(true);
  expect(
    listboxSchema.safeParse({
      ...single,
      mode: 'multiple',
      items: [],
      value: [],
      readOnly: true,
    }).success,
  ).toBe(true);
});

it('rejects unsafe props, malformed callbacks and invalid value/catalog pairs', () => {
  const invalid = [
    { value: null },
    { value: [] },
    { value: 'unknown' },
    { label: '' },
    { className: 'custom' },
    { style: {} },
    { children: 'content' },
    { orientation: 'horizontal' },
    { max: 1 },
    { multiple: true },
    { onValueChange: false },
    { mode: 'multiple', value: ['42', '42'] },
    { mode: 'multiple', value: ['unknown'] },
    { mode: 'multiple', value: '42' },
    { items: [{ value: ' 42', label: 'Unstable key' }] },
    { items: [items[0], items[0]] },
    { items: [{ ...items[0], href: '/unsafe' }] },
    { locale: 'invalid' },
    { status: 'empty' },
    { clearLabel: '' },
  ];
  for (const change of invalid) {
    expect(listboxSchema.safeParse({ ...single, ...change }).success).toBe(false);
  }
  expect(
    listboxSchema.safeParse({
      ...single,
      items: Array.from({ length: SELECTION_POLICY.maximumOptions + 1 }, (_, n) => ({
        value: String(n),
        label: String(n),
      })),
    }).success,
  ).toBe(false);
});

it('requires explicit read/readWrite state references for generative values', () => {
  const node = {
    type: 'Listbox',
    label: 'Choice',
    items,
    value: { state: 'selection', mode: 'readWrite' },
  };
  expect(listboxNodeSchema.safeParse(node).success).toBe(true);
  expect(listboxNodeSchema.safeParse({ ...node, mode: 'multiple' }).success).toBe(true);
  expect(listboxNodeSchema.safeParse({ ...node, value: '42' }).success).toBe(false);
  expect(listboxNodeSchema.safeParse({ ...node, onValueChange: vi.fn() }).success).toBe(
    false,
  );
});
