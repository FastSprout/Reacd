import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatPaletteExample } from './chat-palette.js';

it('appends host-owned data while keeping the composer reachable', async () => {
  render(
    <ReacdProvider>
      <ChatPaletteExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Message' });
  await userEvent.type(input, 'Hello');
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(screen.getByRole('log')).toHaveTextContent('Hello');
  expect(input).toHaveValue('');
});
