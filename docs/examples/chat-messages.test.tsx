import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ChatMessagesExample } from './chat-messages.js';

it('runs transcript, recovery, direction and following controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatMessagesExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('log')).toHaveTextContent('No messages yet.');
  const input = screen.getByRole('textbox', { name: 'Transcript message text' });
  await user.clear(input);
  await user.type(input, 'Transcript example');
  await user.click(screen.getByRole('button', { name: 'Add example message' }));
  expect(screen.getByRole('log')).toHaveTextContent('Transcript example');
  await user.click(screen.getByRole('switch', { name: 'Right to left conversation' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left conversation' }));
  await user.click(
    screen.getByRole('switch', { name: 'Follow latest conversation message' }),
  );
  await user.click(
    screen.getByRole('switch', { name: 'Follow latest conversation message' }),
  );
  await user.click(screen.getByRole('button', { name: 'Wait for example response' }));
  expect(screen.getByRole('status')).toHaveTextContent('Waiting for a response.');
  await user.click(screen.getByRole('button', { name: 'Stream example conversation' }));
  expect(screen.getByRole('status')).toHaveTextContent('Receiving response.');
  await user.click(screen.getByRole('button', { name: 'Fail example conversation' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Simulated connection failure.');
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Clear example conversation' }));
  expect(screen.getByRole('log')).toHaveTextContent('No messages yet.');
});
