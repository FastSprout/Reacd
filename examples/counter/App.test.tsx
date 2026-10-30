import { render, screen, within, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { App } from './App.js';

it('increments and resets independent counter applications', async () => {
  const user = userEvent.setup();
  const first = render(<App />);
  const second = render(<App />);
  await user.click(within(first.container).getByRole('button', { name: 'Increment' }));
  await user.click(within(first.container).getByRole('button', { name: 'Increment' }));
  expect(within(first.container).getByText('Count: 2')).toBeVisible();
  expect(within(second.container).getByText('Count: 0')).toBeVisible();
  await user.click(within(first.container).getByRole('button', { name: 'Reset' }));
  expect(within(first.container).getByText('Count: 0')).toBeVisible();
});

it('boots the actual public entry and remains interactive', async () => {
  const host = document.createElement('div');
  host.id = 'root';
  document.body.append(host);
  const mounted = await act(async () => import('./main.js'));
  try {
    await userEvent.setup().click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByText('Count: 1')).toBeVisible();
  } finally {
    await act(async () => mounted.root.unmount());
    host.remove();
  }
});
