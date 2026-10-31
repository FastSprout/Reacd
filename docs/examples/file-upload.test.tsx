import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { FileUploadExample } from './file-upload.js';
it('runs documented file payload, protection, rejection and form flows', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <FileUploadExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('No content yet.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Save files' }));
  expect(screen.getByRole('alert')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Restore sample file' }));
  expect(screen.getByText(/: 5 bytes/)).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Reject file changes' }));
  await user.click(screen.getByRole('button', { name: /Remove Saved-document/ }));
  expect(screen.getByText(/: 5 bytes/)).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Read-only files' }));
  await user.click(screen.getByRole('switch', { name: 'Disable files' }));
  const form = screen.getByRole('form', { name: 'Files form' });
  expect(form).toBeInstanceOf(HTMLFormElement);
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form');
  expect(new FormData(form).has('attachments')).toBe(false);
  await user.click(screen.getByRole('switch', { name: 'Disable files' }));
  expect(new FormData(form).get('attachments')).toContain('SGVsbG8=');
  await user.click(screen.getByRole('switch', { name: 'Read-only files' }));
  await user.click(screen.getByRole('switch', { name: 'Reject file changes' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left files' }));
  await user.upload(
    screen.getByLabelText('Attachments', { selector: 'input' }),
    new File(['x'], 'local.txt', { lastModified: 0 }),
  );
  await waitFor(() => expect(screen.getByText(/local.txt: 1 bytes/)).toBeVisible());
  await user.click(screen.getByRole('button', { name: 'Save files' }));
  expect(screen.getByText('Files saved.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear files' }));
  expect(screen.getByText('No content yet.')).toBeVisible();
});
