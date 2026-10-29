import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { SwitchExample } from './switch.js';
import { TextareaExample } from './textarea.js';
import { FormFieldExample } from './form-field.js';

it('runs Switch controlled submission, protection and loading examples', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SwitchExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Save publishing' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Enable this setting');
  await user.click(screen.getByRole('switch', { name: 'Publish updates' }));
  await user.click(screen.getByRole('button', { name: 'Save publishing' }));
  expect(screen.getByText('Publishing saved.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Read-only publishing' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only publishing' }));
  await user.click(screen.getByRole('switch', { name: 'Updating publishing' }));
  expect(screen.getByRole('status')).toHaveTextContent('Updating Publish updates');
  await user.click(screen.getByRole('switch', { name: 'Updating publishing' }));
});

it('runs bounded Textarea autoresize and protection examples', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <TextareaExample />
    </ReacdProvider>,
  );
  await user.type(screen.getByRole('textbox', { name: 'Release notes' }), 'Ready');
  expect(screen.getByText('5 characters')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Automatic notes height' }));
  await user.click(screen.getByRole('switch', { name: 'Automatic notes height' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only notes' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only notes' }));
  await user.click(screen.getByRole('button', { name: 'Fill long release notes' }));
  const release = screen.getByRole('textbox');
  if (!(release instanceof HTMLTextAreaElement)) throw new Error('Missing textarea');
  expect(release.value).toContain('Line 10');
  await user.click(screen.getByRole('button', { name: 'Clear release notes' }));
  expect(screen.getByRole('textbox')).toHaveValue('');
});

it('runs field errors, direction and native submission', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
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
  expect(notes).not.toHaveAttribute('aria-invalid');
  await user.click(screen.getByRole('button', { name: 'Save account fields' }));
  expect(screen.getByText('Account saved.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Right to left fields' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left fields' }));
  await user.click(screen.getByRole('switch', { name: 'Disable account fields' }));
  expect(notes).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable account fields' }));
});
