import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { FormFieldExample } from './form-field.js';

it('runs field errors, direction and native submission', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <FormFieldExample />
    </ReacdProvider>,
  );
  const notes = screen.getByRole('textbox', { name: 'Account notes' });
  await user.click(screen.getByRole('button', { name: 'Save account fields' }));
  expect(screen.getByText('Account is not saved.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Approve account' }));
  await user.type(notes, 'Reviewed');
  await user.click(screen.getByRole('button', { name: 'Reject account notes' }));
  expect(notes).toHaveAttribute('aria-invalid', 'true');
  await user.click(screen.getByRole('button', { name: 'Save account fields' }));
  expect(notes).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Clear account error' }));
  expect(notes).not.toHaveAttribute('aria-invalid', 'true');
  await user.click(screen.getByRole('button', { name: 'Save account fields' }));
  expect(screen.getByText('Account saved.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Right to left fields' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left fields' }));
  await user.click(screen.getByRole('switch', { name: 'Disable account fields' }));
  expect(notes).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable account fields' }));
});
