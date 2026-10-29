import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ButtonExample } from './button.js';
it('runs the documented busy and disabled button states', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ButtonExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Request export' }));
  expect(screen.getByText('Export requests: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Busy export button' }));
  expect(screen.getByRole('button', { name: 'Requesting export' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Busy export button' }));
  await user.click(screen.getByRole('switch', { name: 'Disable export button' }));
  expect(screen.getByRole('button', { name: 'Request export' })).toBeDisabled();
});
