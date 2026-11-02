import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { defineThemeAdapter, ReacdProvider } from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';
import { nativeChartEntries } from './native-chart.js';
import { ChartExample } from '../../../../docs/examples/chart.js';

it('renders the closed public Chart example through the actual native entry', () => {
  const adapter = defineThemeAdapter({ ...shadcnAdapter, components: {
    ...shadcnAdapter.components, ...nativeChartEntries,
  } });
  render(<ReacdProvider adapter={adapter}><ChartExample /></ReacdProvider>);
  expect(screen.getByRole('img', { name: 'Monthly sales' })).toBeVisible();
  expect(screen.getByRole('table')).toHaveTextContent('January');
  expect(screen.getByRole('table')).toHaveTextContent('February');
  expect(screen.getByRole('table')).toHaveTextContent('March');
});
