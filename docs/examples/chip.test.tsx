import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChipExample } from './chip.js';

it('opens the inbox and clears its unread indicator', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChipExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Unread messages: 3' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Open messages' }));
  expect(screen.getByText('You are all caught up.')).toBeVisible();
  expect(screen.queryByRole('img', { name: 'Unread messages: 3' })).toBeNull();
});
