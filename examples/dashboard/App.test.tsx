import { render, screen, within, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { App } from './App.js';

it('filters sample orders, combines filters and clears them', async () => {
  const user = userEvent.setup();
  render(<App />);
  const query = screen.getByRole('textbox', { name: 'Filter orders' });
  const table = screen.getByRole('table', { name: 'Sample orders' });
  expect(screen.getByText('Visible orders: 3')).toBeVisible();
  await user.type(query, 'ada');
  expect(screen.getByText('Visible orders: 1')).toBeVisible();
  expect(within(table).getByText('Ada')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Open orders only' }));
  expect(screen.getByText('Visible orders: 1')).toBeVisible();
  await user.clear(query);
  expect(screen.getByText('Visible orders: 2')).toBeVisible();
  await user.type(query, 'Mina');
  expect(screen.getByText('No matching orders.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(query).toHaveValue('');
  expect(screen.getByRole('switch', { name: 'Open orders only' })).toHaveAttribute(
    'aria-checked',
    'false',
  );
  expect(screen.getByText('Visible orders: 3')).toBeVisible();
});

it('mounts the public dashboard entry', async () => {
  const host = document.createElement('div');
  host.id = 'root';
  document.body.append(host);
  const mounted = await act(async () => import('./main.js'));
  try {
    expect(screen.getByRole('table', { name: 'Sample orders' })).toBeVisible();
  } finally {
    await act(async () => mounted.root.unmount());
    host.remove();
  }
});
