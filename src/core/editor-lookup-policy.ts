import { CONTENT_POLICY } from './policy.js';
import { STATE_POLICY } from './state-policy.js';
import { EDITOR_MENU_POLICY } from './editor-menu-policy.js';

export const EDITOR_LOOKUP_POLICY = {
  maxScopeLength: STATE_POLICY.maxKeyLength,
  maxKeyLength: CONTENT_POLICY.maxLabelLength,
  maxQueryLength: EDITOR_MENU_POLICY.maxQuery,
  maxErrorLength: CONTENT_POLICY.maxLabelLength,
  initialOrdinal: 0,
  keySeparator: ':',
  invalidRequestMessage: 'Mention lookup correlation limit exceeded.',
  invalidScopeMessage: 'Mention lookup scope is invalid.',
  invalidQueryMessage: 'Mention lookup query exceeds its supported length.',
} as const;
