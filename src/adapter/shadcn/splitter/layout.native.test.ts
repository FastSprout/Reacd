import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { declaredLayout, sdkLayout } from './layout.js';
import { useControlledLayout } from './use-controlled-layout.js';

const panels = [
  { id: 'one', label: 'One' },
  { id: 'two', label: 'Two' },
];
const value = [
  { id: 'one', share: 50 },
  { id: 'two', share: 50 },
];
it('validates SDK candidate identity, finite constraints and complete values', () => {
  expect(sdkLayout('scope', value)).toEqual({ 'scope-one': 50, 'scope-two': 50 });
  expect(declaredLayout('scope', { 'scope-one': 101 }, panels).success).toBe(false);
  expect(
    declaredLayout(
      'scope',
      { 'scope-one': 60, 'scope-two': 40 },
      [{ id: 'one', label: 'One', minShare: 20, maxShare: 70 }, panels[1]].filter(
        (panel) => panel !== undefined,
      ),
    ).success,
  ).toBe(true);
});
it('never emits invalid or imperative updates and cancels stale reconciliation', () => {
  const change = vi.fn();
  const properties = { label: 'Panels', panels, value, onValueChange: change };
  const view = renderHook(() => useControlledLayout('scope', properties, false));
  act(() => {
    view.result.current.onLayoutChanged?.({}, { isUserInteraction: false });
    view.result.current.onLayoutChanged?.({}, { isUserInteraction: true });
    view.result.current.onLayoutChanged?.({}, { isUserInteraction: true });
  });
  expect(change).not.toHaveBeenCalled();
  view.unmount();
});

it('rejects a queued SDK user update after its owner disables interaction', () => {
  const change = vi.fn();
  const properties = { label: 'Panels', panels, value, onValueChange: change };
  const view = renderHook(() => useControlledLayout('scope', properties, true));
  act(() => {
    view.result.current.onLayoutChanged?.(
      { 'scope-one': 60, 'scope-two': 40 },
      { isUserInteraction: true },
    );
  });
  expect(change).not.toHaveBeenCalled();
  view.unmount();
});
