import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { AlertExample } from './alert.js';
it('runs documented alert actions, dismissal and readonly visibility', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <AlertExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Review delivery' }));
  expect(screen.getByText('Delivery review requests: 1')).toBeInTheDocument();
  await user.click(
    screen.getByRole('button', { name: 'Dismiss Review delivery details' }),
  );
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Show delivery alert' }));
  await user.click(screen.getByRole('switch', { name: 'Readonly alert visibility' }));
  expect(
    screen.queryByRole('button', { name: 'Dismiss Review delivery details' }),
  ).toBeNull();
});
