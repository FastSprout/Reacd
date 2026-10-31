import { act, renderHook } from '../../../../test-support/adapter-testing.js';
import { describe, expect, it, vi } from 'vitest';
import type { InputTagsProps } from '../../../components/input-tags/index.js';
import { useTagDraft } from './use-tag-draft.js';

describe('controlled tag draft', () => {
  it.each([{ disabled: true }, { readOnly: true }])(
    'guards protected drafts and commits: %j',
    (properties) => {
      const change = vi.fn();
      const { result } = renderHook(() =>
        useTagDraft({ ...properties, label: 'Tags', value: [], onValueChange: change }),
      );
      act(() => {
        result.current.change('React');
        result.current.commit('React');
      });
      expect(result.current.draft).toBe('');
      expect(change).not.toHaveBeenCalled();
    },
  );
  it('retains unaccepted proposals and waits for matching controlled values', () => {
    const change = vi.fn();
    const initialProps: InputTagsProps = {
      label: 'Tags',
      value: [],
      onValueChange: change,
      maxTags: 2,
      maxTagLength: 5,
      delimiters: ['semicolon'],
    };
    const { result, rerender } = renderHook(
      (properties: InputTagsProps) => useTagDraft(properties),
      { initialProps },
    );
    act(() => result.current.commit('React'));
    expect(result.current.draft).toBe('React');
    rerender({ ...initialProps, value: ['Other'] });
    expect(result.current.draft).toBe('React');
    rerender({ ...initialProps, value: ['React'] });
    expect(result.current.draft).toBe('');
    act(() => {
      result.current.change('Vue');
      result.current.setComposing(true);
      result.current.commit('Vue');
    });
    expect(change).toHaveBeenCalledExactlyOnceWith(['React']);
    act(() => {
      result.current.setComposing(false);
      result.current.commit('Vue');
    });
    expect(change).toHaveBeenLastCalledWith(['React', 'Vue']);
  });
});
