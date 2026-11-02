import { render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { ShadcnChart } from './chart.adapter.js';

const categories = [
  { id: 'review', label: 'Review' },
  { id: 'draft', label: 'Draft' },
  { id: 'done', label: 'Done' },
];
const series = [{ id: 'count', label: 'Count', values: [2, null, 3] }];

it.each(['line', 'area', 'bar', 'donut'] as const)(
  'renders native %s with its complete semantic data table', async (kind) => {
    const restore = installLayout(640);
    try {
      render(<ShadcnChart label="Activity" description="Workflow totals"
        categories={categories} series={series} kind={kind} />);
      const graphic = screen.getByRole('img', { name: 'Activity' });
      expect(graphic).toHaveAccessibleDescription('Workflow totals');
      await waitFor(() => expect(graphic.querySelector('svg.recharts-surface'))
        .not.toBeNull());
      const native = kind === 'donut' ? 'pie' : kind;
      await waitFor(() => expect(graphic.querySelector(`.recharts-${native}`))
        .not.toBeNull());
      expect(screen.getByRole('region', { name: 'Activity data' }))
        .toHaveAttribute('tabindex', '0');
      const table = screen.getByRole('table', { name: 'Activity data' });
      expect(table).toHaveTextContent('No value');
      expect(screen.getByRole('columnheader', { name: 'Count' })).toBeVisible();
      expect(screen.getByRole('rowheader', { name: 'Draft' })).toBeVisible();
      expect(graphic.contains(table)).toBe(false);
      expect(graphic.querySelector('[role="application"]')).toBeNull();
    } finally { restore(); }
  },
);

it('retains original zero/missing donut data with an explicit empty graphic', () => {
  render(<ShadcnChart label="Shares" description="Distribution" kind="donut"
    categories={categories} series={[{ id: 'count', label: 'Count',
      values: [0, null, 0] }]} emptyMessage="No positive shares" />);
  expect(screen.getByRole('img', { name: 'Shares' }))
    .toHaveTextContent('No positive shares');
  expect(screen.getByRole('table')).toHaveTextContent('0');
  expect(screen.getByRole('table')).toHaveTextContent('No value');
  expect(document.querySelector('.recharts-pie')).toBeNull();
});

it('maps request states and invokes retry without arguments', async () => {
  const retry = vi.fn();
  const base = { label: 'Activity', description: 'Totals', categories, series };
  const view = render(<ShadcnChart {...base} state="loading"
    loadingMessage="Fetching totals" />);
  expect(screen.getByRole('status')).toHaveTextContent('Fetching totals');
  expect(screen.queryByRole('table')).toBeNull();
  view.rerender(<ShadcnChart {...base} state="error" errorMessage="Offline"
    onRetry={retry} retryLabel="Retry request" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Offline');
  await userEvent.click(screen.getByRole('button', { name: 'Retry request' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  view.rerender(<ShadcnChart {...base} state="error" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load chart data.');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(<ShadcnChart {...base} state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading chart data…');
  view.rerender(<ShadcnChart {...base} series={[]} />);
  expect(screen.getByRole('status')).toHaveTextContent('No chart data available.');
  view.rerender(<ShadcnChart {...base} categories={[]} series={[]}
    emptyMessage="Nothing recorded" />);
  expect(screen.getByRole('status')).toHaveTextContent('Nothing recorded');
});
