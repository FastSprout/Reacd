import { LAYOUT_POLICY } from '../../../core/policy.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PromptScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/chat-prompt/prompt-context.js';
import { ShadcnChatPromptSubmit } from './chat-prompt-submit.adapter.js';

it('uses native buttons for standalone and inherited actions', async () => {
  const submit = vi.fn();
  const stop = vi.fn();
  const retry = vi.fn();
  const view = render(<ShadcnChatPromptSubmit onSubmit={submit} />);
  expect(screen.getByRole('button', { name: 'Send message' })).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledWith();
  view.rerender(<ShadcnChatPromptSubmit status="submitted" />);
  expect(screen.getByRole('button', { name: 'Response in progress' })).toBeDisabled();
  view.rerender(<ShadcnChatPromptSubmit status="streaming" onStop={stop} />);
  await userEvent.click(screen.getByRole('button', { name: 'Stop response' }));
  expect(stop).toHaveBeenCalledWith();
  view.rerender(<ShadcnChatPromptSubmit status="error" />);
  expect(screen.getByRole('button', { name: 'Retry unavailable' })).toBeDisabled();
  view.rerender(<ShadcnChatPromptSubmit status="error" onRetry={retry} />);
  await userEvent.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(retry).toHaveBeenCalledWith();
  view.rerender(
    <PromptScopeContext
      value={{ status: 'ready', disabled: false, canSend: false, submit, stop, retry }}
    >
      <ShadcnChatPromptSubmit label="Send now" />
    </PromptScopeContext>,
  );
  expect(screen.getByRole('button', { name: 'Send now' })).toBeDisabled();
  view.rerender(
    <PromptScopeContext
      value={{ status: 'ready', disabled: false, canSend: true, submit, stop, retry }}
    >
      <ShadcnChatPromptSubmit />
    </PromptScopeContext>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledTimes(2);
});

it('fails closed for missing scope and conflicting inherited capabilities', () => {
  expect(() => render(<ShadcnChatPromptSubmit />)).toThrow('needs a ChatPrompt');
  const scope = {
    status: 'ready',
    disabled: false,
    canSend: true,
    submit: vi.fn(),
    stop: undefined,
    retry: undefined,
  } as const;
  for (const overrides of [
    { status: 'ready' as const },
    { onSubmit: vi.fn() },
    { onStop: vi.fn() },
    { onRetry: vi.fn() },
  ]) {
    expect(() =>
      render(
        <PromptScopeContext value={scope}>
          <ShadcnChatPromptSubmit {...overrides} />
        </PromptScopeContext>,
      ),
    ).toThrow('cannot override');
  }
});
