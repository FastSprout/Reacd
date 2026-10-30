import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PinInputExample } from './pin-input.js';

it('runs the documented completion, masking, submission, and clearing', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PinInputExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left PIN field' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left PIN field' }));
  await user.type(screen.getByRole('textbox', { name: 'Verification code' }), '123456');
  expect(screen.getByText('Code is complete.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Mask code' }));
  expect(screen.getByLabelText('Verification code')).toHaveAttribute(
    'type',
    'password',
  );
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  expect(screen.getByText('Code submitted.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Clear code' }));
  expect(screen.getByText('Enter a six-digit code.')).toBeInTheDocument();
});
