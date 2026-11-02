import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PopoverExample } from './popover.js';

it('saves a note from the popover and closes it', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PopoverExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Add delivery note' }));
  await user.type(await screen.findByLabelText('Delivery note'), 'Leave at reception');
  await user.click(screen.getByRole('button', { name: 'Save note' }));
  expect(screen.getByText('Saved note: Leave at reception')).toBeVisible();
  await waitFor(() => {
    expect(screen.queryByRole('dialog', { name: 'Delivery instructions' })).toBeNull();
  });
});
