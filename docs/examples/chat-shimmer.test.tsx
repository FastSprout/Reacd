import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatShimmerExample } from './chat-shimmer.js';

it('finishes sample progress without hiding its status text', async () => {
  render(
    <ReacdProvider>
      <ChatShimmerExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Processing a sample task.');
  await userEvent.click(screen.getByRole('button', { name: 'Finish sample task' }));
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText('Sample task finished.')).toBeVisible();
});
