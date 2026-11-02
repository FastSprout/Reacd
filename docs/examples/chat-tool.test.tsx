import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatToolExample } from './chat-tool.js';

it('applies host approval, rejection and retry decisions', async () => {
  const view = render(
    <ReacdProvider>
      <ChatToolExample />
    </ReacdProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Reject tool request' }));
  await userEvent.click(screen.getByRole('button', { name: 'Retry tool request' }));
  await userEvent.click(screen.getByRole('button', { name: 'Approve tool request' }));
  expect(screen.getByText('Completed')).toBeVisible();
  expect(view.container.querySelector('script')).toBeNull();
});
