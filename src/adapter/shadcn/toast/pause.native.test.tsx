import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TOAST_DURATIONS } from '../../../core/toast-policy.js';
import { NativeToastSurface } from './provider.js';
import { ShadcnToast } from './toast.adapter.js';

it('uses native pointer, focus and window events to pause its clock', async () => {
  vi.useFakeTimers();
  try {
    const request = vi.fn();
    render(<NativeToastSurface><ShadcnToast title="Paused" open
      duration="normal" onOpenChange={request} /></NativeToastSurface>);
    const card = screen.getByRole('dialog', { name: 'Paused' });
    const viewport = screen.getByRole('region', { name: 'Notifications' });
    const branch = screen.getByRole('region', { name: 'Notification navigation' });
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.normal / 2));
    fireEvent.pointerMove(card, { pointerType: 'mouse' });
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long));
    expect(request).not.toHaveBeenCalled();
    fireEvent.pointerLeave(branch);
    fireEvent.focusIn(card);
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long));
    expect(request).not.toHaveBeenCalled();
    fireEvent.focusOut(card, { relatedTarget: document.body });
    fireEvent.blur(window);
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.long));
    expect(request).not.toHaveBeenCalled();
    fireEvent.focus(window);
    await act(() => vi.advanceTimersByTimeAsync(TOAST_DURATIONS.normal / 2 + 1));
    expect(request).toHaveBeenCalledExactlyOnceWith(false);
    expect(viewport).toBeVisible();
  } finally { vi.useRealTimers(); }
});
