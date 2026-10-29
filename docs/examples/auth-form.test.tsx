import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { AuthFormExample } from './auth-form.js';

it('runs independent provider and local submit actions', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <AuthFormExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Run local provider example' }));
  expect(screen.getByText('Local provider example selected')).toBeVisible();
  await user.click(screen.getByRole('combobox', { name: 'Example role' }));
  await user.click(await screen.findByRole('option', { name: 'Administrator' }));
  expect(screen.getByText('Example role: administrator')).toBeVisible();
  await user.type(screen.getByRole('textbox'), 'example@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit local example' }));
  expect(
    screen.getByText('Local example submitted: example@example.com'),
  ).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Auth example loading' }));
  expect(screen.getByRole('status')).toHaveTextContent('Submitting');
  await user.click(screen.getByRole('switch', { name: 'Auth example loading' }));
  await user.click(screen.getByRole('switch', { name: 'Auth example disabled' }));
  expect(screen.getByRole('textbox')).toBeDisabled();
});
