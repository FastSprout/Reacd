import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ToastExample } from './toast.js';

it('saves settings, dismisses feedback and restores changes through Undo', async () => {
  const user = userEvent.setup();
  render(<ReacdProvider><ToastExample /></ReacdProvider>);
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  const card = await screen.findByRole('dialog', { name: 'Changes saved' });
  expect(card).toHaveAccessibleDescription('Your project settings were updated.');
  await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  await user.click(await screen.findByRole('button', { name: 'Undo changes' }));
  expect(screen.getByText('Changes restored.')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await user.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.queryByText('Changes restored.')).toBeNull();
  expect(await screen.findByRole('dialog', { name: 'Changes saved' })).toBeVisible();
});
