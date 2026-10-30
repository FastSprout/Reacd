import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatPromptExample } from './chat-prompt.js';

it('runs explicit composer send/stop/retry and attachment controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatPromptExample />
    </ReacdProvider>,
  );
  const draft = screen.getByRole('textbox', { name: 'Example message' });
  await user.type(draft, 'Hello');
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(screen.getByText('Requested: Hello')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Stop response' }));
  await user.click(screen.getByRole('button', { name: 'Simulate response failure' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Example connection failed.');
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  await user.click(screen.getByRole('button', { name: 'Remove Example report' }));
  expect(screen.queryByRole('button', { name: 'Remove Example report' })).toBeNull();
});
