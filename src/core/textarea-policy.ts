import { CONTENT_POLICY } from './policy.js';

export const TEXTAREA_POLICY = {
  minimumRows: 1,
  maximumRows: CONTENT_POLICY.maxTextAreaRows,
  defaultRows: 3,
  defaultMaxRows: CONTENT_POLICY.maxTextAreaRows,
  minimumLength: 0,
  maximumLength: CONTENT_POLICY.maxTextLength,
  fallbackFontSizePx: 16,
  fallbackLineHeightRatio: 1.5,
  requiredMessage: 'Enter a value.',
  minimumMessagePrefix: 'Enter at least',
  minimumMessageSuffix: 'characters.',
} as const;
