export const EMPTY_SIZES = ['small', 'medium', 'large'] as const;
export const EMPTY_VARIANTS = ['outline', 'solid', 'soft', 'subtle', 'naked'] as const;
export const EMPTY_DEFAULTS = {
  size: 'medium',
  variant: 'outline',
  loading: false,
  loadingLabel: 'Loading',
} as const;
export const EMPTY_POLICY = {
  contentWidthRem: 32,
  titleScale: { small: 1, medium: 1.125, large: 1.25 },
  solidBorderMultiplier: 2,
} as const;
