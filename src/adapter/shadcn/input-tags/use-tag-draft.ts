import { useRef, useState } from 'react';
import type { InputTagsProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-tags/input-tags.props.js';
import { INPUT_TAGS_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-tags-policy.js';
import {
  appendTags,
  sameTags,
  tagValidationMessage,
} from '@fastsprout/reacd/adapter-runtime/core/tag-entry.js';
import { useMenuRequest } from '../select-menu/use-menu-request.js';

interface Draft {
  readonly text: string;
  readonly error?: string | undefined;
  readonly pending?: readonly string[] | undefined;
}

export function useTagDraft(
  props: InputTagsProps,
  blocked: boolean,
  onAccepted?: (value: readonly string[]) => void,
) {
  const [draft, setDraft] = useState<Draft>({ text: '' });
  const composing = useRef(false);
  const skipBlur = useRef(false);
  const callback = useMenuRequest();
  const limits = {
    maxTags: props.maxTags ?? INPUT_TAGS_POLICY.maxTags,
    maxTagLength: props.maxTagLength ?? INPUT_TAGS_POLICY.maxTagLength,
  };
  if (draft.pending && sameTags(props.value, draft.pending)) {
    setDraft({ text: '' });
  }
  function request(next: readonly string[]) {
    if (blocked) return false;
    const error = tagValidationMessage(next, limits);
    if (error) {
      setDraft((current) => ({ ...current, error }));
      return false;
    }
    if (sameTags(next, props.value)) return true;
    const accepted = callback.request(props.onValueChange, Object.freeze([...next]));
    if (accepted) onAccepted?.(next);
    return accepted;
  }
  function commit(text: string) {
    if (blocked || composing.current) return false;
    const result = appendTags(
      props.value,
      text,
      props.delimiters ?? INPUT_TAGS_POLICY.delimiters,
      limits,
    );
    if (!result.success) {
      setDraft({ text, error: result.message });
      return false;
    }
    setDraft({ text, pending: result.values });
    return request(result.values);
  }
  return {
    draft: draft.text,
    error: draft.error || callback.error,
    composing,
    skipBlur,
    request,
    commit,
    change: (text: string) => {
      if (!blocked) setDraft({ text });
    },
  };
}
