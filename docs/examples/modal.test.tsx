import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ModalExample } from './modal.js';

it('saves a profile edit and keeps the controlled name on reopening', async () => {
  const user = userEvent.setup();
  render(<ReacdProvider adapter={shadcnAdapter}><ModalExample /></ReacdProvider>);
  const trigger = screen.getByRole('button', { name: 'Edit profile' });
  await user.click(trigger);
  const name = screen.getByRole('textbox', { name: 'Display name' });
  await user.clear(name);
  await user.type(name, 'Grace Hopper');
  await user.click(screen.getByRole('button', { name: 'Save profile' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByText('Saved name: Grace Hopper')).toBeVisible();
  await waitFor(() => expect(trigger).toHaveFocus());
  await user.click(trigger);
  expect(screen.getByRole('textbox', { name: 'Display name' }))
    .toHaveValue('Grace Hopper');
});
