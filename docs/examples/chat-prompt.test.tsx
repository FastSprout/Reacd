import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatPromptExample } from './chat-prompt.js';

it('requests submission without clearing the controlled draft', async () => {
  render(
    <ReacdProvider>
      <ChatPromptExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Message' });
  await userEvent.type(input, 'Hello');
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(screen.getByText('Last sent: Hello')).toBeVisible();
  expect(input).toHaveValue('Hello');
});
