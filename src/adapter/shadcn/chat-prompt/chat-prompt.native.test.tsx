import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { FormScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/form-scope.js';
import { ShadcnChatPrompt } from './chat-prompt.adapter.js';

it('bridges editing and key intents without clearing host data', async () => {
  const change = vi.fn();
  const submit = vi.fn();
  const close = vi.fn();
  const remove = vi.fn();
  const view = render(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      onValueChange={change}
      onSubmit={submit}
      onClose={close}
      description="Compose a request"
      placeholder="Write here"
    />,
  );
  const draft = screen.getByRole('textbox', { name: 'Message' });
  fireEvent.change(draft, { target: { value: 'Updated' } });
  expect(change).toHaveBeenCalledWith('Updated');
  fireEvent.keyDown(draft, { key: 'Enter', shiftKey: true });
  fireEvent.keyDown(draft, { key: 'Enter', isComposing: true });
  expect(submit).not.toHaveBeenCalled();
  fireEvent.keyDown(draft, { key: 'Enter' });
  expect(submit).toHaveBeenCalledWith('Hello');
  expect(draft).toHaveValue('Hello');
  fireEvent.keyDown(draft, { key: 'Escape' });
  expect(close).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      submitOnEnter={false}
      onValueChange={change}
      onSubmit={submit}
      attachments={[{ id: 'file', name: 'Report', mediaType: 'text/plain' }]}
      onRemoveAttachment={remove}
    />,
  );
  fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
  expect(submit).toHaveBeenCalledOnce();
  fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', ctrlKey: true });
  expect(submit).toHaveBeenCalledTimes(2);
  await userEvent.click(screen.getByRole('button', { name: 'Remove Report' }));
  expect(remove).toHaveBeenCalledWith('file');
  view.rerender(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      readOnly
      onValueChange={change}
      onSubmit={submit}
      onClose={close}
    />,
  );
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Ignored' } });
  fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' });
  expect(change).toHaveBeenCalledOnce();
  expect(close).toHaveBeenCalledOnce();
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
});

it('keeps pending/error and failed attachment gates outside busy content', async () => {
  const submit = vi.fn();
  const view = render(
    <ShadcnChatPrompt
      label="Message"
      value=""
      onValueChange={vi.fn()}
      onSubmit={submit}
      status="streaming"
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Receiving response');
  expect(screen.getByRole('button', { name: 'Response in progress' })).toBeDisabled();
  view.rerender(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      onValueChange={vi.fn()}
      onSubmit={submit}
      status="error"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('could not be completed');
  view.rerender(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      onValueChange={vi.fn()}
      onSubmit={submit}
      status="submitted"
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Waiting for a response');
  view.rerender(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      onValueChange={vi.fn()}
      onSubmit={submit}
      error="Upload failed"
      attachments={[
        {
          id: 'bad',
          name: 'Failed',
          mediaType: 'text/plain',
          status: 'error',
          removable: false,
        },
      ]}
      footer="Custom footer"
    />,
  );
  expect(screen.getByText('Custom footer')).toBeVisible();
  expect(screen.queryByRole('button')).toBeNull();
  fireEvent.submit(screen.getByRole('form'));
  expect(submit).not.toHaveBeenCalled();
  expect(() =>
    render(
      <FormScopeContext value={true}>
        <ShadcnChatPrompt
          label="Nested"
          value=""
          onValueChange={vi.fn()}
          onSubmit={vi.fn()}
        />
      </FormScopeContext>,
    ),
  ).toThrow('Forms cannot be nested');
  view.rerender(
    <ShadcnChatPrompt
      label="Message"
      value="Hello"
      onValueChange={vi.fn()}
      onSubmit={submit}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledWith('Hello');
});
