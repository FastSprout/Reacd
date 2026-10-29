import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ChatMessageExample } from './chat-message.js';

it('runs message editing, stream status, failure and host actions', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatMessageExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Example response' });
  await user.clear(input);
  await user.type(input, 'Updated example');
  expect(screen.getByRole('article')).toHaveTextContent('Updated example');
  await user.click(screen.getByRole('button', { name: 'Stream example response' }));
  expect(screen.getByRole('status')).toHaveTextContent('Receiving response.');
  await user.click(screen.getByRole('button', { name: 'Fail example response' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Simulated interruption.');
  await user.click(screen.getByRole('button', { name: 'Finish example response' }));
  expect(screen.queryByRole('alert')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Save example response' }));
  expect(screen.getByText('Example response saved.')).toBeVisible();
});
