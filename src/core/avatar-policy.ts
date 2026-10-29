export const AVATAR_SIZES = ['small', 'medium', 'large'] as const;
export const AVATAR_DIMENSIONS = {
  small: { rem: 2, pixels: 32 },
  medium: { rem: 3, pixels: 48 },
  large: { rem: 4, pixels: 64 },
} as const;
export const AVATAR_POLICY = {
  maxInitials: 2,
  initialsPerWord: 1,
  minVisible: 1,
  fallbackFontDivisor: 3,
  sourceBase: 'https://reacd.dev/',
  locale: 'en',
} as const;
export const AVATAR_DEFAULTS = {
  size: 'medium',
  max: 5,
  fallback: '?',
  emptyMessage: 'No people to display.',
} as const;
