import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputMenuExample } from './input-menu.js';

it('runs the documented text, status, veto and scope controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <InputMenuExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: 'Destination' });
  await user.click(screen.getByRole('switch', { name: 'Decline suggested text' }));
  await user.click(input);
  await user.click(screen.getByRole('option', { name: /Kraków/ }));
  expect(input).toHaveValue('');
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('switch', { name: 'Decline suggested text' }));
  await user.type(input, 'Custom place');
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('button', { name: 'Save destination' }));
  expect(screen.getByText('Destination saved.')).toBeInTheDocument();
  for (const label of [
    'Loading suggestions',
    'Suggestions unavailable',
    'Read-only suggestions',
    'Disable suggestions',
    'Right to left suggestions',
  ]) {
    await user.click(screen.getByRole('switch', { name: label }));
    await user.click(screen.getByRole('switch', { name: label }));
  }
  await user.click(screen.getByRole('button', { name: 'Open nested suggestions' }));
  expect(screen.getByRole('combobox', { name: 'Dialog destination' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Close' }));
  await user.click(screen.getByRole('button', { name: 'Use Paris from host' }));
  expect(input).toHaveValue('Paris');
});
