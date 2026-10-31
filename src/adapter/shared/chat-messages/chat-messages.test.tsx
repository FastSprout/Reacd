import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedChatMessages } from './chat-messages.adapter.js';

const first = {
  id: 'first',
  author: 'Assistant',
  role: 'assistant',
  content: 'First response',
} as const;

it('keeps content across empty, waiting, streaming and failed states', async () => {
  const retry = vi.fn();
  const user = userEvent.setup();
  const view = render(<SharedChatMessages label="Conversation" messages={[]} />);
  const log = screen.getByRole('log', { name: 'Conversation' });
  expect(log).toHaveAttribute('aria-live', 'polite');
  expect(log).toHaveAttribute('aria-atomic', 'false');
  expect(log).toHaveTextContent('No messages yet.');
  view.rerender(
    <SharedChatMessages
      label="Conversation"
      messages={[]}
      emptyLabel="Start a chat."
    />,
  );
  expect(log).toHaveTextContent('Start a chat.');
  for (const status of ['submitted', 'streaming'] as const) {
    view.rerender(
      <SharedChatMessages label="Conversation" messages={[first]} status={status} />,
    );
    expect(log).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(
      status === 'submitted' ? 'Waiting for a response.' : 'Receiving response.',
    );
    expect(log).toHaveTextContent('First response');
  }
  view.rerender(
    <SharedChatMessages label="Conversation" messages={[first]} status="error" />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent(
    'The response could not be completed.',
  );
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <SharedChatMessages
      label="Conversation"
      messages={[first]}
      status="error"
      error="Network unavailable."
      onRetry={retry}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable.');
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  expect(log).toHaveTextContent('First response');
});

it('suspends following while reading and resumes through the keyboard', async () => {
  const user = userEvent.setup();
  const view = render(<SharedChatMessages label="Conversation" messages={[first]} />);
  const log = screen.getByRole('log');
  Object.defineProperties(log, {
    scrollHeight: { configurable: true, value: 1000 },
    clientHeight: { configurable: true, value: 200 },
  });
  log.scrollTop = 100;
  fireEvent.scroll(log);
  expect(screen.getByRole('button', { name: 'Jump to latest message' })).toBeVisible();
  view.rerender(
    <SharedChatMessages
      label="Conversation"
      messages={[first, { ...first, id: 'second', content: 'Latest' }]}
      status="streaming"
    />,
  );
  expect(log.scrollTop).toBe(100);
  screen.getByRole('button', { name: 'Jump to latest message' }).focus();
  await user.keyboard('{Enter}');
  expect(log.scrollTop).toBe(1000);
  expect(screen.queryByRole('button', { name: 'Jump to latest message' })).toBeNull();
  log.scrollTop = 790;
  fireEvent.scroll(log);
  view.rerender(
    <SharedChatMessages label="Conversation" messages={[first]} status="ready" />,
  );
  expect(log.scrollTop).toBe(1000);
  log.scrollTop = 0;
  fireEvent.scroll(log);
  view.rerender(
    <SharedChatMessages label="Conversation" messages={[first]} followLatest={false} />,
  );
  fireEvent.scroll(log);
  expect(log.scrollTop).toBe(0);
  expect(screen.queryByRole('button', { name: 'Jump to latest message' })).toBeNull();
});
