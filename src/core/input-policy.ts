import { CONTENT_POLICY, DEFAULTS } from './policy.js';

export const INPUT_POLICY = {
  minimumLength: 0,
  maximumLength: CONTENT_POLICY.maxTextLength,
  defaultType: DEFAULTS.inputType,
  requiredMessage: 'Enter a value.',
  minimumMessagePrefix: 'Enter at least',
  minimumMessageSuffix: 'characters.',
  emailMessage: 'Enter a valid email address.',
  loadingPrefix: 'Updating',
} as const;

export const INPUT_AUTOFILL = [
  'off',
  'on',
  'name',
  'email',
  'username',
  'current-password',
  'new-password',
  'one-time-code',
] as const;

export const INPUT_PATTERNS = {
  singleLine: /^[^\r\n]*$/,
  emailEdgeWhitespace: /^[\t\n\f\r ]|[\t\n\f\r ]$/,
} as const;
