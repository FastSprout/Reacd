import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ChatAttachment, ReacdProvider } from '../../../index.js';

it('announces upload outside busy metadata while preserving protected removal', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatAttachment
        name="Pending reference"
        mediaType="text/plain"
        status="uploading"
        disabled
        onRemove={vi.fn()}
      />
    </ReacdProvider>,
  );
  const status = screen.getByRole('status');
  expect(status).toHaveTextContent('Uploading');
  expect(status.closest('[aria-busy="true"]')).toBeNull();
  expect(screen.getByText('Pending reference')).toHaveAttribute('aria-busy', 'true');
  expect(
    screen.getByRole('button', { name: 'Remove Pending reference' }),
  ).toBeDisabled();
});
