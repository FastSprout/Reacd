import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnTable } from './table.adapter.js';
import { TableSurface } from '../../../renderer/table/table.renderer.js';
const BASE = { caption: 'Static', columns: ['Name'], rows: [['Alpha']] };
it('preserves real static semantics and truthful data states', async () => {
  const user = userEvent.setup();
  const retry = vi.fn();
  const view = render(<ShadcnTable {...BASE} />);
  expect(screen.getByRole('table', { name: 'Static' })).toBeVisible();
  view.rerender(<ShadcnTable {...BASE} rows={[]} />);
  expect(screen.getByRole('status')).toHaveTextContent('No data available');
  view.rerender(<ShadcnTable {...BASE} rows={[]} emptyMessage="No records" />);
  expect(screen.getByRole('status')).toHaveTextContent('No records');
  view.rerender(<ShadcnTable {...BASE} state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading data');
  view.rerender(<ShadcnTable {...BASE} state="loading" loadingMessage="Please wait" />);
  expect(screen.getByRole('status')).toHaveTextContent('Please wait');
  view.rerender(<ShadcnTable {...BASE} state="error" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <ShadcnTable {...BASE} state="error" errorMessage="Offline" onRetry={retry} />,
  );
  await user.click(screen.getByRole('button', { name: 'Retry table' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  view.rerender(
    <ShadcnTable {...BASE} state="error" onRetry={retry} retryLabel="Reload records" />,
  );
  expect(screen.getByRole('button', { name: 'Reload records' })).toBeInTheDocument();
});
it('retains the trusted legacy surface state contract', () => {
  const view = render(<TableSurface {...BASE} state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading data');
  view.rerender(<TableSurface {...BASE} state="error" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load data');
  view.rerender(<TableSurface {...BASE} state="error" errorMessage="Offline" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Offline');
  view.rerender(<TableSurface {...BASE} rows={[]} />);
  expect(screen.getByRole('status')).toHaveTextContent('No data available');
  view.rerender(<TableSurface {...BASE} rows={[]} emptyMessage="No records" />);
  expect(screen.getByRole('status')).toHaveTextContent('No records');
});
