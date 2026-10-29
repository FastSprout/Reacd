export const TOOLTIP_PLACEMENTS = [
  'top',
  'bottom',
  'inline-start',
  'inline-end',
] as const;
export const TOOLTIP_TIMINGS = ['none', 'brief'] as const;
export const TOOLTIP_DELAYS = { none: 0, brief: 600 } as const;
export const TOOLTIP_POLICY = {
  sideOffsetPx: 8,
  collisionPaddingPx: 8,
  widthRem: 24,
  arrowRem: 0.5,
  maxShortcuts: 4,
  maxShortcutLength: 24,
} as const;
export const TOOLTIP_DEFAULTS = {
  open: false,
  placement: 'top',
  delay: 'brief',
  arrow: false,
} as const;
