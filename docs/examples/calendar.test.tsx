import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CalendarExample } from './calendar.js';

it('chooses a delivery day', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <CalendarExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Choose a delivery day.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: /November 18, 2026$/ }));
  expect(screen.getByText('Delivery day: 2026-11-18')).toBeVisible();
});
