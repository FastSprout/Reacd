export const PAGE_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export const PAGE_SURFACE_VARIANTS = [
  'solid',
  'outline',
  'soft',
  'subtle',
  'ghost',
  'naked',
] as const;
export const PAGE_SURFACE_INTENTS = ['neutral', 'primary', 'danger'] as const;

export const PAGE_PRESENTATION_DEFAULTS = {
  orientation: 'vertical',
  featureOrientation: 'horizontal',
  reverse: false,
  variant: 'outline',
  intent: 'neutral',
  highlight: false,
  spotlight: false,
  newWindow: false,
} as const;

export const PAGE_PRESENTATION_POLICY = {
  contentTrackRem: 18,
  emphasisBorderMultiplier: 2,
  titleScale: {
    header: 1.75,
    hero: 2,
    section: 1.5,
    card: 1.125,
    feature: 1.125,
  },
} as const;
