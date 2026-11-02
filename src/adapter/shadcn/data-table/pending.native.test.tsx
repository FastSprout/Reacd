import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnDataTable } from './data-table.adapter.js';
import { ShadcnTable } from '../table/table.adapter.js';

const model: DataTableProps = {
  caption: 'Orders',
  columns: [{ key: 'name', label: 'Name', kind: 'text' }],
  rows: [{ id: 'ada', cells: { name: 'Ada' } }],
  selection: [], sorting: [], filters: [],
  pagination: { pageIndex: 0, pageSize: 1 },
  totalRows: 2, filteredRows: 2, pageCount: 2,
};

it('blocks pending table mutations and closes its native page-size popup', async () => {
  const change = vi.fn();
  const content = (pending: boolean) => <FormPendingContext value={pending}>
    <ShadcnDataTable {...model} onSelectionChange={change}
      onSortingChange={change} onFiltersChange={change} onPaginationChange={change} />
  </FormPendingContext>;
  const user = userEvent.setup();
  const view = render(content(false));
  await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));
  expect(await screen.findByRole('option', { name: '25' })).toBeVisible();
  view.rerender(content(true));
  expect(screen.queryByRole('option', { name: '25' })).toBeNull();
  for (const control of [
    screen.getByRole('checkbox', { name: 'Select row ada' }),
    screen.getByRole('checkbox', { name: 'Select all visible rows' }),
    screen.getByRole('button', { name: 'Sort Name' }),
    screen.getByRole('button', { name: 'Next page' }),
    screen.getByRole('combobox', { name: 'Rows per page' }),
    screen.getByRole('textbox', { name: 'Filter Name' }),
  ]) expect(control).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('cell', { name: 'Ada' })).toBeVisible();
  view.rerender(content(false));
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(change).toHaveBeenCalledExactlyOnceWith({ pageIndex: 1, pageSize: 1 });
});

it.each(['pending', 'inactive'] as const)(
  'blocks error retry under %s ancestry without removing ordinary retry',
  async (reason) => {
    const retry = vi.fn();
    const content = (protectedScope: boolean) => (
      <FormPendingContext value={protectedScope && reason === 'pending'}>
        <PortalActiveContext value={!protectedScope || reason !== 'inactive'}>
          <ShadcnTable mode="interactive" caption="Orders" model={model}
            state="error" onRetry={retry} />
        </PortalActiveContext>
      </FormPendingContext>
    );
    const user = userEvent.setup();
    const view = render(content(true));
    await user.click(screen.getByRole('button', { name: 'Retry table' }));
    expect(retry).not.toHaveBeenCalled();
    view.rerender(content(false));
    await user.click(screen.getByRole('button', { name: 'Retry table' }));
    expect(retry).toHaveBeenCalledExactlyOnceWith();
  },
);
