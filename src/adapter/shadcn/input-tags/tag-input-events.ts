import type { ClipboardEvent, KeyboardEvent } from 'react';
import type { InputTagsProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-tags/input-tags.props.js';
import {
  INPUT_TAGS_POLICY,
  TAG_DELIMITER_CHARACTERS,
} from '@fastsprout/reacd/adapter-runtime/core/input-tags-policy.js';
import type { useTagDraft } from './use-tag-draft.js';

type Entry = ReturnType<typeof useTagDraft>;

export function tagInputEvents(props: InputTagsProps, entry: Entry) {
  return {
    onCompositionStart: () => {
      entry.composing.current = true;
    },
    onCompositionEnd: () => {
      entry.composing.current = false;
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (
        entry.composing.current ||
        event.nativeEvent.isComposing ||
        event.keyCode === INPUT_TAGS_POLICY.imeProcessKeyCode
      )
        return;
      const delimiter = (props.delimiters ?? INPUT_TAGS_POLICY.delimiters).some(
        (name) => TAG_DELIMITER_CHARACTERS[name] === event.key,
      );
      if (
        entry.draft.trim() === '' ||
        !(event.key === 'Enter' || delimiter || (event.key === 'Tab' && props.addOnTab))
      )
        return;
      if (event.key === 'Tab') entry.skipBlur.current = true;
      else event.preventDefault();
      entry.commit(entry.draft);
    },
    onPaste: (event: ClipboardEvent<HTMLInputElement>) => {
      if (!props.addOnPaste || entry.composing.current) return;
      event.preventDefault();
      const start = event.currentTarget.selectionStart ?? entry.draft.length;
      const end = event.currentTarget.selectionEnd ?? entry.draft.length;
      entry.commit(
        entry.draft.slice(0, start) +
          event.clipboardData.getData('text') +
          entry.draft.slice(end),
      );
    },
    onBlur: () => {
      if (entry.skipBlur.current) {
        entry.skipBlur.current = false;
        return;
      }
      if (props.addOnBlur && entry.draft.trim() !== '') entry.commit(entry.draft);
    },
  };
}
