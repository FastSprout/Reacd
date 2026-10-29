import { CONTENT_POLICY } from './policy.js';

export const CHAT_COMPOSER_POLICY = {
  maxDraftLength: CONTENT_POLICY.maxTextLength,
  rows: CONTENT_POLICY.defaultTextAreaRows,
  compositionKeyCode: 229,
  paletteBlockRem: 36,
} as const;

export const CHAT_COMPOSER_DEFAULTS = {
  status: 'ready',
  submitOnEnter: true,
  disabled: false,
  readOnly: false,
  sendLabel: 'Send message',
  stopLabel: 'Stop response',
  retryLabel: 'Retry response',
  pendingLabel: 'Response in progress',
  unavailableLabel: 'Retry unavailable',
  errorMessage: 'The response could not be completed.',
} as const;

export const CHAT_COMPOSER_ERRORS = {
  missingScope: 'ChatPromptSubmit needs a ChatPrompt scope or an explicit action.',
  conflictingScope: 'ChatPromptSubmit cannot override its ChatPrompt capabilities.',
} as const;
