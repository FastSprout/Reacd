import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputDateExample } from './input-date.js';

it('runs date, range, locale, protection and form examples', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputDateExample />
    </ReacdProvider>,
  );
  screen.getByRole('spinbutton', { name: /day, Event date/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(screen.getByText('Event date: 2024-02-29')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Save dates' }));
  expect(screen.getByText('Dates saved.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Right to left dates' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left dates' }));
  await user.click(screen.getByRole('switch', { name: 'Arabic date locale' }));
  await user.click(screen.getByRole('switch', { name: 'Arabic date locale' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only dates' }));
  expect(screen.getByRole('button', { name: 'Clear Event date' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Read-only dates' }));
  await user.click(screen.getByRole('switch', { name: 'Disable dates' }));
  expect(screen.getByRole('button', { name: 'Clear Event date' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Disable dates' }));
  await user.click(screen.getByRole('button', { name: 'Clear Start Booking dates' }));
  await user.click(screen.getByRole('button', { name: 'Clear End Booking dates' }));
  await user.click(screen.getByRole('button', { name: 'Clear Event date' }));
  expect(screen.getByText('Event date: empty')).toBeInTheDocument();
  expect(screen.getByText('Booking dates: empty to empty')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Restore sample dates' }));
  expect(screen.getByText('Event date: 2024-02-28')).toBeInTheDocument();
});

it('restores same-value sample dates and clears a partial draft', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputDateExample />
    </ReacdProvider>,
  );
  const month = screen.getByRole('spinbutton', { name: /month, Event date/i });
  month.focus();
  await user.keyboard('{Backspace}');
  expect(month).not.toHaveAttribute('aria-valuenow');
  expect(screen.getByText('Event date: 2024-02-28')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Restore sample dates' }));
  expect(
    screen.getByRole('spinbutton', { name: /month, Event date/i }),
  ).toHaveAttribute('aria-valuenow', '2');
});
