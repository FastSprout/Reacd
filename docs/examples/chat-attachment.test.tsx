import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatAttachmentExample } from './chat-attachment.js';

it('removes the sample file through the host callback', async () => {
  render(
    <ReacdProvider>
      <ChatAttachmentExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('example-reference.txt')).toBeVisible();
  await userEvent.click(
    screen.getByRole('button', { name: 'Remove example-reference.txt' }),
  );
  expect(screen.getByText('Example attachment removed.')).toBeVisible();
});
