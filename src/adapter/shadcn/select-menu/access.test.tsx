import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useSelectMenu } from './use-select-menu.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';

const base = {
  label: 'Access records',
  items: [{ value: '42', label: 'Answer' }],
  value: '',
  onValueChange: () => undefined,
};

it('blocks all requests when disabled or the containing portal is inactive', () => {
  for (const disabled of [false, true]) {
    const { result, unmount } = renderHook(
      () => useSelectMenu({ ...base, disabled, open: true }),
      {
        wrapper: ({ children }) => (
          <PortalActiveContext value={false}>{children}</PortalActiveContext>
        ),
      },
    );
    expect(result.current.open).toBe(false);
    act(() => {
      expect(result.current.requestOpen(true)).toBe(false);
      expect(result.current.requestQuery('next')).toBe(false);
      expect(result.current.requestSelection(['42'])).toBe(false);
    });
    unmount();
  }
});

it('keeps query access independent and rejects impossible single proposals', () => {
  const { result } = renderHook(() =>
    useSelectMenu({ ...base, readOnly: true, queryReadOnly: true }),
  );
  act(() => {
    expect(result.current.requestQuery('next')).toBe(false);
    expect(result.current.requestSelection(['42'])).toBe(false);
  });
  const single = renderHook(() =>
    useSelectMenu({
      ...base,
      items: [...base.items, { value: 'beta', label: 'Beta' }],
    }),
  );
  act(() => {
    expect(single.result.current.requestSelection(['42', 'beta'])).toBe(false);
  });
});

it('permits status-time removals and prevents new selections', () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useSelectMenu({ ...base, value: '42', status: 'loading', onValueChange: change }),
  );
  act(() => {
    expect(result.current.requestSelection([])).toBe(true);
  });
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  const empty = renderHook(() => useSelectMenu({ ...base, status: 'error' }));
  act(() => {
    expect(empty.result.current.requestSelection(['42'])).toBe(false);
  });
});

it('owns only uncontrolled query and disclosure and rejects multiline input', () => {
  const { result } = renderHook(() => useSelectMenu(base));
  act(() => {
    expect(result.current.requestOpen(false)).toBe(true);
    expect(result.current.requestQuery('')).toBe(true);
    expect(result.current.requestQuery('line\nbreak')).toBe(false);
  });
  expect(result.current.error).toBeDefined();
  act(() => {
    expect(result.current.requestQuery('next')).toBe(true);
    expect(result.current.requestOpen(true)).toBe(true);
  });
  expect(result.current.query).toBe('next');
  expect(result.current.open).toBe(true);
  expect(result.current.error).toBeUndefined();
});

it('hides obsolete native required feedback', () => {
  const optional = renderHook(() => useSelectMenu(base));
  act(() => optional.result.current.invalidRequired());
  expect(optional.result.current.error).toBeUndefined();
  optional.unmount();
  const field = renderHook(
    (disabled: boolean) => useSelectMenu({ ...base, required: true, disabled }),
    { initialProps: false },
  );
  act(() => field.result.current.invalidRequired());
  expect(field.result.current.error).toBeDefined();
  field.rerender(true);
  expect(field.result.current.error).toBeUndefined();
});
