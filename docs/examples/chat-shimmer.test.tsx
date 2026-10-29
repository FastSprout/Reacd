import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ChatShimmerExample } from './chat-shimmer.js';

it('runs progress text edits and switches to plain text when inactive', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatShimmerExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Example progress text' });
  await user.clear(input);
  expect(screen.getByRole('status')).toHaveTextContent('Example progress');
  await user.type(input, 'Updated example progress');
  expect(screen.getByRole('status')).toHaveTextContent('Updated example progress');
  await user.click(screen.getByRole('switch', { name: 'Animate example status' }));
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText('Updated example progress')).toBeVisible();
});
