import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiChatPrompt } from './chat-prompt.adapter.js';

it('renders actual SDK attachment metadata and identifier-only removal', async () => {
  const remove = vi.fn();
  const submit = vi.fn();
  const view = render(
    <MuiChatPrompt
      label="Message"
      value=""
      onValueChange={vi.fn()}
      onSubmit={submit}
      onRemoveAttachment={remove}
      attachments={[
        {
          id: 'image',
          name: 'diagram.png',
          mediaType: 'image/png',
          url: 'https://example.com/diagram.png',
          description: 'Architecture',
          status: 'idle',
        },
        {
          id: 'file',
          name: 'report.pdf',
          mediaType: 'application/pdf',
          removable: false,
        },
      ]}
    />,
  );
  expect(screen.getByRole('img', { name: 'diagram.png' })).toHaveAttribute(
    'src',
    'https://example.com/diagram.png',
  );
  expect(screen.getByText('Architecture')).toBeVisible();
  expect(screen.getByText('application/pdf')).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Remove report.pdf' })).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Remove diagram.png' }));
  expect(remove).toHaveBeenCalledExactlyOnceWith('image');
  await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith('');
  view.rerender(
    <MuiChatPrompt
      label="Message"
      value=" "
      onValueChange={vi.fn()}
      onSubmit={submit}
    />,
  );
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  fireEvent.keyDown(screen.getByRole('textbox', { name: 'Message' }), { key: 'Enter' });
  expect(submit).toHaveBeenCalledExactlyOnceWith('');
});

it.each(['uploading', 'error'] as const)(
  'keeps %s attachments visible while blocking send',
  (status) => {
    render(
      <MuiChatPrompt
        label="Message"
        value="Draft"
        onValueChange={vi.fn()}
        onSubmit={vi.fn()}
        attachments={[
          {
            id: 'a',
            name: 'report.pdf',
            mediaType: 'application/pdf',
            status,
          },
        ]}
      />,
    );
    expect(screen.getByRole(status === 'error' ? 'alert' : 'status')).toHaveTextContent(
      status === 'error' ? 'Upload failed' : 'Uploading',
    );
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  },
);
