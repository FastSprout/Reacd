import { useContext, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PromptScopeContext } from '../../../renderer/chat-prompt/prompt-context.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { MuiChatPrompt } from './chat-prompt.adapter.js';

it(
  'uses native multiline editing and precise Enter, modifier, IME and close intents',
  async () => {
  const submit = vi.fn(() => false);
  const close = vi.fn();
  function Example({ enter = true }: { enter?: boolean }) {
    const [value, change] = useState('Draft');
    return (
      <MuiChatPrompt
        label="Message"
        value={value}
        onValueChange={change}
        onSubmit={submit}
        onClose={close}
        submitOnEnter={enter}
        placeholder="Write a message"
        description="Enter sends"
      />
    );
  }
  const view = render(<Example />);
  const input = screen.getByRole('textbox', { name: 'Message' });
  expect(input.tagName).toBe('TEXTAREA');
  await userEvent.type(input, '{Shift>}{Enter}{/Shift}second');
  expect(input).toHaveValue('Draft\nsecond');
  expect(submit).not.toHaveBeenCalled();
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
  fireEvent.keyDown(input, { key: 'Enter', altKey: true });
  expect(submit).not.toHaveBeenCalled();
  await userEvent.keyboard('{Enter}');
  expect(submit).toHaveBeenCalledExactlyOnceWith('Draft\nsecond');
  expect(input).toHaveValue('Draft\nsecond');
  await userEvent.keyboard('{Escape}');
  expect(close).toHaveBeenCalledExactlyOnceWith();
  view.rerender(<Example enter={false} />);
  await userEvent.keyboard('{Enter}');
  expect(submit).toHaveBeenCalledTimes(1);
  await userEvent.keyboard('{Control>}{Enter}{/Control}');
  expect(submit).toHaveBeenCalledTimes(2);
  await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
  expect(submit).toHaveBeenCalledTimes(3);
  expect(screen.getByRole('form', { name: 'Message' })).toBeVisible();
});

it(
  'keeps controlled edits and request vetoes without invented local state',
  async () => {
  const change = vi.fn(() => false);
  const submit = vi.fn(() => false);
  render(
    <MuiChatPrompt
      label="Message"
      value="Kept"
      onValueChange={change}
      onSubmit={submit}
    />,
  );
  const input = screen.getByRole('textbox', { name: 'Message' });
  await userEvent.type(input, '!');
  expect(change).toHaveBeenCalledExactlyOnceWith('Kept!');
  expect(input).toHaveValue('Kept');
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith('Kept');
  expect(input).toHaveValue('Kept');
  fireEvent.keyDown(input, { key: 'Escape' });
});

it.each(['submitted', 'streaming', 'error'] as const)(
  'exposes only the explicit %s request capability',
  async (status) => {
    const stop = vi.fn();
    const retry = vi.fn();
    const view = render(
      <MuiChatPrompt
        label="Message"
        value="Draft"
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        status={status}
      />,
    );
    expect(
      screen.getByRole('button', {
        name: status === 'error' ? 'Retry unavailable' : 'Response in progress',
      }),
    ).toBeDisabled();
    if (status === 'error') {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'The response could not be completed.',
      );
    } else
      expect(screen.getByRole('status')).toHaveTextContent(
        status === 'submitted' ? 'Waiting for a response.' : 'Receiving response.',
      );
    view.rerender(
      <MuiChatPrompt
        label="Message"
        value="Draft"
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        status={status}
        error="Request failed"
        onStop={stop}
        onRetry={retry}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: status === 'error' ? 'Retry response' : 'Stop response',
      }),
    );
    expect(status === 'error' ? retry : stop).toHaveBeenCalledExactlyOnceWith();
  },
);

it.each(['disabled', 'readOnly', 'pending'] as const)(
  'protects all %s editing and requests',
  async (reason) => {
    const action = vi.fn();
    render(
      <FormPendingContext value={reason === 'pending'}>
        <MuiChatPrompt
          label="Message"
          value="Draft"
          onValueChange={action}
          onSubmit={action}
          onClose={action}
          onStop={action}
          status="streaming"
          disabled={reason === 'disabled'}
          readOnly={reason === 'readOnly'}
          onRemoveAttachment={action}
          attachments={[
            {
              id: 'a',
              name: 'report.pdf',
              mediaType: 'application/pdf',
            },
          ]}
        />
      </FormPendingContext>,
    );
    const input = screen.getByRole('textbox', { name: 'Message' });
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.keyDown(input, { key: 'Escape' });
    const stop = screen.getByRole('button', { name: 'Stop response' });
    const remove = screen.getByRole('button', { name: 'Remove report.pdf' });
    expect(stop).toBeDisabled();
    expect(remove).toBeDisabled();
    fireEvent.click(stop);
    fireEvent.click(remove);
    expect(action).not.toHaveBeenCalled();
    expect(input).toHaveValue('Draft');
  },
);

it('provides canonical prompt metadata to a custom footer', () => {
  function Footer() {
    const scope = useContext(PromptScopeContext);
    return <span>{scope?.canSend ? 'Ready footer' : 'Blocked footer'}</span>;
  }
  render(
    <MuiChatPrompt
      label="Message"
      value="Draft"
      onValueChange={vi.fn()}
      onSubmit={vi.fn()}
      footer={<Footer />}
    />,
  );
  expect(screen.getByText('Ready footer')).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Send message' })).toBeNull();
});
