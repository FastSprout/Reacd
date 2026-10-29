import { act, render, renderHook, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { useSystemColorMode } from './use-system-color-mode.js';

it('uses explicit fallback when the media API is missing', () => {
  vi.stubGlobal('matchMedia', undefined);
  const hook = renderHook(() => useSystemColorMode('dark'));
  expect(hook.result.current).toBe('dark');
  hook.unmount();
  vi.unstubAllGlobals();
});

it('hydrates the server fallback then observes and releases media changes', () => {
  let dark = true;
  const listeners = new Set<() => void>();
  const add = vi.fn((_type: string, listener: () => void) => listeners.add(listener));
  const remove = vi.fn((_type: string, listener: () => void) => {
    listeners.delete(listener);
  });
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return dark;
    },
    addEventListener: add,
    removeEventListener: remove,
  }));
  function Probe() {
    const mode = useSystemColorMode('light');
    return <output aria-label="System mode">{mode}</output>;
  }
  const container = document.createElement('div');
  container.innerHTML = renderToString(<Probe />);
  expect(container.textContent).toBe('light');
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(<Probe />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('status', { name: 'System mode' })).toHaveTextContent('dark');
  act(() => {
    dark = false;
    for (const listener of listeners) listener();
  });
  expect(screen.getByRole('status', { name: 'System mode' })).toHaveTextContent(
    'light',
  );
  expect(errors).toEqual([]);
  expect(add).toHaveBeenCalledOnce();
  view.unmount();
  container.remove();
  expect(remove).toHaveBeenCalledOnce();
  expect(listeners.size).toBe(0);
  vi.unstubAllGlobals();
});
