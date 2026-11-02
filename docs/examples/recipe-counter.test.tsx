import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { ReacdProvider } from '@fastsprout/reacd';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { CounterExample } from './recipe-counter.js';

it('increments and resets the documented counter', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <CounterExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Count: 0')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByText('Count: 1')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByText('Count: 0')).toBeVisible();
});
