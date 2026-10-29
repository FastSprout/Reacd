export const NAVIGATION_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const NAVIGATION_COMPOSITION_POLICY = {
  minimumSteps: 1,
  maximumSteps: 32,
  maximumColumns: 12,
  maximumLinks: 32,
  minimumLinks: 1,
  columnWidthRem: 12,
  popupWidthRem: 24,
  popupOffsetPx: 4,
  collisionPaddingPx: 8,
  disclosureDelayMs: 100,
  stepDescriptionScale: 0.9,
} as const;
export const NAVIGATION_COMPOSITION_DEFAULTS = {
  orientation: 'horizontal',
  linear: true,
} as const;
