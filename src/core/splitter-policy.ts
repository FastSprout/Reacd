export const SPLITTER_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const SPLITTER_POLICY = {
  minPanels: 2,
  maxPanels: 8,
  total: 100,
  zero: 0,
  minShare: 10,
  maxShare: 90,
  tolerance: 0.001,
  keyboardStep: 1,
  coarseKeyboardStep: 10,
  panelTrackRem: 12,
  narrowWidthPx: 768,
  verticalExtentRem: 32,
  precision: 1000,
} as const;

export const SPLITTER_DEFAULTS = {
  orientation: 'horizontal',
  disabled: false,
} as const;
