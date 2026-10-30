import { render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { App } from './App.js';

it('validates, saves and clears a contact without a server', async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(screen.getByText('No contact saved.')).toBeVisible();
  const field = screen.getByRole('textbox', { name: 'Contact name' });
  await user.type(field, 'Ada');
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(screen.getByText('Saved contact for Ada.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear contact' }));
  expect(field).toHaveValue('');
  expect(screen.getByText('No contact saved.')).toBeVisible();
});

it('mounts the public form entry', async () => {
  const host = document.createElement('div');
  host.id = 'root';
  document.body.append(host);
  const mounted = await act(async () => import('./main.js'));
  try {
    expect(screen.getByRole('form', { name: 'Contact details' })).toBeVisible();
  } finally {
    await act(async () => mounted.root.unmount());
    host.remove();
  }
});
