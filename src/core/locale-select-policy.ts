import { CONTENT_POLICY } from './policy.js';

export const LOCALE_SELECT_POLICY = {
  minimumLocales: 1,
  maximumLocales: CONTENT_POLICY.maxOptions,
  maximumCodeLength: 100,
  codePattern: /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*(?![\s\S])/,
} as const;
