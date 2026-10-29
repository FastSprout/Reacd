import { INPUT_TAGS_MESSAGES, TAG_DELIMITER_CHARACTERS } from './input-tags-policy.js';
import type { TagDelimiter } from './input-tags-policy.js';

export interface TagLimits {
  maxTags: number;
  maxTagLength: number;
}
export function tagValidationMessage(values: readonly string[], limits: TagLimits) {
  if (values.length > limits.maxTags) return INPUT_TAGS_MESSAGES.count;
  if (values.some((tag) => tag.length === 0)) return INPUT_TAGS_MESSAGES.empty;
  if (values.some((tag) => tag !== tag.trim())) return INPUT_TAGS_MESSAGES.untrimmed;
  if (values.some((tag) => tag.length > limits.maxTagLength)) {
    return INPUT_TAGS_MESSAGES.length;
  }
  if (new Set(values).size !== values.length) return INPUT_TAGS_MESSAGES.duplicate;
  return undefined;
}
export function splitTagDraft(draft: string, delimiters: readonly TagDelimiter[]) {
  let parts = [draft.replaceAll('\r\n', '\n')];
  for (const delimiter of delimiters) {
    const character = TAG_DELIMITER_CHARACTERS[delimiter];
    parts = parts.flatMap((part) => part.split(character));
  }
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}
export function appendTags(
  values: readonly string[],
  draft: string,
  delimiters: readonly TagDelimiter[],
  limits: TagLimits,
) {
  const added = splitTagDraft(draft, delimiters);
  if (added.length === 0) {
    return { success: false, message: INPUT_TAGS_MESSAGES.empty } as const;
  }
  const next = [...values, ...added];
  const message = tagValidationMessage(next, limits);
  return message === undefined
    ? ({ success: true, values: next } as const)
    : ({ success: false, message } as const);
}
export function sameTags(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((tag, i) => tag === right[i]);
}
