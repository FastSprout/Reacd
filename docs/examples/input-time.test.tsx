import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputTimeExample } from './input-time.js';

it('runs time, range, locale, protection and submit examples', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <InputTimeExample />
    </ReacdProvider>,
  );
  screen.getByRole('spinbutton', { name: /hour, Arrival time/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(screen.getByText('Arrival: 13:30:00')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Save times' }));
  expect(screen.getByText('Times saved.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Right to left times' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left times' }));
  await user.click(screen.getByRole('switch', { name: 'Arabic time locale' }));
  await user.click(screen.getByRole('switch', { name: 'Arabic time locale' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only times' }));
  expect(screen.getByRole('button', { name: 'Clear Arrival time' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Read-only times' }));
  await user.click(screen.getByRole('switch', { name: 'Disable times' }));
  expect(screen.getByRole('button', { name: 'Clear Arrival time' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable times' }));
  await user.click(screen.getByRole('button', { name: 'Clear Start Availability' }));
  await user.click(screen.getByRole('button', { name: 'Clear End Availability' }));
  await user.click(screen.getByRole('button', { name: 'Clear Arrival time' }));
  expect(screen.getByText('Arrival: empty')).toBeInTheDocument();
  expect(screen.getByText('Availability: empty to empty')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Restore sample times' }));
  expect(screen.getByText('Arrival: 12:30:00')).toBeInTheDocument();
});
