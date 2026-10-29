export const KBD_PLATFORMS = ['apple', 'other'] as const;
export const KBD_SIZES = ['small', 'medium', 'large'] as const;
export const KBD_VARIANTS = ['outline', 'soft', 'subtle', 'solid'] as const;
export const KBD_DEFAULTS = {
  platform: 'other',
  size: 'medium',
  variant: 'outline',
  intent: 'secondary',
} as const;
export const KBD_POLICY = {
  textScale: { small: 0.875, medium: 0.9375, large: 1 },
} as const;
export type KeyboardPlatform = (typeof KBD_PLATFORMS)[number];
