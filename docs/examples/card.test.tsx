import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CardExample } from './card.js';
it('runs documented card slots and their host action', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <CardExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Review card details' }));
  expect(screen.getByText('Review requests: 1')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Show card header' }));
  expect(screen.queryByText('Review summary')).toBeNull();
  await user.click(screen.getByRole('switch', { name: 'Show card footer' }));
  expect(screen.queryByRole('button', { name: 'Review card details' })).toBeNull();
});
