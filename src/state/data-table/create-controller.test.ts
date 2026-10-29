import { describe, expect, it, vi } from 'vitest';
import {
  TABLE_BINDINGS,
  TABLE_MODEL,
  success,
  tableFixture,
  tableDefinitions,
} from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { createDataTableController } from './create-controller.js';

describe('DataTable state transitions', () => {
  it('sorts, filters, and pages while preserving source selection', () => {
    const { registry, controller } = tableFixture();
    success(controller.connect());
    success(controller.select(['a', 'c']));
    success(controller.paginate({ pageIndex: 2, pageSize: 1 }));
    const observed = vi.fn(() => controller.read());
    const unsubscribe = registry.store.sub(controller.atom, observed);
    success(controller.sort([{ column: 'amount', direction: 'ascending' }]));
    expect(success(controller.read()).rows.map((row) => row.id)).toEqual(['b']);
    expect(success(controller.read()).pagination.pageIndex).toBe(0);
    expect(success(controller.read()).selection).toEqual(['a', 'c']);
    expect(observed).toHaveBeenCalledOnce();
    success(controller.filter([{ column: 'active', operator: 'equals', value: true }]));
    expect(success(controller.read()).rows.map((row) => row.id)).toEqual(['c']);
    expect(success(controller.read()).filteredRows).toBe(2);
    success(controller.paginate({ pageIndex: 1, pageSize: 1 }));
    success(controller.replaceRows(TABLE_MODEL.rows.filter((row) => row.id === 'c')));
    const refreshed = success(controller.read());
    expect(Object.isFrozen(refreshed)).toBe(true);
    expect(Object.isFrozen(refreshed.rows)).toBe(true);
    expect(Object.isFrozen(controller.bindings)).toBe(true);
    expect(refreshed.selection).toEqual(['c']);
    expect(refreshed.pagination.pageIndex).toBe(0);
    expect(refreshed.totalRows).toBe(1);
    unsubscribe();
  });

  it('rejects invalid compound transitions and host writes without any effects', () => {
    const { registry, controller } = tableFixture();
    const disconnect = success(controller.connect());
    const before = success(controller.read());
    for (const transition of [
      () => controller.select(['missing']),
      () => controller.sort([{ column: 'missing', direction: 'ascending' }]),
      () => controller.filter([{ column: 'active', operator: 'contains', value: 'x' }]),
      () => controller.paginate({ pageIndex: 5, pageSize: 1 }),
      () => controller.replaceRows([{ id: 'a', cells: {} }]),
      () =>
        controller.replaceRows(
          [TABLE_MODEL.rows[0], TABLE_MODEL.rows[0]].filter((row) => row !== undefined),
        ),
    ]) {
      expect(transition().success).toBe(false);
      expect(success(controller.read())).toEqual(before);
    }
    expect(registry.update('orders.selection', ['missing']).success).toBe(false);
    success(controller.select(['a']));
    expect(registry.update('orders.rows', []).success).toBe(false);
    success(
      registry.transaction([
        { key: 'orders.rows', value: [] },
        { key: 'orders.selection', value: [] },
      ]),
    );
    disconnect();
    success(registry.update('orders.selection', ['missing']));
    expect(controller.read().success).toBe(false);
    expect(controller.select([]).success).toBe(false);
    expect(controller.replaceRows([]).success).toBe(false);
  });

  it('respects constraints registered by another consumer of shared state', () => {
    const { registry, controller } = tableFixture();
    success(
      registry.constrain(['orders.selection'], (read) => {
        const snapshot = success(read('orders.selection'));
        return snapshot.kind === 'selection' && snapshot.value.length <= 1
          ? { success: true, data: undefined }
          : {
              success: false,
              issues: [{ path: 'selection', message: 'Select one row.' }],
            };
      }),
    );
    expect(controller.select(['a', 'b']).success).toBe(false);
    expect(success(controller.read()).selection).toEqual([]);
  });

  it('enforces modes, kinds, unique keys, and initial consistency', () => {
    const registry = success(createStateRegistry(tableDefinitions()));
    expect(createDataTableController(registry, {}).success).toBe(false);
    expect(
      createDataTableController(registry, {
        columns: TABLE_MODEL.columns,
        bindings: { ...TABLE_BINDINGS, sorting: TABLE_BINDINGS.selection },
      }).success,
    ).toBe(false);
    expect(
      createDataTableController(registry, {
        columns: TABLE_MODEL.columns,
        bindings: { ...TABLE_BINDINGS, rows: { state: 'missing', mode: 'read' } },
      }).success,
    ).toBe(false);
    expect(
      createDataTableController(registry, { columns: [], bindings: TABLE_BINDINGS })
        .success,
    ).toBe(false);
    const invalid = success(
      createStateRegistry(tableDefinitions({ ...TABLE_MODEL, selection: ['missing'] })),
    );
    expect(
      createDataTableController(invalid, {
        columns: TABLE_MODEL.columns,
        bindings: TABLE_BINDINGS,
      }).success,
    ).toBe(false);
    const readBindings = {
      ...TABLE_BINDINGS,
      selection: { ...TABLE_BINDINGS.selection, mode: 'read' },
      sorting: { ...TABLE_BINDINGS.sorting, mode: 'read' },
      filters: { ...TABLE_BINDINGS.filters, mode: 'read' },
      pagination: { ...TABLE_BINDINGS.pagination, mode: 'read' },
    } as const;
    const readOnly = tableFixture(TABLE_MODEL, readBindings).controller;
    expect(readOnly.select([]).success).toBe(false);
    expect(readOnly.sort([]).success).toBe(false);
    expect(readOnly.filter([]).success).toBe(false);
    expect(readOnly.paginate({ pageIndex: 0, pageSize: 1 }).success).toBe(false);
    success(readOnly.replaceRows([]));
  });
});
