import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { SelectExample } from './select.js';

it('runs choice edits, clear validation, protection and RTL', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SelectExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Clear Release status' }));
  await user.click(screen.getByRole('button', { name: 'Save choices' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
  const trigger = screen.getByRole('combobox', { name: 'Release status' });
  act(() => trigger.focus());
  await user.keyboard('{ArrowDown}');
  await screen.findByRole('listbox', { name: 'Release status' });
  await user.click(await screen.findByRole('option', { name: 'Draft' }));
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  expect(trigger).toHaveTextContent('Draft');
  await user.click(screen.getByRole('button', { name: 'Save choices' }));
  expect(screen.getByText('Selection saved.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear Included statuses' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only choices' }));
  await user.click(screen.getByRole('switch', { name: 'Loading choices' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left choices' }));
  expect(screen.getByRole('combobox', { name: 'Release status' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
});
