import { act, renderHook } from '@testing-library/react';
import { useContext } from 'react';
import type { ReactNode } from 'react';
import type { Menu } from '@base-ui/react/menu';
import { expect, it, vi } from 'vitest';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { createEscapeScope } from '../../../renderer/theme/escape-scope.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { useMenuFrame } from './use-menu-frame.js';
import { MenuSelectionContext } from './menu-items.js';
function details(): Menu.Root.ChangeEventDetails {
  return {
    reason: 'escape-key',
    event: new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }),
    cancel: vi.fn(),
    allowPropagation: vi.fn(),
    isCanceled: false,
    isPropagationAllowed: false,
    trigger: undefined,
    preventUnmountOnClose: vi.fn(),
  };
}
it('dismisses child scopes before forwarding root Escape', () => {
  const onOpenChange = vi.fn();
  const view = renderHook(() => useMenuFrame({ open: true, onOpenChange }));
  const child = vi.fn();
  const release = view.result.current.scope.register(child);
  const event = details();
  act(() => view.result.current.change(false, event));
  expect(child).toHaveBeenCalledOnce();
  expect(event.cancel).toHaveBeenCalledOnce();
  expect(event.event.defaultPrevented).toBe(true);
  expect(onOpenChange).not.toHaveBeenCalled();
  release();
  act(() => view.result.current.change(false, details()));
  expect(onOpenChange).toHaveBeenCalledWith(false);
});
it('registers the active menu with its ancestor dismissal scope', () => {
  const parent = createEscapeScope();
  const onOpenChange = vi.fn();
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <EscapeScopeContext.Provider value={parent}>
        {children}
      </EscapeScopeContext.Provider>
    );
  }
  const view = renderHook(() => useMenuFrame({ open: true, onOpenChange }), {
    wrapper: Wrapper,
  });
  const child = vi.fn();
  const release = view.result.current.scope.register(child);
  act(() => { parent.dismiss(); });
  expect(child).toHaveBeenCalledOnce();
  expect(onOpenChange).not.toHaveBeenCalled();
  release();
  act(() => { parent.dismiss(); });
  expect(onOpenChange).toHaveBeenCalledWith(false);
  view.unmount();
  expect(parent.dismiss()).toBe(false);
});
it('suppresses retained descendants without mutating host state', () => {
  const change = vi.fn();
  const view = renderHook(() => useMenuFrame({ open: true, onOpenChange: change }), {
    wrapper: ({ children }) => (
      <PortalActiveContext.Provider value={false}>
        {children}
      </PortalActiveContext.Provider>
    ),
  });
  expect(view.result.current.active).toBe(false);
  expect(change).not.toHaveBeenCalled();
});
it('fails explicitly when private menu items lose their selection frame', () => {
  const view = renderHook(() => useContext(MenuSelectionContext));
  expect(() => view.result.current.finish(undefined, true)).toThrow(
    'Menu items require a selection frame.',
  );
});
