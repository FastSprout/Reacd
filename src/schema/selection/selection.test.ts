import { expect, it } from 'vitest';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import {
  selectionOptionsSchema,
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
  canRequestSelection,
} from './index.js';

const items = [
  { value: 'first', label: ' First ', description: 'Available' },
  { value: 'retired', label: 'Retired', disabled: true },
] as const;

it('validates strict readonly catalogs and canonical unique keys', () => {
  const parsed = selectionOptionsSchema.parse(items);
  expect(parsed[0]?.label).toBe('First');
  expect(Object.isFrozen(parsed)).toBe(true);
  expect(Object.isFrozen(parsed[0])).toBe(true);
  expect(selectionOptionsSchema.safeParse([]).success).toBe(true);
  for (const invalid of [
    [{ value: '', label: 'Empty key' }],
    [{ value: ' padded ', label: 'Padded' }],
    [...items, items[0]],
    [{ value: 'x', label: 'X', html: '<div>' }],
    [{ value: 'x', label: 'X', disabled: 'false' }],
    [{ value: 'x'.repeat(SELECTION_POLICY.maximumValueLength + 1), label: 'X' }],
    Array.from({ length: SELECTION_POLICY.maximumOptions + 1 }, (_, index) => ({
      value: `item-${index}`,
      label: `Item ${index}`,
    })),
  ]) {
    expect(selectionOptionsSchema.safeParse(invalid).success).toBe(false);
  }
});

it('validates membership without normalizing host keys', () => {
  const single = singleSelectionValueSchema(items);
  expect(single.safeParse('').success).toBe(true);
  expect(single.safeParse('first').success).toBe(true);
  expect(single.safeParse('retired').success).toBe(true);
  expect(single.safeParse(' first ').success).toBe(false);
  expect(single.safeParse('missing').success).toBe(false);
  const multiple = multipleSelectionValueSchema(items);
  expect(multiple.safeParse([]).success).toBe(true);
  const selected = multiple.parse(['first', 'retired']);
  expect(Object.isFrozen(selected)).toBe(true);
  expect(multiple.safeParse(['first', 'first']).success).toBe(false);
  expect(multiple.safeParse(['missing']).success).toBe(false);
  expect(multiple.safeParse([' first ']).success).toBe(false);
  expect(multiple.safeParse('first').success).toBe(false);
  expect(singleSelectionValueSchema([]).safeParse('').success).toBe(true);
  expect(multipleSelectionValueSchema([]).safeParse([]).success).toBe(true);
  expect(() => singleSelectionValueSchema([items[0], items[0]])).toThrow();
  expect(() => multipleSelectionValueSchema([items[0], items[0]])).toThrow();
});

it('guards new disabled choices and retains controlled selections', () => {
  expect(canRequestSelection([], ['first'], items)).toBe(true);
  expect(canRequestSelection([], ['first', 'first'], items)).toBe(false);
  expect(canRequestSelection([], ['retired'], items)).toBe(false);
  expect(canRequestSelection(['retired'], ['retired', 'first'], items)).toBe(true);
  expect(canRequestSelection(['retired'], [], items)).toBe(true);
  expect(canRequestSelection(['missing'], ['missing'], items)).toBe(false);
  expect(canRequestSelection([], ['missing'], items)).toBe(false);
});
