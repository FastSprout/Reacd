import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedChatPrompt } from './chat-prompt.adapter.js';

it('sends one string through every submission path', async () => {
  const submit = vi.fn();
  const change = vi.fn();
  const user = userEvent.setup();
  render(
    <SharedChatPrompt
      label="Message"
      value="  Keep this draft  "
      onSubmit={submit}
      onValueChange={change}
      description="Write a message"
    />,
  );
  const draft = screen.getByRole('textbox', { name: 'Message' });
  expect(draft).toHaveAccessibleDescription('Write a message');
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith('  Keep this draft  ');
  expect(draft).toHaveValue('  Keep this draft  ');
  submit.mockClear();
  fireEvent.keyDown(draft, { key: 'Enter' });
  expect(submit).toHaveBeenCalledExactlyOnceWith('  Keep this draft  ');
  submit.mockClear();
  const form = draft.closest('form');
  expect(form).not.toBeNull();
  if (form === null) throw new Error('Prompt must own a form.');
  fireEvent.submit(form);
  expect(submit).toHaveBeenCalledExactlyOnceWith('  Keep this draft  ');
  fireEvent.change(draft, { target: { value: 'Edited' } });
  expect(change).toHaveBeenCalledExactlyOnceWith('Edited');
});

it('preserves newline and IME and blocks unsafe send states', () => {
  const submit = vi.fn();
  const change = vi.fn();
  const view = render(
    <SharedChatPrompt
      label="Message"
      value="Draft"
      onSubmit={submit}
      onValueChange={change}
      submitOnEnter={false}
    />,
  );
  const draft = screen.getByRole('textbox', { name: 'Message' });
  fireEvent.keyDown(draft, { key: 'Enter' });
  fireEvent.keyDown(draft, { key: 'Enter', shiftKey: true });
  fireEvent.keyDown(draft, { key: 'Enter', altKey: true });
  fireEvent.keyDown(draft, { key: 'a' });
  fireEvent.compositionStart(draft);
  fireEvent.keyDown(draft, { key: 'Enter', ctrlKey: true });
  fireEvent.compositionEnd(draft);
  fireEvent.keyDown(draft, { key: 'Enter', keyCode: 229, ctrlKey: true });
  expect(submit).not.toHaveBeenCalled();
  fireEvent.keyDown(draft, { key: 'Enter', metaKey: true });
  expect(submit).toHaveBeenCalledExactlyOnceWith('Draft');
  for (const props of [
    { value: ' ' },
    { status: 'submitted' },
    { status: 'streaming' },
    { status: 'error' },
    { disabled: true },
    { readOnly: true },
  ] as const) {
    submit.mockClear();
    view.rerender(
      <SharedChatPrompt
        label="Message"
        value="Draft"
        onSubmit={submit}
        onValueChange={change}
        {...props}
      />,
    );
    fireEvent.keyDown(draft, { key: 'Enter' });
    const form = draft.closest('form');
    if (form === null) throw new Error('Prompt must own a form.');
    fireEvent.submit(form);
    expect(submit).not.toHaveBeenCalled();
  }
  fireEvent.change(draft, { target: { value: 'No mutation' } });
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
});

it('protects file requests and status actions', async () => {
  const user = userEvent.setup();
  const submit = vi.fn();
  const remove = vi.fn();
  const stop = vi.fn();
  const retry = vi.fn();
  const attachment = { id: 'file', name: 'Report', mediaType: 'text/plain' };
  const properties = {
    label: 'Message',
    value: '',
    onValueChange: vi.fn(),
    onSubmit: submit,
    onRemoveAttachment: remove,
    attachments: [attachment],
  };
  const view = render(<SharedChatPrompt {...properties} />);
  await user.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith('');
  await user.click(screen.getByRole('button', { name: 'Remove Report' }));
  expect(remove).toHaveBeenCalledExactlyOnceWith('file');
  for (const status of ['uploading', 'error'] as const) {
    view.rerender(
      <SharedChatPrompt {...properties} attachments={[{ ...attachment, status }]} />,
    );
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  }
  view.rerender(<SharedChatPrompt {...properties} readOnly />);
  expect(screen.getByRole('button', { name: 'Remove Report' })).toBeDisabled();
  view.rerender(<SharedChatPrompt {...properties} status="streaming" onStop={stop} />);
  expect(screen.getByRole('status')).toHaveTextContent('Response in progress');
  await user.click(screen.getByRole('button', { name: 'Stop response' }));
  expect(stop).toHaveBeenCalledExactlyOnceWith();
  view.rerender(
    <SharedChatPrompt
      {...properties}
      status="error"
      onRetry={retry}
      error="Server unavailable"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Server unavailable');
  await user.click(screen.getByRole('button', { name: 'Retry response' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith();
});
