import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatMessagesExample } from './chat-messages.js';

it('appends a local message to the native transcript', async () => {
  render(
    <ReacdProvider>
      <ChatMessagesExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('log')).toHaveTextContent('No messages yet.');
  await userEvent.click(screen.getByRole('button', { name: 'Add local reply' }));
  expect(screen.getByRole('log')).toHaveTextContent('This reply was added locally.');
});
