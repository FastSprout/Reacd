import { createRef, useRef } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useNarrowContainer } from './use-narrow-container.js';

describe('container sizing subscription', () => {
  it('ignores missing elements and empty observer deliveries', () => {
    const missing = createRef<HTMLElement>();
    expect(renderHook(() => useNarrowContainer(missing)).result.current).toBe(false);
    const element = document.createElement('div');
    const geometry = vi
      .spyOn(element, 'getBoundingClientRect')
      .mockReturnValue(new DOMRect(0, 0, 1024, 400));
    let callback: ResizeObserverCallback | undefined;
    const observer = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    const Original = globalThis.ResizeObserver;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(receive: ResizeObserverCallback) {
          callback = receive;
        }
        observe = observer.observe;
        unobserve = observer.unobserve;
        disconnect = observer.disconnect;
      },
    );
    const view = renderHook(() => useNarrowContainer(useRef(element)));
    act(() => callback?.([], observer));
    expect(view.result.current).toBe(false);
    view.unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
    vi.stubGlobal('ResizeObserver', Original);
    geometry.mockRestore();
  });
});
