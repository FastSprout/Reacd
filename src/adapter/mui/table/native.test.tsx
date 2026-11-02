import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiStaticTable } from './static-table.js';
it('uses Material Table and named caption for static rows', () => {
  const view = render(
    <MuiStaticTable caption="Orders" columns={['Customer']} rows={[['Ada']]} />,
  );
  expect(screen.getByRole('table', { name: 'Orders' }).className).toContain(
    'MuiTable-root',
  );
  expect(screen.getByRole('cell', { name: 'Ada' }).className).toContain(
    'MuiTableCell-root',
  );
  view.rerender(
    <MuiStaticTable
      caption="Orders"
      columns={['Customer']}
      rows={[]}
      emptyMessage="No orders"
    />,
  );
  expect(screen.getByText('No orders')).toBeVisible();
});

it('keeps loading, error and retry feedback SDK-owned', async () => {
  const retry = vi.fn<() => void>();
  const view = render(
    <MuiStaticTable
      caption="Orders"
      columns={['Customer']}
      rows={[]}
      state="loading"
    />,
  );
  expect(screen.getByRole('progressbar')).toBeVisible();
  view.rerender(
    <MuiStaticTable
      caption="Orders"
      columns={['Customer']}
      rows={[]}
      state="loading"
      loadingMessage="Loading orders"
    />,
  );
  expect(screen.getByRole('progressbar', { name: 'Loading orders' })).toBeVisible();
  view.rerender(
    <MuiStaticTable caption="Orders" columns={['Customer']} rows={[]} state="error" />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data.');
  view.rerender(
    <MuiStaticTable
      caption="Orders"
      columns={['Customer']}
      rows={[]}
      state="error"
      errorMessage="Offline"
      onRetry={retry}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Retry table' }));
  expect(retry).toHaveBeenCalledWith();
  view.rerender(
    <MuiStaticTable
      caption="Orders"
      columns={['Customer']}
      rows={[]}
      state="error"
      onRetry={retry}
      retryLabel="Try again"
    />,
  );
  expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  view.rerender(<MuiStaticTable caption="Orders" columns={['Customer']} rows={[]} />);
  expect(screen.getByText('No data available.')).toBeVisible();
});
