import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatReasoningExample } from './chat-reasoning.js';

it('opens the host-provided sample summary with native disclosure', async () => {
  render(
    <ReacdProvider>
      <ChatReasoningExample />
    </ReacdProvider>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Reasoning summary' }));
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveTextContent(
    'Sample summary: check the component contract',
  );
});
