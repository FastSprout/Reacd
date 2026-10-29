import { expect, it } from 'vitest';
import { selectMenuSchema } from './select-menu.schema.js';
import { SELECTION_POLICY } from '../../core/selection-policy.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'two words', label: 'Second choice', disabled: true },
];
const base = {
  label: 'Choose records',
  items,
  value: '',
  onValueChange: () => undefined,
};

it('accepts canonical single/multiple empties and disabled host selections', () => {
  for (const properties of [
    base,
    { ...base, value: '42' },
    { ...base, value: 'two words' },
    { ...base, items: [] },
    { ...base, mode: 'multiple', value: [] },
    { ...base, mode: 'multiple', value: ['two words', '42'] },
  ])
    expect(selectMenuSchema.safeParse(properties).success).toBe(true);
});

it('returns failure rather than throwing for dirty invalid catalogs', () => {
  const catalogs = [
    [{ value: ' 42', label: 'Answer' }],
    [
      { value: '42', label: 'Answer' },
      { value: '42', label: 'Duplicate' },
    ],
    Array.from({ length: SELECTION_POLICY.maximumOptions + 1 }, (_, index) => ({
      value: `key${index}`,
      label: `Label ${index}`,
    })),
  ];
  for (const catalog of catalogs) {
    expect(selectMenuSchema.safeParse({ ...base, items: catalog }).success).toBe(false);
    expect(
      selectMenuSchema.safeParse({
        ...base,
        items: catalog,
        mode: 'multiple',
        value: [],
      }).success,
    ).toBe(false);
  }
});

it('rejects absent/duplicate keys, invalid modes, styling and partial pairs', () => {
  for (const extra of [
    { value: 'missing' },
    { mode: 'multiple', value: ['42', '42'] },
    { value: ['42'] },
    { mode: 'multiple', value: '42' },
    { mode: 'multiple', value: [], onValueChange: 'invalid' },
    { multiple: true },
    { style: {} },
    { className: 'custom' },
    { render: () => null },
    { open: true },
    { onOpenChange: () => undefined },
    { query: '' },
    { onQueryChange: () => undefined },
    { visibleValues: ['missing'] },
    { query: 'line\rbreak', onQueryChange: () => undefined },
  ])
    expect(selectMenuSchema.safeParse({ ...base, ...extra }).success).toBe(false);
});

it('accepts independent controlled query/disclosure and empty visible results', () => {
  expect(
    selectMenuSchema.safeParse({
      ...base,
      value: '42',
      query: 'different words',
      onQueryChange: () => false,
      queryReadOnly: true,
      open: true,
      onOpenChange: () => false,
      visibleValues: [],
    }).success,
  ).toBe(true);
});
