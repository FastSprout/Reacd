import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedChatPromptSubmit } from './chat-prompt-submit.adapter.js';

it('rejects orphan send controls and exposes missing busy/error capabilities', () => {
  const view = render(<SharedChatPromptSubmit />);
  expect(screen.getByRole('alert')).toHaveTextContent('ChatPrompt scope');
  view.rerender(<SharedChatPromptSubmit status="submitted" />);
  expect(screen.getByRole('button', { name: 'Response in progress' })).toBeDisabled();
  view.rerender(<SharedChatPromptSubmit status="error" />);
  expect(screen.getByRole('button', { name: 'Retry unavailable' })).toBeDisabled();
});

it('invokes standalone capabilities without native event arguments', async () => {
  const user = userEvent.setup();
  const callback = vi.fn();
  render(<SharedChatPromptSubmit onSubmit={callback} />);
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(callback).toHaveBeenCalledExactlyOnceWith();
});
