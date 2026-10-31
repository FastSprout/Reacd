import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatReasoningExample } from './chat-reasoning.js';

it('runs summary editing and controlled disclosure policies', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatReasoningExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Example summary text' });
  await user.clear(input);
  await user.click(screen.getByRole('button', { name: 'Reasoning summary' }));
  expect(screen.getByText('No reasoning summary is available.')).toBeVisible();
  await user.type(input, 'Updated example summary');
  expect(screen.getByRole('region', { name: 'Reasoning summary' })).toHaveTextContent(
    'Updated example summary',
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left summary' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left summary' }));
  await user.click(
    screen.getByRole('switch', { name: 'Automatic summary disclosure' }),
  );
  await user.click(screen.getByRole('switch', { name: 'Streaming summary' }));
  await user.click(screen.getByRole('switch', { name: 'Streaming summary' }));
  expect(screen.getByRole('button', { name: 'Reasoning summary' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await user.click(screen.getByRole('switch', { name: 'Protect summary disclosure' }));
  expect(screen.getByRole('button', { name: 'Reasoning summary' })).toBeDisabled();
});
