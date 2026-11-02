import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiChart } from './chart.adapter.js';
import { MuiSurface } from '../surface/surface.adapter.js';
import { templates } from '../../../schema/design/templates.data.js';
import { templateSchema } from '../../../schema/design/templates.schema.js';

const data = {
  label: 'Sales', description: 'Quarterly sales',
  categories: [{ id: 'first', label: 'First' }, { id: 'second', label: 'Second' }],
  series: [{ id: 'sales', label: 'Sales', values: [10, null] }],
};

it('maps the selected Material theme into actual native series colors', () => {
  const template = templates['saas-modern-light'];
  const view = render(
    <MuiSurface templateId="saas-modern-light" template={template}>
      <MuiChart {...data} />
    </MuiSurface>,
  );
  expect(view.container.querySelector('.MuiLineChart-line'))
    .toHaveAttribute('stroke', template.colors.primary);
});

it('keeps traces visible when a valid primary matches the chart surface', () => {
  const base = templates['saas-modern-light'];
  const template = templateSchema.parse({ ...base, colors: {
    ...base.colors, primary: '#ffffff', onPrimary: '#000000',
  } });
  const view = render(
    <MuiSurface templateId="saas-modern-light" template={template}>
      <MuiChart {...data} />
    </MuiSurface>,
  );
  expect(view.container.querySelector('.MuiLineChart-line'))
    .toHaveAttribute('stroke', template.colors.text);
});

it.each(['line', 'bar', 'area', 'donut'] as const)(
  'renders native %s and the complete accessible table', (kind) => {
    const { container } = render(<MuiChart {...data} kind={kind} />);
    expect(screen.getByRole('group', { name: 'Sales' }))
      .toHaveAccessibleDescription('Quarterly sales');
    expect(container.querySelector('.MuiChartsSurface-root')).not.toBeNull();
    expect(container.querySelector('svg [class*="Mui"]')).not.toBeNull();
    const table = screen.getByRole('table', { name: 'Sales data' });
    expect(screen.getByRole('region', { name: 'Sales data' }))
      .toHaveAttribute('tabindex', '0');
    expect(within(table).getByText('10')).toBeVisible();
    expect(within(table).getByText('No value')).toBeVisible();
    expect(screen.getByText('Quarterly sales', { selector: 'p' })).toBeVisible();
  },
);

it('keeps empty and zero-share tables and handles native error retry', async () => {
  const retry = vi.fn();
  const view = render(<MuiChart {...data} categories={[]} series={[]} />);
  expect(screen.getByRole('status')).toHaveTextContent('No chart data available.');
  expect(screen.getByRole('table')).toBeVisible();
  view.rerender(<MuiChart {...data} kind="donut"
    series={[{ id: 'sales', label: 'Sales', values: [0, null] }]} />);
  expect(screen.getByRole('img', { name: 'Sales' })).toHaveTextContent(
    'No chart data available.',
  );
  view.rerender(<MuiChart {...data} state="loading" loadingMessage="Fetching" />);
  expect(screen.getByRole('status')).toHaveTextContent('Fetching');
  view.rerender(<MuiChart {...data} state="error" onRetry={retry} />);
  await userEvent.click(screen.getByRole('button', { name: 'Retry chart' }));
  expect(retry).toHaveBeenCalledWith();
});

it('uses default line rendering and owner-provided status and retry labels',
  async () => {
    const retry = vi.fn();
    const view = render(<MuiChart {...data} />);
    expect(view.container.querySelector('.MuiLineChart-line')).not.toBeNull();
    view.rerender(<MuiChart {...data} state="loading" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading chart data');
    view.rerender(<MuiChart {...data} state="error" errorMessage="Network failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network failed');
    expect(screen.queryByRole('button')).toBeNull();
    view.rerender(<MuiChart {...data} state="error" onRetry={retry}
      retryLabel="Try again" />);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledOnce();
  });
