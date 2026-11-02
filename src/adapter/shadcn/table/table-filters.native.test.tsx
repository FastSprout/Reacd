import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import type { DataTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import { ShadcnTable } from './table.adapter.js';

const initial: DataTableModel = {
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

function Controlled({
  filters = initial.filters,
}: {
  readonly filters?: DataTableModel['filters'];
}) {
  const [model, setModel] = useState({ ...initial, filters });
  return (
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={model}
      onModelChange={setModel}
    />
  );
}

it('delegates canonical comparison operators and grouped rules to SDK filters', () => {
  const view = render(
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={{
        ...initial,
        filters: [
          { column: 'amount', operator: 'greaterThan', value: 10 },
          { column: 'amount', operator: 'lessThan', value: 30 },
          { column: 'active', operator: 'equals', value: false },
        ],
      }}
    />,
  );
  expect(screen.getByRole('cell', { name: 'Lin' })).toBeVisible();
  expect(screen.queryByRole('cell', { name: 'Mina' })).toBeNull();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={{
        ...initial,
        filters: [{ column: 'name', operator: 'equals', value: 'Mina' }],
      }}
    />,
  );
  expect(screen.getByRole('cell', { name: 'Mina' })).toBeVisible();
});

it('preserves secondary numeric filter rules', async () => {
  render(
    <Controlled
      filters={[
        { column: 'amount', operator: 'greaterThan', value: 10 },
        { column: 'amount', operator: 'lessThan', value: 30 },
      ]}
    />,
  );
  await userEvent.clear(screen.getByRole('spinbutton', { name: 'Filter Amount' }));
  expect(screen.getByRole('spinbutton', { name: 'Filter Amount' })).toHaveValue(30);
  expect(screen.queryByRole('cell', { name: 'Mina' })).toBeNull();
  await userEvent.clear(screen.getByRole('spinbutton', { name: 'Filter Amount' }));
  await userEvent.type(screen.getByRole('spinbutton', { name: 'Filter Amount' }), '20');
  expect(screen.getByRole('cell', { name: 'Lin' })).toBeVisible();
  expect(screen.queryByRole('cell', { name: 'Ada' })).toBeNull();
});

it('uses SDK boolean filtering and page selection', async () => {
  render(<Controlled />);
  await userEvent.click(
    screen.getByRole('checkbox', { name: 'Select all visible rows' }),
  );
  expect(screen.getByRole('checkbox', { name: 'Select row a' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select row a' }));
  expect(
    screen.getByRole('checkbox', { name: 'Select all visible rows' }),
  ).toHaveAttribute('aria-checked', 'mixed');
  await userEvent.click(
    screen.getByRole('checkbox', { name: 'Select all visible rows' }),
  );
  await userEvent.click(
    screen.getByRole('checkbox', { name: 'Select all visible rows' }),
  );
  expect(screen.getByRole('checkbox', { name: 'Select row b' })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Filter Active' }));
  await userEvent.click(screen.getByRole('option', { name: 'False' }));
  expect(screen.getByRole('cell', { name: 'Lin' })).toBeVisible();
  expect(screen.queryByRole('cell', { name: 'Ada' })).toBeNull();
  await userEvent.click(screen.getByRole('combobox', { name: 'Filter Active' }));
  await userEvent.click(screen.getByRole('option', { name: 'True' }));
  expect(screen.getByRole('cell', { name: 'Ada' })).toBeVisible();
  await userEvent.click(screen.getByRole('combobox', { name: 'Filter Active' }));
  await userEvent.click(screen.getByRole('option', { name: 'All' }));
  expect(screen.getByRole('cell', { name: 'Lin' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
  await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
  expect(screen.getByRole('cell', { name: 'Ada' })).toBeVisible();
});

it('offers SDK operator controls matching the declared column kind', async () => {
  render(<Controlled />);
  await userEvent.type(screen.getByRole('spinbutton', { name: 'Filter Amount' }), '10');
  await userEvent.click(screen.getByRole('combobox', { name: 'Operator Amount' }));
  expect(screen.queryByRole('option', { name: 'Contains' })).toBeNull();
  await userEvent.click(screen.getByRole('option', { name: 'Greater than' }));
  expect(screen.queryByRole('cell', { name: 'Ada' })).toBeNull();
  expect(screen.getByRole('cell', { name: 'Lin' })).toBeVisible();
  await userEvent.clear(screen.getByRole('spinbutton', { name: 'Filter Amount' }));
  await userEvent.type(screen.getByRole('textbox', { name: 'Filter Name' }), 'lin');
  expect(screen.getByRole('cell', { name: 'Lin' })).toBeVisible();
  await userEvent.click(screen.getByRole('combobox', { name: 'Operator Name' }));
  expect(screen.queryByRole('option', { name: 'Less than' })).toBeNull();
  await userEvent.click(screen.getByRole('option', { name: 'Equals' }));
  expect(screen.getByText('No data available.')).toBeVisible();
});
