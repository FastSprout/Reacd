import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { useOverlayScope } from './use-overlay-scope.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';

it('rejects stale requests and disabled opening while permitting close', () => {
  const change = vi.fn();
  const view = renderHook(() =>
    useOverlayScope({
      open: true,
      disabled: true,
      onOpenChange: change,
    }),
  );
  act(() => view.result.current.change(true));
  expect(change).not.toHaveBeenCalled();
  act(() => view.result.current.change(false));
  expect(change).toHaveBeenCalledWith(false);
  const allowedFocus = new Event('closeAutoFocus', { cancelable: true });
  view.result.current.closeAutoFocus(allowedFocus);
  expect(allowedFocus.defaultPrevented).toBe(false);
  const inactive = renderHook(
    () =>
      useOverlayScope({
        open: true,
        onOpenChange: change,
      }),
    {
      wrapper: ({ children }) => (
        <PortalActiveContext value={false}>{children}</PortalActiveContext>
      ),
    },
  );
  change.mockClear();
  act(() => inactive.result.current.change(false));
  expect(change).not.toHaveBeenCalled();
  expect(inactive.result.current.visible).toBe(false);
  const hiddenFocus = new Event('closeAutoFocus', { cancelable: true });
  inactive.result.current.closeAutoFocus(hiddenFocus);
  expect(hiddenFocus.defaultPrevented).toBe(true);
});

it('suspends actual overlay interaction while pending', () => {
  const change = vi.fn();
  const view = renderHook(() => useOverlayScope({ open: true, onOpenChange: change }), {
    wrapper: ({ children }) => <FormPendingContext value={true}>
      {children}
    </FormPendingContext>,
  });
  expect(view.result.current.visible).toBe(false);
  expect(view.result.current.blocked).toBe(true);
  act(() => view.result.current.change(true));
  act(() => view.result.current.change(false));
  expect(change).not.toHaveBeenCalled();
});
