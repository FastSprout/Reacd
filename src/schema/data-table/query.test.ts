import { describe, expect, it } from 'vitest';
import { TABLE_MODEL } from '../../../test-support/data-table.js';
import { queryTable } from './query.js';
import { validateTableModel } from './validate-model.js';
import { validVisibleTable } from './validate-visible-model.js';

describe('typed table query model', () => {
  it('validates visible TSX data against its query counts and column contract', () => {
    const snapshot = { ...TABLE_MODEL, ...queryTable(TABLE_MODEL) };
    expect(validVisibleTable(snapshot)).toBe(true);
    for (const invalid of [
      { ...snapshot, totalRows: 0 },
      { ...snapshot, pageCount: 1 },
      { ...snapshot, pagination: { pageIndex: 4, pageSize: 1 } },
      { ...snapshot, rows: [] },
      { ...snapshot, rows: [{ id: 'a', cells: { unknown: 1 } }] },
    ])
      expect(validVisibleTable(invalid)).toBe(false);
  });
  it('uses stable multi-column sorting and keeps null cells last', () => {
    const model = {
      ...TABLE_MODEL,
      pagination: { pageIndex: 0, pageSize: 10 },
      rows: [
        { id: 'a', cells: { name: 'Same', amount: 2, active: true } },
        { id: 'b', cells: { name: 'Same', amount: 1, active: false } },
        { id: 'c', cells: { name: null, amount: null, active: null } },
        { id: 'd', cells: { name: 'Same', amount: 1, active: false } },
        { id: 'e', cells: { name: 'Z', amount: 5, active: true } },
      ],
      sorting: [
        { column: 'name', direction: 'ascending' },
        { column: 'amount', direction: 'descending' },
      ] as const,
    };
    expect(queryTable(model).rows.map((row) => row.id)).toEqual([
      'a',
      'b',
      'd',
      'e',
      'c',
    ]);
    expect(
      queryTable({
        ...model,
        sorting: [{ column: 'name', direction: 'descending' }],
      }).rows.map((row) => row.id),
    ).toEqual(['e', 'a', 'b', 'd', 'c']);
    expect(validateTableModel(model).success).toBe(true);
  });

  it.each([
    { column: 'name', operator: 'contains', value: 'ALP' },
    { column: 'amount', operator: 'greaterThan', value: 25 },
    { column: 'amount', operator: 'lessThan', value: 15 },
    { column: 'active', operator: 'equals', value: false },
  ] as const)('applies typed filters: %o', (rule) => {
    expect(queryTable({ ...TABLE_MODEL, filters: [rule] }).filteredRows).toBe(1);
  });

  it('rejects mismatched cells, columns, filter types, and invalid pages', () => {
    for (const model of [
      {},
      { ...TABLE_MODEL, columns: [...TABLE_MODEL.columns, TABLE_MODEL.columns[0]] },
      {
        ...TABLE_MODEL,
        rows: [{ id: 'a', cells: { name: 1, amount: 1, active: true } }],
      },
      { ...TABLE_MODEL, rows: [{ id: 'a', cells: {} }] },
      { ...TABLE_MODEL, selection: ['missing'] },
      { ...TABLE_MODEL, sorting: [{ column: 'missing', direction: 'ascending' }] },
      {
        ...TABLE_MODEL,
        filters: [{ column: 'missing', operator: 'equals', value: 1 }],
      },
      { ...TABLE_MODEL, filters: [{ column: 'name', operator: 'equals', value: 1 }] },
      {
        ...TABLE_MODEL,
        filters: [{ column: 'name', operator: 'greaterThan', value: 1 }],
      },
      { ...TABLE_MODEL, pagination: { pageIndex: 3, pageSize: 1 } },
    ])
      expect(validateTableModel(model).success).toBe(false);
    expect(
      validateTableModel({
        ...TABLE_MODEL,
        rows: [],
        filters: [{ column: 'name', operator: 'equals', value: null }],
      }).success,
    ).toBe(true);
  });
});
