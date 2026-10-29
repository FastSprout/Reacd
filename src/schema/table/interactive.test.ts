import { expect, it } from 'vitest';
import { TABLE_MODEL } from '../../../test-support/data-table.js';
import { interactiveTableSchema } from './interactive.schema.js';
import { transitionTableModel } from './transition.js';
it('validates complete controlled models and coherent editing permissions', () => {
  const base = { mode: 'interactive', caption: 'Orders', model: TABLE_MODEL };
  expect(interactiveTableSchema.safeParse(base).success).toBe(true);
  expect(
    interactiveTableSchema.safeParse({ ...base, onModelChange: () => {} }).success,
  ).toBe(true);
  const invalid = [
    { ...base, onModelChange: 'change' },
    { ...base, style: {} },
    { ...base, model: { ...TABLE_MODEL, selection: ['missing'] } },
    { ...base, model: { ...TABLE_MODEL, pagination: { pageIndex: 100, pageSize: 1 } } },
    {
      ...base,
      editable: {
        selection: true,
        sorting: true,
        filters: false,
        pagination: false,
      },
    },
    {
      ...base,
      editable: {
        selection: true,
        sorting: false,
        filters: true,
        pagination: false,
      },
    },
  ];
  for (const data of invalid)
    expect(interactiveTableSchema.safeParse(data).success).toBe(false);
});
it('creates complete atomic transitions without mutating current model', () => {
  const model = { ...TABLE_MODEL, pagination: { pageIndex: 2, pageSize: 1 } };
  const sort = transitionTableModel(model, 'sorting', [
    { column: 'amount', direction: 'ascending' },
  ]);
  expect(sort.pagination.pageIndex).toBe(0);
  expect(sort.sorting).toEqual([{ column: 'amount', direction: 'ascending' }]);
  expect(transitionTableModel(model, 'filters', []).pagination.pageIndex).toBe(0);
  expect(transitionTableModel(model, 'selection', ['a']).pagination.pageIndex).toBe(2);
  expect(
    transitionTableModel(model, 'pagination', { pageIndex: 1, pageSize: 1 }).pagination
      .pageIndex,
  ).toBe(1);
  expect(model.pagination.pageIndex).toBe(2);
});
