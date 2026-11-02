import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { DataTableModel } from '../../../schema/data-table/model.schema.js';
import { MuiTable } from './table.adapter.js';

const model: DataTableModel = {
  columns: [{ key: 'name', label: 'Name', kind: 'text' }],
  rows: [{ id: 'ada', cells: { name: 'Ada' } }],
  selection: [],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 0, pageSize: 10 },
};

it('maps native interactions to validated complete logical models', async () => {
  const change = vi.fn<(value: DataTableModel) => void>();
  render(
    <MuiTable
      mode="interactive"
      caption="Customers"
      model={model}
      onModelChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select row ada' }));
  expect(change).toHaveBeenLastCalledWith({ ...model, selection: ['ada'] });
  await userEvent.click(screen.getByRole('button', { name: 'Sort Name' }));
  expect(change).toHaveBeenLastCalledWith({
    ...model,
    sorting: [{ column: 'name', direction: 'ascending' }],
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Filter Name' }), {
    target: { value: 'Ada' },
  });
  expect(change).toHaveBeenLastCalledWith({
    ...model,
    filters: [{ column: 'name', operator: 'contains', value: 'Ada' }],
  });
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.click(screen.getByRole('option', { name: '25' }));
  expect(change).toHaveBeenLastCalledWith({
    ...model,
    pagination: { pageIndex: 0, pageSize: 25 },
  });
});

it.each(['readOnly', 'disabled', 'unbound', 'noneditable'] as const)(
  'disables controlled transitions when %s',
  (policy) => {
    render(
      <MuiTable
        mode="interactive"
        caption="Customers"
        model={model}
        readOnly={policy === 'readOnly'}
        disabled={policy === 'disabled'}
        onModelChange={policy === 'unbound' ? undefined : () => undefined}
        editable={
          policy === 'noneditable'
            ? { selection: false, sorting: false, filters: false, pagination: false }
            : undefined
        }
      />,
    );
    expect(screen.getByRole('checkbox', { name: 'Select row ada' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Filter Name' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort Name' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
);

it('routes static and interactive feedback through native SDK components', async () => {
  const retry = vi.fn<() => void>();
  const view = render(
    <MuiTable caption="Customers" columns={['Name']} rows={[['Ada']]} />,
  );
  expect(screen.getByRole('cell', { name: 'Ada' })).toBeVisible();
  view.rerender(
    <MuiTable
      mode="interactive"
      caption="Customers"
      model={model}
      state="loading"
      loadingMessage="Loading customers"
    />,
  );
  expect(screen.getByRole('progressbar', { name: 'Loading customers' })).toBeVisible();
  view.rerender(
    <MuiTable
      mode="interactive"
      caption="Customers"
      model={model}
      state="error"
      errorMessage="Offline"
      onRetry={retry}
      retryLabel="Reconnect"
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Reconnect' }));
  expect(retry).toHaveBeenCalledWith();
});
