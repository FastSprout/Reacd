import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatAttachmentExample } from './chat-attachment.js';

it('runs documented attachment status, removal and protection controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ChatAttachmentExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('switch', { name: 'Uploading attachment' }));
  expect(screen.getByRole('status')).toHaveTextContent('Uploading');
  await user.click(screen.getByRole('switch', { name: 'Failed attachment' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  await user.click(screen.getByRole('switch', { name: 'Protect attachment' }));
  expect(
    screen.getByRole('button', { name: 'Remove example-reference.txt' }),
  ).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Protect attachment' }));
  await user.click(
    screen.getByRole('button', { name: 'Remove example-reference.txt' }),
  );
  expect(screen.getByText('Example attachment removed.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Restore attachment' }));
  expect(screen.getByText('example-reference.txt')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Preview image attachment' }));
  await user.type(
    screen.getByRole('textbox', { name: 'Attachment image URL' }),
    '/image.png',
  );
  expect(screen.getByRole('img', { name: 'example-reference.png' })).toHaveAttribute(
    'src',
    '/image.png',
  );
});
