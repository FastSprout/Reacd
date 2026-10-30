import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { InputNumberExample } from './input-number.js';

it('runs the documented numeric controls without application DOM or CSS', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <InputNumberExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left numeric field' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left numeric field' }));
  await user.click(screen.getByRole('button', { name: 'Increase Quantity' }));
  expect(screen.getByText('Quantity: 0.2')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Clear quantity' }));
  expect(screen.getByText('Quantity is empty.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Read-only quantity' }));
  expect(screen.getByRole('button', { name: 'Clear quantity' })).toBeDisabled();
});
