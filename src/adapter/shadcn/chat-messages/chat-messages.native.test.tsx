import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatMessages } from './chat-messages.adapter.js';

it('uses the native SDK transcript scope and controlled recovery', async () => {
  const retry = vi.fn();
  const messages = [
    { id: 'one', author: 'Assistant', role: 'assistant' as const, content: 'First' },
  ];
  const view = render(
    <ShadcnChatMessages label="Conversation" messages={[]} status="submitted" />,
  );
  expect(screen.getByText('No messages yet.')).toBeVisible();
  expect(screen.getByRole('log', { name: 'Conversation' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(screen.getByRole('region', { name: 'Conversation' })).toHaveAttribute(
    'data-slot',
    'message-scroller-viewport',
  );
  expect(screen.getByRole('log')).toHaveAttribute(
    'data-slot',
    'message-scroller-content',
  );
  const jump = screen.getByRole('button', { name: 'Jump to latest message' });
  jump.focus();
  view.rerender(
    <ShadcnChatMessages label="Conversation" messages={messages} status="streaming" />,
  );
  await userEvent.click(jump);
  expect(jump).toHaveFocus();
  expect(screen.getByRole('article', { name: 'Assistant' })).toBeVisible();
  view.rerender(
    <ShadcnChatMessages
      label="Conversation"
      messages={messages}
      status="error"
      error="Connection lost"
      onRetry={retry}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(retry).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnChatMessages
      label="Conversation"
      messages={messages}
      followLatest={false}
      status="error"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('could not be completed');
  view.rerender(<ShadcnChatMessages label="Conversation" messages={messages} />);
  expect(screen.queryByRole('alert')).toBeNull();
});
