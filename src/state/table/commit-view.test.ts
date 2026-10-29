import { expect, it } from 'vitest';
import {
  TABLE_BINDINGS,
  TABLE_MODEL,
  tableFixture,
  success,
} from '../../../test-support/data-table.js';
import { commitTableView } from './commit-view.js';
it('commits coupled sorting/page updates atomically and rejects source edits', () => {
  const { registry, controller } = tableFixture({
    ...TABLE_MODEL,
    pagination: { pageIndex: 2, pageSize: 1 },
  });
  const lease = success(controller.connect());
  const current = { ...TABLE_MODEL, pagination: { pageIndex: 2, pageSize: 1 } };
  const next = {
    ...current,
    filters: [{ column: 'name', operator: 'contains', value: 'Alpha' }],
    pagination: { pageIndex: 0, pageSize: 1 },
  };
  expect(commitTableView(registry, TABLE_BINDINGS, current, next).success).toBe(true);
  expect(success(registry.read('orders.pagination')).value).toEqual({
    pageIndex: 0,
    pageSize: 1,
  });
  expect(success(registry.read('orders.filters')).value).toEqual(next.filters);
  expect(
    commitTableView(registry, TABLE_BINDINGS, current, {
      ...current,
      rows: current.rows.map((row) => ({
        ...row,
        cells: { ...row.cells, amount: 40 },
      })),
    }).success,
  ).toBe(false);
  expect(
    commitTableView(registry, TABLE_BINDINGS, current, {
      ...current,
      columns: current.columns.map((column) => ({
        ...column,
        label: `${column.label} changed`,
      })),
    }).success,
  ).toBe(false);
  expect(commitTableView(registry, TABLE_BINDINGS, current, null).success).toBe(false);
  lease();
});
it('protects reader capabilities and preserves rejected state', () => {
  const { registry, controller } = tableFixture();
  const lease = success(controller.connect());
  const readonly = {
    ...TABLE_BINDINGS,
    selection: {
      state: TABLE_BINDINGS.selection.state,
      mode: 'read' as const,
    },
  };
  expect(
    commitTableView(registry, readonly, TABLE_MODEL, {
      ...TABLE_MODEL,
      selection: ['a'],
    }).success,
  ).toBe(false);
  expect(success(registry.read('orders.selection')).value).toEqual([]);
  const unavailable = {
    ...TABLE_BINDINGS,
    selection: {
      ...TABLE_BINDINGS.selection,
      state: 'unavailable',
    },
  };
  expect(
    commitTableView(registry, unavailable, TABLE_MODEL, {
      ...TABLE_MODEL,
      selection: ['a'],
    }).success,
  ).toBe(false);
  expect(
    commitTableView(registry, TABLE_BINDINGS, TABLE_MODEL, TABLE_MODEL).success,
  ).toBe(true);
  lease();
});
