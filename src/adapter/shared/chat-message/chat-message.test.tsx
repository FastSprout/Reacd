import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedChatMessage } from './chat-message.adapter.js';

it('escapes message content and preserves streaming message identity', () => {
  const content = '<script>window.executed = true</script>\nNext line';
  const view = render(
    <SharedChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content={content}
    />,
  );
  const article = screen.getByRole('article', { name: 'Assistant' });
  expect(article).toHaveAttribute('data-message-id', 'reply');
  expect(article.querySelector('script')).toBeNull();
  expect(article).toHaveTextContent(content.replace('\n', ' '));
  expect(article).not.toHaveAttribute('aria-busy');
  expect(article.querySelector('.reacd-chat-message-text')).toHaveAttribute(
    'aria-busy',
    'false',
  );
  view.rerender(
    <SharedChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content="Partial response"
      status="streaming"
      attachments={[{ name: 'reference.pdf', mediaType: 'application/pdf' }]}
    />,
  );
  expect(screen.getByRole('article')).toBe(article);
  expect(screen.getByText('Partial response')).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('Receiving response.');
  expect(screen.getByRole('list', { name: 'Message attachments' })).toHaveTextContent(
    'reference.pdf',
  );
  view.rerender(
    <SharedChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content="Partial response"
      status="error"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent(
    'The response could not be completed.',
  );
  view.rerender(
    <SharedChatMessage
      id="reply"
      author="Tool"
      role="tool"
      content=""
      status="error"
      error="Permission denied."
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Permission denied.');
});

it('preserves content when the host rejects a labelled action', async () => {
  const user = userEvent.setup();
  const retry = vi.fn();
  render(
    <SharedChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content="Original response"
      actions={[
        { id: 'retry', label: 'Regenerate answer', onPress: retry },
        { id: 'save', label: 'Save answer', onPress: retry, disabled: true },
      ]}
    />,
  );
  await user.tab();
  await user.keyboard(' ');
  expect(retry).toHaveBeenCalledExactlyOnceWith();
  expect(screen.getByText('Original response')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Save answer' }));
  expect(retry).toHaveBeenCalledOnce();
  expect(screen.getByRole('group', { name: 'Message actions' })).toBeVisible();
});
