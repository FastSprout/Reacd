export const ICON_NAMES = [
  'add',
  'remove',
  'close',
  'check',
  'search',
  'info',
  'warning',
  'error',
  'success',
  'settings',
  'download',
  'upload',
  'external',
  'loading',
] as const;
export const ICON_SIZES = ['small', 'medium', 'large'] as const;
export const ICON_POLICY = {
  defaultSize: 'medium',
  dimensionsRem: { small: 1, medium: 1.25, large: 1.5 },
} as const;
export type IconName = (typeof ICON_NAMES)[number];
