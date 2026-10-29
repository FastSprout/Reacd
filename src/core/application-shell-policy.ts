export const APPLICATION_DIRECTIONS = ['ltr', 'rtl'] as const;

export const APPLICATION_DEFAULTS = {
  direction: 'ltr',
  language: 'en',
  recoveryLabel: 'Back to home',
} as const;

export const APPLICATION_POLICY = {
  minimumErrorStatus: 400,
  maximumErrorStatus: 599,
  maximumLanguageLength: 80,
} as const;
