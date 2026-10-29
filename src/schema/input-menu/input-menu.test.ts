import { expect, it } from 'vitest';
import { inputMenuSchema } from './input-menu.schema.js';

const properties = {
  label: 'Destination',
  value: '',
  items: [],
  onValueChange: () => undefined,
};

it('accepts free text, empty domains and closed controlled disclosure', () => {
  expect(inputMenuSchema.safeParse(properties).success).toBe(true);
  expect(
    inputMenuSchema.safeParse({ ...properties, value: 'Custom town' }).success,
  ).toBe(true);
  expect(
    inputMenuSchema.safeParse({
      ...properties,
      open: false,
      onOpenChange: () => false,
    }).success,
  ).toBe(true);
});

it('rejects styling, duplicate/unknown keys and incomplete open pairs', () => {
  for (const extra of [
    { className: 'custom' },
    { style: {} },
    { open: true },
    { onOpenChange: () => undefined },
    { onOpenChange: 'invalid', open: false },
    { onValueChange: 'invalid' },
    {
      items: [
        { value: 'a', label: 'A' },
        { value: 'a', label: 'B' },
      ],
    },
    { visibleValues: ['unknown'] },
    { visibleValues: ['a', 'a'] },
  ])
    expect(inputMenuSchema.safeParse({ ...properties, ...extra }).success).toBe(false);
});

it('keeps known external order and permits an empty visible result subset', () => {
  const items = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ];
  expect(
    inputMenuSchema.safeParse({ ...properties, items, visibleValues: ['b', 'a'] })
      .success,
  ).toBe(true);
  expect(
    inputMenuSchema.safeParse({ ...properties, items, visibleValues: [] }).success,
  ).toBe(true);
});

it('reuses opaque canonical option keys without silently trimming identity', () => {
  expect(
    inputMenuSchema.safeParse({
      ...properties,
      items: [{ value: '42', label: 'Answer' }],
      visibleValues: ['42'],
    }).success,
  ).toBe(true);
  expect(
    inputMenuSchema.safeParse({
      ...properties,
      items: [{ value: ' 42', label: 'Answer' }],
    }).success,
  ).toBe(false);
});
