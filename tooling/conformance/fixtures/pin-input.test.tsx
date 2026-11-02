import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PinInputExample } from './pin-input.js';

it('preserves completion, masking, submission and controlled clearing', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PinInputExample />
    </ReacdProvider>,
  );
  const rtl = screen.getByRole('switch', { name: 'Right to left PIN field' });
  await user.click(rtl);
  await user.click(rtl);
  await user.type(screen.getByRole('textbox', { name: 'Verification code' }), '001234');
  expect(screen.getByText('Code is complete.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Mask code' }));
  expect(screen.getByLabelText('Verification code')).toHaveAttribute(
    'type',
    'password',
  );
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  await waitFor(() => expect(screen.getByText('Code submitted.')).toBeInTheDocument());
  await user.click(screen.getByRole('button', { name: 'Clear code' }));
  expect(screen.getByText('Enter a six-digit code.')).toBeInTheDocument();
});

it('retains long alphabetic values, grouping and native serialization', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PinInputExample />
    </ReacdProvider>,
  );
  const long = screen.getByRole('switch', { name: 'Twelve-character code' });
  const alphabet = screen.getByRole('switch', { name: 'Alphanumeric code' });
  const grouping = screen.getByRole('switch', { name: 'Group code slots' });
  await user.click(long);
  await user.click(alphabet);
  await user.click(grouping);
  const input = screen.getByRole('textbox', { name: 'Verification code' });
  expect(input).toHaveAttribute('maxlength', '12');
  await user.type(input, 'WWWWWWWWWWWW');
  expect(screen.getByText('Code is complete.')).toBeInTheDocument();
  const form = screen.getByRole('form', { name: 'Code verification' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect([...new FormData(form)]).toEqual([['code', 'WWWWWWWWWWWW']]);
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  await waitFor(() => expect(screen.getByText('Code submitted.')).toBeInTheDocument());
  await user.click(grouping);
  await user.click(alphabet);
  expect(input).toHaveValue('');
  await user.click(long);
  expect(input).toHaveAttribute('maxlength', '6');
});

it('keeps the named code while its Form is pending', async () => {
  const user = userEvent.setup();
  render(<ReacdProvider adapter={shadcnAdapter}><PinInputExample /></ReacdProvider>);
  await user.type(screen.getByLabelText('Verification code'), '001234');
  const pending = screen.getByRole('switch', { name: 'Submitting code' });
  await user.click(pending);
  const form = screen.getByRole('form', { name: 'Code verification' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect([...new FormData(form)]).toEqual([['code', '001234']]);
  expect(form.querySelector('fieldset')).toHaveAttribute('inert');
  await user.click(pending);
  await user.click(screen.getByRole('button', { name: 'Submit code' }));
  await waitFor(() => expect(screen.getByText('Code submitted.')).toBeInTheDocument());
});
