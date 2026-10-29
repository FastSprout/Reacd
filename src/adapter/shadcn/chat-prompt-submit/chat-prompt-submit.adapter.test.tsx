import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatPromptSubmit } from './chat-prompt-submit.adapter.js';

it('rejects orphan send controls and exposes missing busy/error capabilities', () => {
  const view = render(<ShadcnChatPromptSubmit />);
  expect(screen.getByRole('alert')).toHaveTextContent('ChatPrompt scope');
  view.rerender(<ShadcnChatPromptSubmit status="submitted" />);
  expect(screen.getByRole('button', { name: 'Response in progress' })).toBeDisabled();
  view.rerender(<ShadcnChatPromptSubmit status="error" />);
  expect(screen.getByRole('button', { name: 'Retry unavailable' })).toBeDisabled();
});

it('invokes standalone capabilities without native event arguments', async () => {
  const user = userEvent.setup();
  const callback = vi.fn();
  render(<ShadcnChatPromptSubmit onSubmit={callback} />);
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(callback).toHaveBeenCalledExactlyOnceWith();
});
