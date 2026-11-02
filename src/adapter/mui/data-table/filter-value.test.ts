import { expect, it } from 'vitest';
import { updateColumnFilter } from './filter-value.js';
it('maps native text, number and boolean input values without invalid writes', () => {
  expect(
    updateColumnFilter([], { key: 'name', label: 'Name', kind: 'text' }, 'Ada'),
  ).toEqual([{ column: 'name', operator: 'contains', value: 'Ada' }]);
  expect(
    updateColumnFilter([], { key: 'age', label: 'Age', kind: 'number' }, '3'),
  ).toEqual([{ column: 'age', operator: 'equals', value: 3 }]);
  expect(
    updateColumnFilter([], { key: 'active', label: 'Active', kind: 'boolean' }, 'true'),
  ).toEqual([{ column: 'active', operator: 'equals', value: true }]);
  expect(
    updateColumnFilter([], { key: 'age', label: 'Age', kind: 'number' }, 'invalid'),
  ).toBeNull();
  expect(
    updateColumnFilter([], { key: 'name', label: 'Name', kind: 'text' }, ''),
  ).toEqual([]);
});

it('preserves other rules and rejects filter overflow', () => {
  const text = { key: 'name', label: 'Name', kind: 'text' } as const;
  const number = { key: 'age', label: 'Age', kind: 'number' } as const;
  const boolean = { key: 'active', label: 'Active', kind: 'boolean' } as const;
  const other = [{ column: 'age', operator: 'greaterThan', value: 0 }] as const;
  expect(updateColumnFilter(other, text, 'Ada')).toEqual([
    ...other,
    { column: 'name', operator: 'contains', value: 'Ada' },
  ]);
  expect(updateColumnFilter(other, number, '0')).toEqual([
    ...other,
    { column: 'age', operator: 'equals', value: 0 },
  ]);
  expect(updateColumnFilter(other, boolean, 'all')).toEqual(other);
  expect(updateColumnFilter([], boolean, 'false')).toEqual([
    { column: 'active', operator: 'equals', value: false },
  ]);
  expect(updateColumnFilter([], boolean, 'null')).toEqual([
    { column: 'active', operator: 'equals', value: null },
  ]);
  expect(updateColumnFilter([], boolean, 'invalid')).toBeNull();
  expect(
    updateColumnFilter(
      Array.from({ length: 12 }, (_, index) => ({
        column: `column-${index}`,
        operator: 'equals',
        value: 1,
      })),
      text,
      'Ada',
    ),
  ).toBeNull();
});
