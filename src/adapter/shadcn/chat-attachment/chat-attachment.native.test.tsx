import { LAYOUT_POLICY } from '../../../core/policy.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnChatAttachment } from './chat-attachment.adapter.js';

it('uses native file slots, image fallback and guarded removal requests', async () => {
  const remove = vi.fn();
  const view = render(
    <ShadcnChatAttachment
      name="diagram.png"
      mediaType="image/png"
      url="/diagram.png"
      status="uploading"
      onRemove={remove}
    />,
  );
  expect(screen.getByRole('group', { name: 'diagram.png' })).toBeVisible();
  expect(screen.getByRole('status')).toHaveTextContent('Uploading');
  expect(screen.getByRole('img', { name: 'diagram.png' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Remove diagram.png' })).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  await userEvent.click(screen.getByRole('button', { name: 'Remove diagram.png' }));
  expect(remove).toHaveBeenCalledWith();
  view.rerender(
    <ShadcnChatAttachment
      name="report.pdf"
      mediaType="application/pdf"
      description="Report"
      status="error"
      onRemove={remove}
      disabled
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  fireEvent.click(screen.getByRole('button'));
  expect(remove).toHaveBeenCalledOnce();
  view.rerender(<ShadcnChatAttachment name="plain.txt" mediaType="text/plain" />);
  expect(screen.getByText('text/plain')).toBeVisible();
  expect(screen.queryByRole('button')).toBeNull();
});
