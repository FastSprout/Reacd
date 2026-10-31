import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CalendarExample } from './calendar.js';

it('runs documented selection, form, protection and direction controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <CalendarExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Save calendar selection' }));
  expect(screen.getByText('Calendar selection saved.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Clear calendar selection' }));
  expect(screen.getByText('Date: empty')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /October 30, 2026$/ }));
  expect(screen.getByText('Date: 2026-10-30')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Show two calendar months' }));
  await user.click(screen.getByRole('switch', { name: 'Show two calendar months' }));
  await user.click(screen.getByRole('switch', { name: 'Calendar range selection' }));
  await user.click(screen.getByRole('button', { name: /October 29, 2026$/ }));
  expect(screen.getByText('Range: 2026-10-29 to empty')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /October 30, 2026$/ }));
  expect(screen.getByText('Range: 2026-10-29 to 2026-10-30')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Show two calendar months' }));
  await user.click(screen.getByRole('switch', { name: 'Show two calendar months' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left calendar' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left calendar' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only calendar' }));
  expect(
    screen.getByRole('button', { name: 'Clear calendar selection' }),
  ).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Read-only calendar' }));
  await user.click(screen.getByRole('switch', { name: 'Disable calendar' }));
  expect(screen.getByRole('group', { name: 'Delivery calendar' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
});
