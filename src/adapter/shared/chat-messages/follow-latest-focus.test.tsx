import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from '../../../../test-support/shared-adapter-server.js';
import { expect, it, vi } from 'vitest';
import { SharedChatMessages } from './chat-messages.adapter.js';
import type { ChatMessagesProps } from
  '../../../components/chat-messages/chat-messages.props.js';

const FIRST = Object.freeze({
  id: 'first',
  author: 'Assistant',
  role: 'assistant',
  content: 'First response',
} as const);
const MESSAGES = Object.freeze([FIRST]);
const SCROLL_HEIGHT = 1000;
const VIEW_HEIGHT = 200;
const HISTORY_POSITION = 100;

function history(log: HTMLElement) {
  Object.defineProperties(log, {
    scrollHeight: { configurable: true, value: SCROLL_HEIGHT },
    clientHeight: { configurable: true, value: VIEW_HEIGHT },
  });
  log.scrollTop = HISTORY_POSITION;
  fireEvent.scroll(log);
}

it.each(['keyboard', 'pointer'] as const)(
  'retains a meaningful target after an explicit %s jump',
  async (activation) => {
    const user = userEvent.setup();
    render(
      <SharedChatMessages
        label="Conversation"
        messages={MESSAGES}
        status="streaming"
      />,
    );
    const log = screen.getByRole('log', { name: 'Conversation' });
    history(log);
    expect(log).toHaveAttribute('aria-busy', 'true');
    const jump = screen.getByRole('button', { name: 'Jump to latest message' });
    const focus = vi.spyOn(log, 'focus');
    if (activation === 'keyboard') {
      jump.focus();
      await user.keyboard('{Enter}');
    } else await user.click(jump);
    expect(log.scrollTop).toBe(SCROLL_HEIGHT);
    expect(screen.queryByRole('button', { name: 'Jump to latest message' })).toBeNull();
    expect(log).toHaveFocus();
    expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
    expect(MESSAGES).toEqual([FIRST]);
    expect(FIRST.content).toBe('First response');
  },
);

it('leaves outside focus untouched during passive following and new messages', () => {
  function scene(messages: ChatMessagesProps['messages'], enabled = true) {
    return (
      <>
        <button type="button">Outside transcript</button>
        <SharedChatMessages
          label="Conversation"
          messages={messages}
          status="submitted"
          followLatest={enabled}
        />
      </>
    );
  }
  const view = render(scene(MESSAGES));
  const outside = screen.getByRole('button', { name: 'Outside transcript' });
  const log = screen.getByRole('log');
  Object.defineProperties(log, {
    scrollHeight: { configurable: true, value: SCROLL_HEIGHT },
    clientHeight: { configurable: true, value: VIEW_HEIGHT },
  });
  outside.focus();
  const focus = vi.spyOn(log, 'focus');
  const next = Object.freeze([
    ...MESSAGES,
    Object.freeze({ ...FIRST, id: 'second', content: 'Second response' }),
  ]);
  view.rerender(scene(next));
  expect(log.scrollTop).toBe(SCROLL_HEIGHT);
  expect(log).toHaveTextContent('Second response');
  expect(outside).toHaveFocus();
  expect(focus).not.toHaveBeenCalled();
  history(log);
  view.rerender(scene([...next, { ...FIRST, id: 'third', content: 'Third response' }]));
  expect(log.scrollTop).toBe(HISTORY_POSITION);
  expect(log).toHaveTextContent('Third response');
  expect(outside).toHaveFocus();
  view.rerender(scene([...MESSAGES], false));
  expect(screen.queryByRole('button', { name: 'Jump to latest message' })).toBeNull();
  expect(outside).toHaveFocus();
  expect(focus).not.toHaveBeenCalled();
});

it('renders an SSR transcript without touching a native focus target', () => {
  const focus = vi.spyOn(HTMLElement.prototype, 'focus');
  const markup = renderToString(
    <SharedChatMessages label="Server conversation" messages={MESSAGES} />,
  );
  expect(markup).toContain('First response');
  expect(focus).not.toHaveBeenCalled();
  focus.mockRestore();
});
