import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Typography from '@mui/material/Typography';
import { expect, it, vi } from 'vitest';
import { MuiModal } from './modal.adapter.js';
it('uses Material Dialog and value-only close requests', async () => {
  const change = vi.fn<(value: boolean) => void>();
  render(
    <MuiModal
      title="Edit record"
      description="Update details"
      open
      onOpenChange={change}
    >
      <Typography>Content</Typography>
    </MuiModal>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Edit record' });
  expect(dialog.className).toContain('MuiDialog-paper');
  expect(dialog).toHaveAccessibleDescription('Update details');
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(change).toHaveBeenCalledWith(false);
});
it('keeps outside dismissal locked and an explicit close available', async () => {
  const change = vi.fn<(value: boolean) => void>();
  render(
    <MuiModal
      title="Locked"
      description="Confirm"
      open
      dismissible={false}
      onOpenChange={change}
    />,
  );
  await userEvent.keyboard('{Escape}');
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(change).toHaveBeenCalledWith(false);
});

it('supports an explicit trigger and honors outside dismissal policy', async () => {
  const change = vi.fn<(value: boolean) => void>();
  const view = render(
    <MuiModal
      title="Record"
      description="Details"
      open={false}
      triggerLabel="Edit"
      onOpenChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  expect(change).toHaveBeenCalledWith(true);
  view.rerender(
    <MuiModal
      title="Record"
      description="Details"
      open
      triggerLabel="Edit"
      overlay={false}
      fullscreen
      retainContent
      onOpenChange={change}
    />,
  );
  await userEvent.keyboard('{Escape}');
  expect(change).toHaveBeenLastCalledWith(false);
});

it('throws explicitly for the unsupported truly nonmodal Dialog variant', () => {
  expect(() =>
    render(
      <MuiModal
        title="Record"
        description="Details"
        open
        modal={false}
        onOpenChange={() => undefined}
      />,
    ),
  ).toThrow('Adapter "material-ui" does not support component "Modal".');
});
