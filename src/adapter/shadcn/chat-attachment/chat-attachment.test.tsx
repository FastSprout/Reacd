import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatAttachment } from './chat-attachment.adapter.js';

it('requests keyboard removal and protects disabled attachments', async () => {
  const remove = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnChatAttachment
      name="report.pdf"
      mediaType="application/pdf"
      onRemove={remove}
    />,
  );
  expect(screen.getByText('application/pdf')).toBeVisible();
  await user.tab();
  await user.keyboard('{Enter}');
  expect(remove).toHaveBeenCalledExactlyOnceWith();
  expect(screen.getByText('report.pdf')).toBeVisible();
  view.rerender(
    <ShadcnChatAttachment
      name="report.pdf"
      mediaType="application/pdf"
      onRemove={remove}
      disabled
      description="Project reference"
      status="uploading"
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Uploading');
  expect(screen.getByText('Project reference')).toBeVisible();
  const button = screen.getByRole('button', { name: 'Remove report.pdf' });
  expect(button).toBeDisabled();
  await user.click(button);
  expect(remove).toHaveBeenCalledOnce();
});

it('keeps the filename on image failure and retries a replacement URL', () => {
  const view = render(
    <ShadcnChatAttachment name="photo.png" mediaType="image/png" url="/photo.png" />,
  );
  expect(screen.getByRole('img', { name: 'photo.png' })).toHaveAttribute(
    'referrerpolicy',
    'no-referrer',
  );
  fireEvent.error(screen.getByRole('img'));
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('File')).toBeInTheDocument();
  expect(screen.getByText('photo.png')).toBeVisible();
  view.rerender(
    <ShadcnChatAttachment
      name="photo.png"
      mediaType="image/png"
      url="/replacement.png"
      status="error"
    />,
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', '/replacement.png');
  expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(<ShadcnChatAttachment name="photo.png" mediaType="image/png" />);
  expect(screen.queryByRole('img')).toBeNull();
});
