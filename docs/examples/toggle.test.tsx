import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ToggleExample } from './toggle.js';

it('runs the Toggle public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ToggleExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Email summaries' }));
  expect(screen.getByText('Email summaries are enabled.')).toBeVisible();
});
