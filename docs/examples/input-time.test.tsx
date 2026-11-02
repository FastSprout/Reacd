import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputTimeExample } from './input-time.js';

it('edits and clears a meeting time', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <InputTimeExample />
    </ReacdProvider>,
  );
  screen.getByRole('spinbutton', { name: /hour, Meeting time/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(screen.getByText('Meeting time: 10:00:00')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear Meeting time' }));
  expect(screen.getByText('Choose a meeting time.')).toBeVisible();
});
