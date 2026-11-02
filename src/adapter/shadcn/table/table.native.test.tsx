import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import type { DataTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import { ShadcnTable } from './table.adapter.js';

const model: DataTableModel = {
  columns: [
    { key: 'name', label: 'Name', kind: 'text' },
    { key: 'amount', label: 'Amount', kind: 'number' },
    { key: 'active', label: 'Active', kind: 'boolean' },
  ],
  rows: [
    { id: 'a', cells: { name: 'Ada', amount: 10, active: true } },
    { id: 'b', cells: { name: 'Lin', amount: 20, active: false } },
    { id: 'c', cells: { name: 'Mina', amount: 30, active: true } },
  ],
  selection: [],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 0, pageSize: 2 },
};

it('uses SDK static rows and state feedback', () => {
  const view = render(
    <ShadcnTable caption="Orders" columns={['Name']} rows={[['Ada']]} />,
  );
  expect(screen.getByRole('table', { name: 'Orders' })).toHaveAttribute(
    'data-slot',
    'table',
  );
  expect(screen.getByRole('cell', { name: 'Ada' })).toBeVisible();
  view.rerender(
    <ShadcnTable
      caption="Orders"
      columns={['Name']}
      rows={[]}
      emptyMessage="No orders"
    />,
  );
  expect(screen.getByText('No orders')).toBeVisible();
  view.rerender(
    <ShadcnTable
      caption="Orders"
      columns={['Name']}
      rows={[]}
      state="loading"
      loadingMessage="Loading orders"
    />,
  );
  expect(screen.getByText('Loading orders')).toBeVisible();
  view.rerender(
    <ShadcnTable
      caption="Orders"
      columns={['Name']}
      rows={[]}
      state="error"
      errorMessage="Unavailable"
    />,
  );
  expect(screen.getByText('Unavailable')).toBeVisible();
});

it('delegates controlled table interactions to TanStack', async () => {
  function Example() {
    const [value, setValue] = useState(model);
    return (
      <ShadcnTable
        mode="interactive"
        caption="Orders"
        model={value}
        onModelChange={setValue}
      />
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select row a' }));
  expect(screen.getByRole('checkbox', { name: 'Select row a' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('cell', { name: 'Mina' })).toBeVisible();
  expect(screen.queryByRole('cell', { name: 'Ada' })).toBeNull();
  await userEvent.type(screen.getByRole('textbox', { name: 'Filter Name' }), 'Mina');
  expect(screen.getByText('Page 1 of 1')).toBeVisible();
  await userEvent.clear(screen.getByRole('textbox', { name: 'Filter Name' }));
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  expect(screen.getByRole('cell', { name: 'Mina' })).toBeVisible();
});

it('exposes the SDK scroll wrapper as a labelled keyboard region', () => {
  render(<ShadcnTable caption="Long data" columns={['Name']} rows={[['Ada']]} />);
  expect(screen.getByRole('region', { name: 'Long data' })).toHaveAttribute(
    'tabindex',
    '0',
  );
  expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
    'scope',
    'col',
  );
});
