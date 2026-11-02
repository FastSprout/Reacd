import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PinInputExample } from './pin-input.js';

it('verifies a six-digit code through native focus, submit and clearing', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PinInputExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Verification code' });
  await user.type(input, '12');
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  await waitFor(() => expect(input).toHaveFocus());
  expect(screen.getByText('Enter a six-digit code.')).toBeInTheDocument();
  await user.clear(input);
  await user.type(input, '001234');
  expect(screen.getByText('Code is complete.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  await waitFor(() => expect(screen.getByText('Code submitted.')).toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: 'Clear code' }));
  expect(input).toHaveValue('');
  expect(screen.getByText('Enter a six-digit code.')).toBeInTheDocument();
});
