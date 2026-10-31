import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { atom, useAtom } from 'jotai';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { TABLE_MODEL } from '../../../../test-support/data-table.js';
import { SharedInteractiveTable } from './interactive-table.js';
const modelAtom = atom(TABLE_MODEL);
function Host() {
  const [model, setModel] = useAtom(modelAtom);
  return (
    <SharedInteractiveTable
      mode="interactive"
      caption="Orders"
      model={model}
      onModelChange={setModel}
    />
  );
}
it('reuses table controls with atomic controlled model transitions', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Host />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));
  expect(screen.getByRole('checkbox', { name: 'Select row a' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('cell', { name: 'Beta' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  expect(screen.getByRole('cell', { name: 'Beta' })).toBeVisible();
  await user.type(screen.getByRole('searchbox', { name: 'Filter Name' }), 'Gamma');
  expect(screen.getByRole('cell', { name: 'Gamma' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('1 of 3 rows');
});
it('preserves rejected proposals and protects per-field permissions', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const model = { ...TABLE_MODEL, pagination: { pageIndex: 1, pageSize: 1 } };
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SharedInteractiveTable
        mode="interactive"
        caption="Orders"
        model={model}
        onModelChange={change}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
  expect(change).toHaveBeenCalledExactlyOnceWith({
    ...model,
    sorting: [{ column: 'amount', direction: 'ascending' }],
    pagination: { pageIndex: 0, pageSize: 1 },
  });
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  for (const properties of [
    { readOnly: true },
    { disabled: true },
    { onModelChange: undefined },
    {
      editable: { selection: false, sorting: false, filters: false, pagination: false },
    },
  ]) {
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedInteractiveTable
          mode="interactive"
          caption="Orders"
          model={model}
          onModelChange={change}
          {...properties}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sort Amount' })).toBeDisabled();
    expect(screen.getByRole('searchbox', { name: 'Filter Name' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  }
});
it('keeps native table action buttons out of implicit form submission', async () => {
  const user = userEvent.setup();
  const submit = vi.fn();
  const change = vi.fn();
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <ReacdProvider adapter={activeTestAdapter}>
        <SharedInteractiveTable
          mode="interactive"
          caption="Orders"
          model={TABLE_MODEL}
          onModelChange={change}
        />
      </ReacdProvider>
    </form>,
  );
  const sort = screen.getByRole('button', { name: 'Sort Amount' });
  await user.click(sort);
  await user.keyboard('{Enter} ');
  expect(change).toHaveBeenCalledTimes(3);
  expect(submit).not.toHaveBeenCalled();
});
