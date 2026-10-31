import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputExample } from './input.js';

it('runs contact validation, autofill and protection', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputExample />
    </ReacdProvider>,
  );
  const email = screen.getByRole('textbox', { name: 'Contact email' });
  expect(email).toHaveAttribute('autocomplete', 'email');
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(screen.getByText('Contact saved.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear contact email' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only email' }));
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(email).toHaveFocus();
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
  await user.click(screen.getByRole('switch', { name: 'Read-only email' }));
  await user.type(email, 'invalid');
  await user.click(screen.getByRole('button', { name: 'Save contact' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address.');
  await user.click(screen.getByRole('button', { name: 'Restore contact email' }));
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('switch', { name: 'Updating email' }));
  expect(screen.getByRole('status')).toHaveTextContent('Updating Contact email');
  await user.click(screen.getByRole('switch', { name: 'Updating email' }));
  await user.click(screen.getByRole('switch', { name: 'Disable email' }));
  expect(email).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable email' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left email' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left email' }));
});
