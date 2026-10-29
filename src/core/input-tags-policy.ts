import { CONTENT_POLICY } from './policy.js';
import { STATE_POLICY } from './state-policy.js';

export const TAG_DELIMITERS = ['comma', 'semicolon', 'newline'] as const;
export type TagDelimiter = (typeof TAG_DELIMITERS)[number];
export const INPUT_TAGS_POLICY = {
  maxTags: CONTENT_POLICY.maxOptions,
  maxTagLength: STATE_POLICY.maxKeyLength,
  minTagsLimit: 1,
  minTagLength: 1,
  delimiters: ['comma'],
} as const;
export const TAG_DELIMITER_CHARACTERS = {
  comma: ',',
  semicolon: ';',
  newline: '\n',
} as const;
export const INPUT_TAGS_MESSAGES = {
  empty: 'Enter a tag before adding it.',
  duplicate: 'Tags must be unique.',
  untrimmed: 'Tags cannot start or end with whitespace.',
  count: 'The maximum number of tags has been reached.',
  length: 'A tag exceeds the maximum allowed length.',
} as const;
