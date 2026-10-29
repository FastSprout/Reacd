export const COLOR_MODES = ['light', 'dark', 'system'] as const;
export const RESOLVED_COLOR_MODES = ['light', 'dark'] as const;
export type ColorMode = (typeof COLOR_MODES)[number];
export type ResolvedColorMode = (typeof RESOLVED_COLOR_MODES)[number];

export const COLOR_MODE_POLICY = {
  initialPreference: 'system',
  mediaQuery: '(prefers-color-scheme: dark)',
  modeMismatch: 'An explicit preference must agree with the resolved color mode.',
  imageFallback: 'Image unavailable',
  labels: { system: 'System', light: 'Light', dark: 'Dark' },
  imageAspects: {
    landscape: { width: 640, height: 360 },
    square: { width: 480, height: 480 },
    portrait: { width: 360, height: 480 },
  },
  defaultAspect: 'landscape',
} as const;

export const COLOR_MODE_ASPECTS = ['landscape', 'square', 'portrait'] as const;
