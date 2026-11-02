import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ChartDataTable } from './table.js';

it('keeps scoped original values and named scrolling apart from the image', () => {
  render(<ChartDataTable label="Counts"
    categories={[{ id: 'a', label: 'First' }, { id: 'b', label: 'Second' }]}
    series={[{ id: 'count', label: 'Count', values: [0, null] }]} />);
  const region = screen.getByRole('region', { name: 'Counts data' });
  expect(region).toHaveAttribute('tabindex', '0');
  const table = within(region).getByRole('table', { name: 'Counts data' });
  expect(table).toHaveTextContent('0');
  expect(table).toHaveTextContent('No value');
  expect(within(table).getByRole('columnheader', { name: 'Category' }))
    .toHaveAttribute('scope', 'col');
  expect(within(table).getByRole('rowheader', { name: 'First' }))
    .toHaveAttribute('scope', 'row');
});
