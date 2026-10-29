import { useEffect, useRef, useState } from 'react';
import type { InputTagsProps } from '../../../components/input-tags/index.js';
import { INPUT_TAGS_POLICY } from '../../../core/input-tags-policy.js';
import { appendTags, sameTags } from '../../../core/tag-entry.js';

export function useTagDraft({
  value,
  onValueChange,
  maxTags = INPUT_TAGS_POLICY.maxTags,
  maxTagLength = INPUT_TAGS_POLICY.maxTagLength,
  delimiters = INPUT_TAGS_POLICY.delimiters,
  disabled,
  readOnly,
}: InputTagsProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | undefined>();
  const pending = useRef<readonly string[] | null>(null);
  const composing = useRef(false);
  useEffect(() => {
    if (pending.current !== null && sameTags(value, pending.current)) {
      pending.current = null;
      setDraft('');
    }
  }, [value]);
  return {
    draft,
    error,
    composing,
    setComposing: (value: boolean) => {
      composing.current = value;
    },
    change: (next: string) => {
      if (disabled || readOnly) return;
      pending.current = null;
      setError(undefined);
      setDraft(next);
    },
    commit: (next: string) => {
      if (disabled || readOnly || composing.current) return;
      setDraft(next);
      const result = appendTags(value, next, delimiters, { maxTags, maxTagLength });
      if (!result.success) {
        setError(result.message);
        return;
      }
      setError(undefined);
      pending.current = result.values;
      onValueChange(result.values);
    },
  };
}
