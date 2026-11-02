import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatPromptSubmitExample } from './chat-prompt-submit.js';

it('requests each stage of the sample lifecycle', async () => {
  render(
    <ReacdProvider>
      <ChatPromptSubmitExample />
    </ReacdProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  await userEvent.click(screen.getByRole('button', { name: 'Stop response' }));
  await userEvent.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(screen.getByRole('button', { name: 'Send message' })).not.toBeDisabled();
});
