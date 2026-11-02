import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { DataTableProps } from
  '@fastsprout/reacd/adapter-runtime/components/data-table/data-table.props.js';
import { ShadcnDataTable } from './data-table.adapter.js';

const properties: DataTableProps = {
  caption: 'Remote orders',
  columns: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'amount', label: 'Amount', kind: 'number' },
    { key: 'active', label: 'Active', kind: 'boolean' },
  ],
  rows: [{ id: 'window', cells: { name: 'Visible', amount: 20, active: true } }],
  selection: ['off-page'],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 1, pageSize: 1 },
  totalRows: 3,
  filteredRows: 3,
  pageCount: 3,
};

it('keeps the supplied visible window and preserves off-page selection', async () => {
  const selection = vi.fn();
  const sorting = vi.fn();
  const pagination = vi.fn();
  const filters = vi.fn();
  render(
    <ShadcnDataTable
      {...properties}
      onSelectionChange={selection}
      onSortingChange={sorting}
      onPaginationChange={pagination}
      onFiltersChange={filters}
    />,
  );
  expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select row window' }));
  expect(selection).toHaveBeenCalledWith(['off-page', 'window']);
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
  expect(pagination).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 1 });
  await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
  expect(pagination).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 1 });
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  expect(sorting).toHaveBeenCalledWith([{ column: 'name', direction: 'ascending' }]);
  await userEvent.type(screen.getByRole('textbox', { name: 'Filter Name' }), 'X');
  expect(filters).toHaveBeenCalledWith([
    { column: 'name', operator: 'contains', value: 'X' },
  ]);
  expect(screen.getByRole('cell', { name: 'Visible' })).toBeVisible();
  await userEvent.click(screen.getByRole('combobox', { name: 'Rows per page' }));
  await userEvent.click(screen.getByRole('option', { name: '25' }));
  expect(pagination).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 25 });
});

it('retains controlled state in a read-only window', () => {
  render(
    <ShadcnDataTable
      {...properties}
      selection={['window']}
      sorting={[{ column: 'name', direction: 'descending' }]}
      filters={[{ column: 'name', operator: 'equals', value: 'Absent' }]}
    />,
  );
  expect(screen.getByRole('cell', { name: 'Visible' })).toBeVisible();
  expect(screen.getByRole('checkbox', { name: 'Select row window' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Sort Name' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: 'Filter Name' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
});

it('renders SDK feedback and uses named defaults for missing state messages', () => {
  const view = render(<ShadcnDataTable {...properties} rows={[]} state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading data…');
  view.rerender(<ShadcnDataTable {...properties} rows={[]} state="error" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data.');
  view.rerender(<ShadcnDataTable {...properties} rows={[]} />);
  expect(screen.getByText('No data available.')).toBeVisible();
});
