import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { App, ReacdProvider } from '../../../index.js';
import { ShadcnChart } from './chart.adapter.js';
import type { ChartProps } from '../../../components/chart/index.js';
const BASE: ChartProps = {
  label: 'Activity',
  description: 'Signed activity by category.',
  categories: [
    { id: 'one', label: 'One' },
    { id: 'two', label: 'Two' },
    { id: 'three', label: 'Three' },
  ],
  series: [
    { id: 'first', label: 'First', values: [-5, null, 10] },
    { id: 'second', label: 'Second', values: [0, 2, 0] },
  ],
};
it('renders honest graphics with original accessible values for each kind', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ShadcnChart {...BASE} />
    </ReacdProvider>,
  );
  const graph = screen.getByRole('img', { name: 'Activity' });
  expect(graph).toHaveAccessibleDescription(BASE.description);
  const table = screen.getByRole('table', { name: 'Activity data' });
  expect(within(table).getByRole('rowheader', { name: 'Two' })).toBeVisible();
  expect(within(table).getByText('No value')).toBeVisible();
  expect(graph.querySelectorAll('[data-series="first"] path')).toHaveLength(2);
  for (const kind of ['area', 'bar'] as const) {
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ShadcnChart {...BASE} kind={kind} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('img', { name: 'Activity' })).toHaveAttribute('viewBox');
    expect(screen.getByRole('table', { name: 'Activity data' })).toBeVisible();
  }
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <App direction="rtl">
        <ShadcnChart
          {...BASE}
          kind="donut"
          series={[{ id: 'count', label: 'Count', values: [1, null, 3] }]}
        />
      </App>
    </ReacdProvider>,
  );
  expect(
    screen.getByRole('img', { name: 'Activity' }).querySelectorAll('[data-slice]'),
  ).toHaveLength(2);
  expect(screen.getByRole('list', { name: 'Data series' })).toHaveTextContent('One');
});
it('exposes safe states and actual retry callbacks', async () => {
  const user = userEvent.setup();
  const retry = vi.fn();
  const view = render(<ShadcnChart {...BASE} categories={[]} series={[]} />);
  expect(screen.getByRole('status')).toHaveTextContent('No chart data');
  view.rerender(<ShadcnChart {...BASE} state="loading" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading chart');
  view.rerender(<ShadcnChart {...BASE} state="error" errorMessage="Chart offline" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Chart offline');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(<ShadcnChart {...BASE} state="error" onRetry={retry} />);
  await user.click(screen.getByRole('button', { name: 'Retry chart' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  view.rerender(
    <ShadcnChart
      {...BASE}
      kind="donut"
      series={[{ id: 'empty', label: 'Empty', values: [0, null, 0] }]}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('No chart data');
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByRole('table', { name: 'Activity data' })).toBeVisible();
});
