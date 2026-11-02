import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { DataTableProps } from
  '../../../components/data-table/data-table.props.js';
import { MuiDataTable } from './data-table.adapter.js';
const data: DataTableProps = {
  caption: 'Customers',
  columns: [{ key: 'name', label: 'Name', kind: 'text' }],
  rows: [{ id: 'ada', cells: { name: 'Ada' } }],
  selection: [],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 0, pageSize: 10 },
  totalRows: 1,
  filteredRows: 1,
  pageCount: 1,
};
it('uses native table sorting, selection and filters', async () => {
  const select = vi.fn<NonNullable<DataTableProps['onSelectionChange']>>();
  const sort = vi.fn<NonNullable<DataTableProps['onSortingChange']>>();
  const filter = vi.fn<NonNullable<DataTableProps['onFiltersChange']>>();
  render(
    <MuiDataTable
      {...data}
      onSelectionChange={select}
      onSortingChange={sort}
      onFiltersChange={filter}
    />,
  );
  const region = screen.getByRole('region', { name: 'Customers' });
  expect(region).toHaveAttribute('tabindex', '0');
  expect(region.className).toContain('MuiTableContainer-root');
  region.focus();
  expect(region).toHaveFocus();
  expect(region.contains(screen.getByRole('table', { name: 'Customers' })))
    .toBe(true);
  expect(screen.getByRole('table', { name: 'Customers' }).className).toContain(
    'MuiTable-root',
  );
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select row ada' }));
  expect(select).toHaveBeenCalledWith(['ada']);
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  expect(sort).toHaveBeenCalledWith([{ column: 'name', direction: 'ascending' }]);
  await userEvent.type(screen.getByRole('textbox', { name: 'Filter Name' }), 'A');
  expect(filter).toHaveBeenCalledWith([
    { column: 'name', operator: 'contains', value: 'A' },
  ]);
});

it('keeps visible selection, removal and native mixed state controlled', async () => {
  const select = vi.fn<NonNullable<DataTableProps['onSelectionChange']>>();
  const rows = [...data.rows, { id: 'grace', cells: {} }];
  const view = render(
    <MuiDataTable
      {...data}
      rows={rows}
      selection={['ada', 'elsewhere']}
      onSelectionChange={select}
    />,
  );
  const all = screen.getByRole('checkbox', { name: 'Select visible rows' });
  expect(all).toHaveAttribute('data-indeterminate', 'true');
  await userEvent.click(all);
  expect(select).toHaveBeenLastCalledWith(['ada', 'elsewhere', 'grace']);
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select row ada' }));
  expect(select).toHaveBeenLastCalledWith(['elsewhere']);
  view.rerender(
    <MuiDataTable
      {...data}
      rows={rows}
      selection={['ada', 'grace', 'elsewhere']}
      onSelectionChange={select}
    />,
  );
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select visible rows' }));
  expect(select).toHaveBeenLastCalledWith(['elsewhere']);
});

it('cycles ascending, descending and removed native sort state', async () => {
  const sort = vi.fn<NonNullable<DataTableProps['onSortingChange']>>();
  const view = render(
    <MuiDataTable
      {...data}
      onSortingChange={sort}
      sorting={[{ column: 'name', direction: 'ascending' }]}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  expect(sort).toHaveBeenLastCalledWith([{ column: 'name', direction: 'descending' }]);
  view.rerender(
    <MuiDataTable
      {...data}
      onSortingChange={sort}
      sorting={[{ column: 'name', direction: 'descending' }]}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  expect(sort).toHaveBeenLastCalledWith([]);
});

it('resets pagination when the native page size changes', async () => {
  const paginate = vi.fn<NonNullable<DataTableProps['onPaginationChange']>>();
  render(
    <MuiDataTable
      {...data}
      totalRows={30}
      filteredRows={30}
      onPaginationChange={paginate}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
  expect(paginate).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 10 });
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.click(screen.getByRole('option', { name: '25' }));
  expect(paginate).toHaveBeenLastCalledWith({ pageIndex: 0, pageSize: 25 });
});

it('shows native loading, error and empty feedback without writable controls', () => {
  const view = render(<MuiDataTable {...data} state="loading" />);
  expect(screen.getByRole('progressbar')).toBeVisible();
  view.rerender(<MuiDataTable {...data} state="error" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data.');
  view.rerender(<MuiDataTable {...data} state="error" errorMessage="Offline" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Offline');
  view.rerender(<MuiDataTable {...data} rows={[]} />);
  expect(screen.getByText('No data available.')).toBeVisible();
  view.rerender(<MuiDataTable {...data} rows={[]} emptyMessage="No matches" />);
  expect(screen.getByText('No matches')).toBeVisible();
});

it('uses native typed filters and targeted removal', async () => {
  const change = vi.fn<NonNullable<DataTableProps['onFiltersChange']>>();
  const view = render(
    <MuiDataTable
      {...data}
      columns={[
        ...data.columns,
        { key: 'age', label: 'Age', kind: 'number' },
        { key: 'active', label: 'Active', kind: 'boolean' },
      ]}
      filters={[
        { column: 'name', operator: 'contains', value: 'Ada' },
        { column: 'name', operator: 'equals', value: 'Ada' },
        { column: 'age', operator: 'greaterThan', value: 18 },
      ]}
      onFiltersChange={change}
    />,
  );
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Filter Age' }), {
    target: { value: '25' },
  });
  expect(change).toHaveBeenLastCalledWith([
    { column: 'name', operator: 'contains', value: 'Ada' },
    { column: 'name', operator: 'equals', value: 'Ada' },
    { column: 'age', operator: 'greaterThan', value: 18 },
    { column: 'age', operator: 'equals', value: 25 },
  ]);
  await userEvent.click(screen.getByRole('combobox', { name: 'Filter Active' }));
  await userEvent.click(screen.getByRole('option', { name: 'No' }));
  expect(change).toHaveBeenLastCalledWith(
    expect.arrayContaining([{ column: 'active', operator: 'equals', value: false }]),
  );
  const chip = screen.getByRole('button', { name: 'name contains Ada' });
  await userEvent.click(chip);
  await userEvent.keyboard('{Delete}');
  expect(change).toHaveBeenLastCalledWith([
    { column: 'name', operator: 'equals', value: 'Ada' },
    { column: 'age', operator: 'greaterThan', value: 18 },
  ]);
  view.rerender(
    <MuiDataTable
      {...data}
      filters={[{ column: 'name', operator: 'contains', value: 'Ada' }]}
    />,
  );
  expect(
    screen.getByText('name contains Ada').closest('.MuiChip-root'),
  ).not.toHaveAttribute('role', 'button');
});

it('keeps every transition disabled when its portal scope is inactive', () => {
  render(
    <PortalActiveContext value={false}>
      <MuiDataTable
        {...data}
        onSelectionChange={() => undefined}
        onSortingChange={() => undefined}
        onFiltersChange={() => undefined}
        onPaginationChange={() => undefined}
      />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('checkbox', { name: 'Select row ada' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: 'Filter Name' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Sort Name' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
});

it('rejects additional native filter edits beyond the validated filter limit', () => {
  const change = vi.fn<NonNullable<DataTableProps['onFiltersChange']>>();
  render(
    <MuiDataTable
      {...data}
      filters={Array.from({ length: 12 }, (_, index) => ({
        column: `field-${index}`,
        operator: 'equals',
        value: index,
      }))}
      onFiltersChange={change}
    />,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Filter Name' }), {
    target: { value: 'Ada' },
  });
  expect(change).not.toHaveBeenCalled();
});
