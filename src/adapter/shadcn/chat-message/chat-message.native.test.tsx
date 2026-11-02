import { LAYOUT_POLICY } from '../../../core/policy.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatMessage } from './chat-message.adapter.js';

it('keeps native identity, escaped text, attachment and action data', async () => {
  const action = vi.fn();
  const view = render(
    <ShadcnChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content={'<script>payload</script>\nSecond line'}
      actions={[{ id: 'copy', label: 'Copy', onPress: action }]}
    />,
  );
  expect(screen.getByRole('article', { name: 'Assistant' })).toBeVisible();
  expect(view.container.querySelector('script')).toBeNull();
  expect(screen.getByRole('button', { name: 'Copy' })).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
  expect(action).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content="Partial"
      status="streaming"
      attachments={[
        { name: 'report.txt', mediaType: 'text/plain', status: 'uploading' },
      ]}
      actions={[{ id: 'copy', label: 'Copy', onPress: action, disabled: true }]}
    />,
  );
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.getByText('Partial')).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('button')).toBeDisabled();
  view.rerender(
    <ShadcnChatMessage
      id="reply"
      author="Assistant"
      role="assistant"
      content="Partial"
      status="error"
      error="Failed response"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Failed response');
  view.rerender(
    <ShadcnChatMessage
      id="reply"
      author="Assistant"
      role="tool"
      content="Partial"
      status="error"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('could not be completed');
});

it('uses the native user alignment and bubble variant', () => {
  render(
    <ShadcnChatMessage
      id="request"
      author="You"
      role="user"
      content="Review this change."
    />,
  );
  const message = screen.getByRole('article', { name: 'You' });
  expect(message).toHaveAttribute('data-align', 'end');
  expect(message.querySelector('[data-slot="bubble"]')).toHaveAttribute(
    'data-variant',
    'default',
  );
  expect(screen.getByText('Review this change.')).toBeVisible();
});
