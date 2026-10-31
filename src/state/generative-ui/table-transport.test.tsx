import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import {
  TABLE_MODEL,
  TABLE_BINDINGS,
  tableDefinitions,
  success,
} from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { createDataTableController } from '../data-table/create-controller.js';
const DOCUMENT = {
  schemaVersion: '0.2',
  state: tableDefinitions(),
  root: {
    type: 'Table',
    mode: 'interactive',
    caption: 'Generated orders',
    columns: TABLE_MODEL.columns,
    bindings: TABLE_BINDINGS,
  },
};
it('registers typed transport and independent compound constraints', async () => {
  const user = userEvent.setup();
  const registry = success(createStateRegistry(tableDefinitions()));
  const view = render(
    <GenerativeUI adapter={shadcnAdapter} document={DOCUMENT} registry={registry} />,
  );
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
  expect(success(registry.read('orders.pagination')).value).toEqual({
    pageIndex: 0,
    pageSize: 1,
  });
  expect(success(registry.read('orders.sorting')).value).toEqual([
    { column: 'amount', direction: 'ascending' },
  ]);
  expect(registry.update('orders.selection', ['missing']).success).toBe(false);
  view.unmount();
  expect(registry.update('orders.selection', ['missing']).success).toBe(true);
  const fresh = success(createStateRegistry(tableDefinitions()));
  render(<GenerativeUI adapter={shadcnAdapter} document={DOCUMENT} registry={fresh} />);
  expect(success(fresh.read('orders.sorting')).value).toEqual([]);
});
it('rejects bad initial relationships and invalid static dimensions', () => {
  expect(
    validateGenerativeDocument({
      ...DOCUMENT,
      state: tableDefinitions({ ...TABLE_MODEL, selection: ['missing'] }),
    }).success,
  ).toBe(false);
  expect(validateGenerativeDocument({ ...DOCUMENT, state: [] }).success).toBe(false);
  expect(
    validateGenerativeDocument({
      schemaVersion: '0.2',
      state: [],
      root: {
        type: 'Table',
        caption: 'Legacy',
        columns: ['A', 'B'],
        rows: [['missing']],
      },
    }).success,
  ).toBe(false);
});
it('reconciles source replacement through the existing host controller', () => {
  const model = {
    ...TABLE_MODEL,
    selection: ['c'],
    pagination: { pageIndex: 2, pageSize: 1 },
  };
  const state = tableDefinitions(model).map((entry) =>
    entry.key === 'orders.rows' ? { ...entry, access: 'readWrite' as const } : entry,
  );
  const registry = success(createStateRegistry(state));
  const controller = success(
    createDataTableController(registry, {
      columns: TABLE_MODEL.columns,
      bindings: TABLE_BINDINGS,
    }),
  );
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{ ...DOCUMENT, state }}
      registry={registry}
    />,
  );
  expect(registry.update('orders.rows', []).success).toBe(false);
  act(() => {
    expect(controller.replaceRows(TABLE_MODEL.rows.slice(0, 1)).success).toBe(true);
  });
  expect(success(registry.read('orders.selection')).value).toEqual([]);
  expect(success(registry.read('orders.pagination')).value).toEqual({
    pageIndex: 0,
    pageSize: 1,
  });
  expect(screen.getByRole('cell', { name: 'Alpha' })).toBeVisible();
});
it('resolves static retry intents and rejects unregistered callbacks', async () => {
  const user = userEvent.setup();
  const document = {
    schemaVersion: '0.2',
    state: [],
    root: {
      type: 'Table',
      caption: 'Static',
      columns: ['A'],
      rows: [['A']],
      state: 'error',
      retryAction: 'retry',
    },
  };
  const view = render(<GenerativeUI adapter={shadcnAdapter} document={document} />);
  expect(screen.getByRole('alert')).toHaveTextContent('not registered: retry');
  const retry = vi.fn();
  view.rerender(
    <GenerativeUI adapter={shadcnAdapter} document={document} actions={{ retry }} />,
  );
  await user.click(screen.getByRole('button', { name: 'Retry table' }));
  expect(retry).toHaveBeenCalledOnce();
});
