import { useState } from 'react';
import { fireEvent, render, screen, waitFor, within } from
  '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('uses native controlled cards, logical actions and SDK viewport focus', async () => {
  const press = vi.fn();
  const request = vi.fn();
  function Notice() {
    const [open, setOpen] = useState(true);
    return <NativeToastSurface><ShadcnToast title="Record saved"
      description="Ready for review" open={open} duration="persistent"
      onOpenChange={next => { request(next); setOpen(next); }}
      action={{ label: 'Undo', onPress: press }} /></NativeToastSurface>;
  }
  render(<Notice />);
  const card = await screen.findByRole('dialog', { name: 'Record saved' });
  expect(card).toHaveAccessibleDescription('Ready for review');
  expect(card).toHaveAttribute('data-radix-collection-item');
  const user = userEvent.setup();
  fireEvent.keyDown(document, { key: 'F6', code: 'F6' });
  const viewport = screen.getByRole('region', { name: 'Notifications' });
  expect(viewport).toHaveFocus();
  await user.keyboard('{Tab}');
  expect(card).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Undo' }));
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(request).toHaveBeenCalledExactlyOnceWith(false);
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('preserves vetoed cards and allows a later native dismissal request', async () => {
  const request = vi.fn<() => boolean | void>(() => false);
  const view = render(<NativeToastSurface><ShadcnToast title="Held" open
    onOpenChange={request} duration="persistent" priority="urgent" intent="danger" />
  </NativeToastSurface>);
  const card = await screen.findByRole('alertdialog', { name: 'Held' });
  await userEvent.click(within(card).getByRole('button', {
    name: 'Dismiss notification',
  }));
  expect(request).toHaveBeenCalledExactlyOnceWith(false);
  expect(within(card).getByRole('status')).toHaveTextContent('change was rejected');
  expect(card.style.transform).toBe('');
  expect(card.style.animation).toBe('');
  view.rerender(<NativeToastSurface><ShadcnToast title="Held" open={false}
    onOpenChange={request} /></NativeToastSurface>);
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
});
