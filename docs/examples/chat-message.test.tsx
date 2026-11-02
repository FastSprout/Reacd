import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatMessageExample } from './chat-message.js';

it('saves a response through a native message action', async () => {
  render(
    <ReacdProvider>
      <ChatMessageExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('article', { name: 'Sample assistant' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Save response' }));
  expect(screen.getByText('Response saved.')).toBeVisible();
});
