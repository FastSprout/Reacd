export const FORM_MENU_POLICY = {
  textPattern: /^[^\r\n]*$/u,
  popupBlockRem: 20,
  popupInlineRem: 32,
  sideOffsetPx: 4,
  collisionPaddingPx: 8,
  compositionEnterCode: 13,
  compositionProcessCode: 229,
  locale: 'en-US',
} as const;

export const FORM_MENU_DEFAULTS = {
  status: 'ready',
  clearable: true,
  emptyMessage: 'No matching suggestions.',
  loadingMessage: 'Loading suggestions.',
  errorMessage: 'Suggestions could not be loaded.',
  callbackError: 'Change callbacks must return a boolean or no value.',
  callbackFailure: 'The change request could not be completed.',
  openLabel: 'Show suggestions',
  clearLabel: 'Clear text',
  requiredMessage: 'Enter text before submitting.',
  availableMessage: 'suggestions available.',
  suggestionsLabel: 'suggestions',
  invalidText: 'Text must not contain line breaks or exceed the text limit.',
} as const;
