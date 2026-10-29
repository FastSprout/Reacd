import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShadcnTextarea } from './textarea.adapter.js';

const scrollHeight = vi.fn(() => 100);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('bounded textarea row measurement', () => {
  it('grows, shrinks and caps while preserving focus and selection', () => {
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(
      scrollHeight,
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue(
      Object.assign(document.createElement('textarea').style, {
        lineHeight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }),
    );
    const { rerender } = render(
      <ShadcnTextarea
        label="Notes"
        value="prefilled"
        autoResize
        rows={2}
        maxRows={6}
        onValueChange={vi.fn()}
      />,
    );
    const control = screen.getByRole('textbox');
    expect(control).toHaveAttribute('rows', '4');
    if (!(control instanceof HTMLTextAreaElement)) throw new Error('Missing textarea');
    control.focus();
    control.setSelectionRange(1, 3);
    scrollHeight.mockReturnValue(300);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(control.rows).toBe(6);
    expect(control.selectionStart).toBe(1);
    expect(control.selectionEnd).toBe(3);
    expect(control).toHaveFocus();
    scrollHeight.mockReturnValue(30);
    rerender(
      <ShadcnTextarea
        label="Notes"
        value="short"
        autoResize
        rows={2}
        maxRows={6}
        onValueChange={vi.fn()}
      />,
    );
    expect(control.rows).toBe(2);
  });

  it('handles missing observer and invalid font metrics with named fallbacks', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(120);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue(
      document.createElement('textarea').style,
    );
    const { unmount } = render(
      <ShadcnTextarea
        label="Notes"
        value="prefilled"
        autoResize
        rows={1}
        maxRows={8}
        onValueChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
    unmount();
    expect(() => window.dispatchEvent(new Event('resize'))).not.toThrow();
  });
});

it('remeasures observer/font changes and removes all subscriptions on unmount', () => {
  const fontEvents = new EventTarget();
  const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
  Object.defineProperty(document, 'fonts', { configurable: true, value: fontEvents });
  let resize: () => void = () => {
    throw new Error('Observer was not initialized');
  };
  const observe = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  const height = vi
    .spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get')
    .mockReturnValue(96);
  try {
    const { unmount } = render(
      <ShadcnTextarea
        label="Font changes"
        value="Text"
        autoResize
        rows={1}
        maxRows={10}
        onValueChange={vi.fn()}
      />,
    );
    const control = screen.getByRole('textbox');
    expect(observe).toHaveBeenCalledWith(control);
    height.mockReturnValue(144);
    act(() => {
      resize();
    });
    expect(control).toHaveAttribute('rows', '6');
    height.mockReturnValue(48);
    act(() => {
      fontEvents.dispatchEvent(new Event('loadingdone'));
    });
    expect(control).toHaveAttribute('rows', '2');
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    height.mockClear();
    act(() => {
      fontEvents.dispatchEvent(new Event('loadingdone'));
      window.dispatchEvent(new Event('resize'));
    });
    expect(height).not.toHaveBeenCalled();
  } finally {
    if (originalFonts === undefined) Reflect.deleteProperty(document, 'fonts');
    else Object.defineProperty(document, 'fonts', originalFonts);
  }
});

it('avoids row inflation from fractional line metrics', () => {
  vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(66);
  vi.spyOn(window, 'getComputedStyle').mockReturnValue(
    Object.assign(document.createElement('textarea').style, {
      lineHeight: '24.8px',
      paddingTop: '8px',
      paddingBottom: '8px',
    }),
  );
  render(
    <ShadcnTextarea
      label="Fractional metrics"
      value="Short"
      autoResize
      rows={2}
      maxRows={6}
      onValueChange={vi.fn()}
    />,
  );
  expect(screen.getByRole('textbox')).toHaveAttribute('rows', '2');
});
