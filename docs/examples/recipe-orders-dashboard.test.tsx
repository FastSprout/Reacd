import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { OrdersDashboardExample } from './recipe-orders-dashboard.js';

it('combines filters, handles no matches and restores all sample rows', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <OrdersDashboardExample />
    </ReacdProvider>,
  );
  const query = screen.getByRole('textbox', { name: 'Filter orders' });
  const openOnly = screen.getByRole('switch', { name: 'Open orders only' });
  const table = within(screen.getByRole('table', { name: 'Sample orders' }));
  expect(screen.getByText('Visible orders: 3')).toBeVisible();
  await user.click(openOnly);
  expect(screen.getByText('Visible orders: 2')).toBeVisible();
  expect(table.queryByText('Mina')).toBeNull();
  await user.type(query, 'ADA');
  expect(screen.getByText('Visible orders: 1')).toBeVisible();
  expect(table.getByText('Ada')).toBeVisible();
  await user.clear(query);
  await user.type(query, 'Mina');
  expect(screen.getByText('Visible orders: 0')).toBeVisible();
  expect(screen.getByText('No matching orders.')).toBeVisible();
  await user.click(openOnly);
  expect(screen.getByRole('cell', { name: 'Mina' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(query).toHaveValue('');
  expect(openOnly).toHaveAttribute('aria-checked', 'false');
  expect(screen.getByText('Visible orders: 3')).toBeVisible();
});
