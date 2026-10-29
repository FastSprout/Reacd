import { CONTENT_POLICY } from './policy.js';

export const SELECTION_POLICY = {
  maximumOptions: CONTENT_POLICY.maxOptions,
  maximumValueLength: CONTENT_POLICY.maxLabelLength,
  emptySingleValue: '',
} as const;
