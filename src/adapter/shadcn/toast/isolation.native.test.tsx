import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { TOAST_DURATIONS } from '../../../core/toast-policy.js';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('keeps native Escape and viewport focus inside the focused Surface', async () => {
  const first = vi.fn(() => false);
  const second = vi.fn();
  render(<>
    <NativeToastSurface><ShadcnToast title="First owner" open
      duration="persistent" onOpenChange={first} /></NativeToastSurface>
    <NativeToastSurface><ShadcnToast title="Second owner" open
      duration="persistent" onOpenChange={second} /></NativeToastSurface>
  </>);
  const card = screen.getByRole('dialog', { name: 'First owner' });
  const [viewport] = screen.getAllByRole('region', { name: 'Notifications' });
  const user = userEvent.setup();
  card.focus();
  await user.keyboard('{Escape}');
  expect(first).toHaveBeenCalledExactlyOnceWith(false);
  expect(second).not.toHaveBeenCalled();
  expect(viewport).toHaveFocus();
  await user.keyboard('{Tab}');
  expect(card).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(first).toHaveBeenCalledTimes(2);
  expect(second).not.toHaveBeenCalled();
  expect(card).toBeVisible();
  expect(viewport).toHaveFocus();
});

it('does not retain another Root Escape as a manual retry of its earlier veto',
  async () => {
    vi.useFakeTimers();
    try {
      const older = vi.fn();
      const held = vi.fn(() => false);
      render(<NativeToastSurface>
        <ShadcnToast title="Older" open duration="persistent"
          onOpenChange={older} />
        <ShadcnToast title="Held later" open duration="normal"
          onOpenChange={held} />
      </NativeToastSurface>);
      const card = screen.getByRole('dialog', { name: 'Held later' });
      fireEvent.click(within(card).getByRole('button', {
        name: 'Dismiss notification',
      }));
      expect(held).toHaveBeenCalledTimes(1);
      fireEvent.keyDown(screen.getByRole('dialog', { name: 'Older' }), {
        key: 'Escape', code: 'Escape',
      });
      expect(older).toHaveBeenCalledExactlyOnceWith(false);
      await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.normal + 1));
      expect(held).toHaveBeenCalledTimes(1);
    } finally { vi.useRealTimers(); }
  },
);

it('preserves native viewport Escape and repeated owned rejection', async () => {
  const first = vi.fn();
  const latest = vi.fn(() => false);
  render(<NativeToastSurface>
    <ShadcnToast title="Earlier" open duration="persistent" onOpenChange={first} />
    <ShadcnToast title="Later" open duration="persistent" onOpenChange={latest} />
  </NativeToastSurface>);
  const viewport = screen.getByRole('region', { name: 'Notifications' });
  fireEvent.keyDown(document, { key: 'F6', code: 'F6' });
  expect(viewport).toHaveFocus();
  await userEvent.keyboard('{Escape}{Escape}');
  expect(latest).toHaveBeenCalledTimes(2);
  expect(first).not.toHaveBeenCalled();
  expect(viewport).toHaveFocus();
});

it('never lets a foreign viewport Escape dismiss this provider', async () => {
  const first = vi.fn();
  const second = vi.fn();
  render(<>
    <NativeToastSurface><ShadcnToast title="Owner A" open
      duration="persistent" onOpenChange={first} /></NativeToastSurface>
    <NativeToastSurface><ShadcnToast title="Owner B" open
      duration="persistent" onOpenChange={second} /></NativeToastSurface>
  </>);
  const [viewport] = screen.getAllByRole('region', { name: 'Notifications' });
  viewport?.focus();
  const user = userEvent.setup();
  await user.keyboard('{Escape}');
  expect(second).not.toHaveBeenCalled();
  await user.keyboard('{Tab}');
  expect(screen.getByRole('dialog', { name: 'Owner A' })).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(first).toHaveBeenCalledExactlyOnceWith(false);
  expect(second).not.toHaveBeenCalled();
});
