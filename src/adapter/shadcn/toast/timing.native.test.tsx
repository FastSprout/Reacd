import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TOAST_DURATIONS } from '../../../core/toast-policy.js';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('preserves elapsed time and makes rejected native timeout persistent', async () => {
  vi.useFakeTimers();
  try {
    const old = vi.fn();
    const current = vi.fn(() => false);
    const content = (updated: boolean) => <NativeToastSurface>
      <ShadcnToast title={updated ? 'Latest' : 'Timed'} open
        onOpenChange={updated ? current : old} duration="normal" />
    </NativeToastSurface>;
    const view = render(content(false));
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.normal / 2));
    view.rerender(content(true));
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.normal / 2 + 1));
    const card = screen.getByRole('dialog', { name: 'Latest' });
    expect(current).toHaveBeenCalledExactlyOnceWith(false);
    expect(old).not.toHaveBeenCalled();
    expect(within(card).getByRole('status')).toHaveTextContent('change was rejected');
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long));
    expect(current).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(current).toHaveBeenCalledTimes(2);
    view.unmount();
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long));
    expect(current).toHaveBeenCalledTimes(2);
  } finally { vi.useRealTimers(); }
});

it('does not start a queued native timer until actual admission', async () => {
  vi.useFakeTimers();
  try {
    const close = vi.fn();
    const content = (first: boolean) => <NativeToastSurface>
      {first && <ShadcnToast title="First" open duration="persistent"
        onOpenChange={() => undefined} />}
      <ShadcnToast title="Second" open duration="persistent"
        onOpenChange={() => undefined} />
      <ShadcnToast title="Third" open duration="persistent"
        onOpenChange={() => undefined} />
      <ShadcnToast title="Queued" open duration="long" onOpenChange={close} />
    </NativeToastSurface>;
    const view = render(content(true));
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long + 1));
    expect(close).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog', { name: 'Queued' })).toBeNull();
    view.rerender(content(false));
    expect(screen.getByRole('dialog', { name: 'Queued' })).toBeVisible();
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long));
    expect(close).toHaveBeenCalledExactlyOnceWith(false);
  } finally { vi.useRealTimers(); }
});

it('does not forward a latent SDK timeout after an earlier manual veto', async () => {
  vi.useFakeTimers();
  try {
    const request = vi.fn(() => false);
    render(<NativeToastSurface><ShadcnToast title="Manual veto" open
      duration="normal" onOpenChange={request} /></NativeToastSurface>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(request).toHaveBeenCalledExactlyOnceWith(false);
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.normal + 1));
    expect(request).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: 'Manual veto' })).toBeVisible();
  } finally { vi.useRealTimers(); }
});
