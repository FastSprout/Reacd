import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { BadgeExample } from './badge.js';
it('runs documented badge severity and size changes', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <BadgeExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Ready')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Badge warning state' }));
  expect(screen.getByText('Review required')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Large badge' }));
  expect(screen.getByText('Review required').closest('[data-size]')).toHaveAttribute(
    'data-size',
    'large',
  );
});
