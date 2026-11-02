import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnAlert } from './alert.adapter.js';

it('uses SDK alert variants, action buttons and controlled dismissal', async () => {
  const close = vi.fn();
  const action = vi.fn();
  const view = render(
    <ShadcnAlert
      intent="error"
      title="Network"
      message="Try again"
      open
      onOpenChange={close}
      closeLabel="Dismiss"
      actions={[{ id: 'retry', label: 'Retry', onPress: action }]}
    />,
  );
  expect(screen.getByRole('alert').className).toContain('border-destructive');
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(action).toHaveBeenCalledWith();
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  expect(close).toHaveBeenCalledWith(false);
  view.rerender(<ShadcnAlert intent="info" title="Ready" message="Available" />);
  expect(screen.getByRole('status')).toHaveTextContent('Available');
  view.rerender(
    <ShadcnAlert intent="info" title="Ready" message="Available" open={false} />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

it('maps passive severity and named dismissal without native events', async () => {
  const close = vi.fn();
  const view = render(
    <ShadcnAlert
      title="Ready"
      message="Saved"
      intent="success"
      open
      onOpenChange={close}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss Ready' }));
  expect(close).toHaveBeenCalledExactlyOnceWith(false);
  view.rerender(<ShadcnAlert title="Review" message="Check" intent="warning" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Check');
});
