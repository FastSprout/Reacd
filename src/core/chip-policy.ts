export const CHIP_SIZES = ['small', 'medium', 'large'] as const;
export const CHIP_CORNERS = [
  'top-start',
  'top-end',
  'bottom-start',
  'bottom-end',
] as const;
export const CHIP_POLICY = {
  maxMagnitude: Number.MAX_SAFE_INTEGER,
  textScale: { small: 0.875, medium: 0.9375, large: 1 },
  clearanceRem: 0.375,
  maxInlineRem: 6,
  dotRem: { small: 0.375, medium: 0.5, large: 0.75 },
} as const;
export const CHIP_DEFAULTS = {
  size: 'medium',
  corner: 'top-end',
  intent: 'primary',
  show: true,
  inset: false,
  standalone: false,
} as const;
