import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useTagDraft } from './use-tag-draft.js';

it('keeps pending drafts until the exact host proposal is accepted', () => {
  const change = vi.fn();
  const props = { label: 'Topics', value: [], onValueChange: change };
  const { result, rerender } = renderHook(
    ({ value }: { value: readonly string[] }) =>
      useTagDraft({ ...props, value }, false),
    { initialProps: { value: [] as readonly string[] } },
  );
  act(() => {
    result.current.commit('Vue');
  });
  expect(result.current.draft).toBe('Vue');
  rerender({ value: ['React'] });
  expect(result.current.draft).toBe('Vue');
  rerender({ value: ['Vue'] });
  expect(result.current.draft).toBe('');
  rerender({ value: ['Angular'] });
  expect(result.current.draft).toBe('');
});

it('guards blocked and composing writes with no-op and limit validation', () => {
  const change = vi.fn();
  const props = { label: 'Topics', value: ['Vue'], onValueChange: change, maxTags: 1 };
  const { result, rerender } = renderHook(
    ({ blocked }) => useTagDraft(props, blocked),
    {
      initialProps: { blocked: true },
    },
  );
  act(() => {
    result.current.change('React');
    expect(result.current.commit('React')).toBe(false);
    expect(result.current.request([])).toBe(false);
  });
  expect(result.current.draft).toBe('');
  rerender({ blocked: false });
  act(() => {
    expect(result.current.request(['Vue'])).toBe(true);
    expect(result.current.request(['Vue', 'React'])).toBe(false);
    result.current.composing.current = true;
    expect(result.current.commit('React')).toBe(false);
  });
  expect(change).not.toHaveBeenCalled();
  expect(result.current.error).toContain('maximum number');
});

it('notifies native form only after an accepted immutable request', () => {
  const accepted = vi.fn();
  const change = vi.fn(() => false);
  const { result, rerender } = renderHook(
    ({ decline }) =>
      useTagDraft(
        {
          label: 'Topics',
          value: [],
          onValueChange: decline
            ? change
            : (value) => {
                expect(Object.isFrozen(value)).toBe(true);
              },
        },
        false,
        accepted,
      ),
    { initialProps: { decline: true } },
  );
  act(() => {
    result.current.commit('Vue');
  });
  expect(accepted).not.toHaveBeenCalled();
  rerender({ decline: false });
  act(() => {
    result.current.commit('React');
  });
  expect(accepted).toHaveBeenCalledExactlyOnceWith(['React']);
});
