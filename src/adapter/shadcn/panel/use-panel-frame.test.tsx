import { act, renderHook } from '@testing-library/react';
import type { Drawer } from '@base-ui/react/drawer';
import { describe, expect, it, vi } from 'vitest';
import { usePanelFrame } from './use-panel-frame.js';

function swipeDetails(): Drawer.Root.ChangeEventDetails {
  return {
    reason: 'swipe',
    event: new PointerEvent('pointerup'),
    cancel: vi.fn(),
    allowPropagation: vi.fn(),
    isCanceled: false,
    isPropagationAllowed: false,
    trigger: undefined,
    preventUnmountOnClose: vi.fn(),
  };
}

describe('edge panel interaction policy', () => {
  it('dismisses its registered child layer before forwarding Escape', () => {
    const change = vi.fn();
    const child = vi.fn();
    const view = renderHook(() => usePanelFrame({ open: true, onOpenChange: change }));
    const release = view.result.current.escapeScope.register(child);
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    const cancel = vi.fn();
    act(() =>
      view.result.current.change(false, {
        ...swipeDetails(),
        reason: 'escape-key',
        event,
        cancel,
      }),
    );
    expect(child).toHaveBeenCalledOnce();
    expect(change).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
    expect(cancel).toHaveBeenCalledOnce();
    release();
  });
  it('rejects swipe dismissal when locked and accepts explicit close requests', () => {
    const change = vi.fn();
    const view = renderHook(() =>
      usePanelFrame({
        open: true,
        onOpenChange: change,
        dismissible: false,
      }),
    );
    const details = swipeDetails();
    act(() => view.result.current.change(false, details));
    expect(details.cancel).toHaveBeenCalledOnce();
    expect(change).not.toHaveBeenCalled();
    act(() =>
      view.result.current.change(false, {
        ...details,
        reason: 'close-press',
        event: new MouseEvent('click'),
      }),
    );
    expect(change).toHaveBeenCalledWith(false);
  });
});
