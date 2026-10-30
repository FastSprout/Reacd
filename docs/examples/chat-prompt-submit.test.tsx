import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatPromptSubmitExample } from './chat-prompt-submit.js';

it('cycles standalone submit capabilities through host state', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatPromptSubmitExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  await user.click(screen.getByRole('button', { name: 'Stop response' }));
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(screen.getByRole('button', { name: 'Send message' })).not.toBeDisabled();
});
