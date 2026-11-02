import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputDateExample } from './input-date.js';

it('edits and clears a delivery date', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputDateExample />
    </ReacdProvider>,
  );
  screen.getByRole('spinbutton', { name: /day, Delivery date/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(screen.getByText('Delivery date: 2026-11-17')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear Delivery date' }));
  expect(screen.getByText('Choose a delivery date.')).toBeVisible();
});
