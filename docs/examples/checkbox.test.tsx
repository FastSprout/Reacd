import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { CheckboxExample } from './checkbox.js';

it('runs mixed approval, protection and form examples', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <CheckboxExample />
    </ReacdProvider>,
  );
  const writer = screen.getByRole('checkbox', { name: 'Approve selected accounts' });
  await user.click(screen.getByRole('button', { name: 'Save approval' }));
  expect(writer).toHaveFocus();
  expect(screen.getByText('Approval is not saved.')).toBeVisible();
  await user.click(writer);
  expect(writer).toHaveAttribute('aria-checked', 'true');
  expect(screen.getByRole('checkbox', { name: 'Approval reader' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  await user.click(screen.getByRole('button', { name: 'Save approval' }));
  expect(screen.getByText('Approval saved.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Read-only approval' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only approval' }));
  await user.click(screen.getByRole('switch', { name: 'Disable approval' }));
  expect(writer).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable approval' }));
  await user.click(screen.getByRole('switch', { name: 'Mixed approval state' }));
  await user.click(screen.getByRole('switch', { name: 'Mixed approval state' }));
  await user.click(writer);
  expect(screen.getByText('Approval state: unapproved')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Reset approval' }));
  expect(screen.getByText('Approval state: mixed')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Right to left approval' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left approval' }));
});
