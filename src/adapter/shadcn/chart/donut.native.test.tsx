import { render, screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { installLayout } from '../../../../test-support/layout-observer.js';
import { ShadcnChart } from './chart.adapter.js';

it('renders native Pie sectors without fabricating missing values', async () => {
  const restore = installLayout(640);
  try {
    render(<ShadcnChart label="Shares" description="Distribution" kind="donut"
      categories={['a', 'b', 'c', 'd'].map(id => ({ id, label: id }))}
      series={[{ id: 'share', label: 'Share', values: [2, null, 0, 5] }]} />);
    await waitFor(() => expect(screen.getByRole('img')
      .querySelectorAll('.recharts-sector')).toHaveLength(2));
    expect(screen.getByRole('table')).toHaveTextContent('No value');
    expect(screen.getByRole('table')).toHaveTextContent('0');
  } finally { restore(); }
});
