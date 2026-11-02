import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import type { DataTableModel } from
  '@fastsprout/reacd/adapter-runtime/schema/data-table/model.schema.js';
import { ShadcnTable } from './table.adapter.js';

const model: DataTableModel = {
  columns: [{ key: 'name', label: 'Name', kind: 'text' }],
  rows: [{ id: 'ada', cells: { name: 'Ada' } }],
  selection: [],
  sorting: [],
  filters: [],
  pagination: { pageIndex: 0, pageSize: 10 },
};

it('honors read-only, disabled and per-operation controlled permissions', () => {
  const change = vi.fn();
  const view = render(
    <ShadcnTable
      mode="interactive"
      model={model}
      caption="People"
      readOnly
      onModelChange={change}
    />,
  );
  expect(screen.getByRole('checkbox', { name: 'Select row ada' })).toBeDisabled();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      model={model}
      caption="People"
      disabled
      onModelChange={change}
    />,
  );
  expect(screen.getByRole('textbox', { name: 'Filter Name' })).toBeDisabled();
  view.rerender(<ShadcnTable mode="interactive" model={model} caption="People" />);
  expect(screen.getByRole('button', { name: 'Sort Name' })).toBeDisabled();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      model={model}
      caption="People"
      onModelChange={change}
      editable={{ selection: false, sorting: false, filters: false, pagination: false }}
    />,
  );
  expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeDisabled();
  expect(change).not.toHaveBeenCalled();
});

it('uses SDK retry actions without leaking event objects', async () => {
  const retry = vi.fn();
  const view = render(
    <ShadcnTable
      caption="People"
      columns={['Name']}
      rows={[]}
      state="error"
      onRetry={retry}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Retry table' }));
  expect(retry).toHaveBeenLastCalledWith();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={model}
      state="error"
      onRetry={retry}
      errorMessage="Try again"
      retryLabel="Reload"
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Reload' }));
  expect(retry).toHaveBeenLastCalledWith();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={model}
      state="error"
      onRetry={retry}
      disabled
    />,
  );
  expect(screen.queryByRole('button', { name: 'Retry table' })).toBeNull();
});

it('uses the declared empty and loading messages for complete models', () => {
  const view = render(
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={model}
      state="loading"
      loadingMessage="Please wait"
    />,
  );
  expect(screen.getByText('Please wait')).toBeVisible();
  view.rerender(
    <ShadcnTable
      mode="interactive"
      caption="People"
      model={{ ...model, rows: [] }}
      emptyMessage="No people"
    />,
  );
  expect(screen.getByText('No people')).toBeVisible();
});
