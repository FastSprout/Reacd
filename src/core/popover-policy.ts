export const POPOVER_PLACEMENTS = [
  'top',
  'bottom',
  'inline-start',
  'inline-end',
] as const;
export const POPOVER_ALIGNMENTS = ['start', 'center', 'end'] as const;
export const POPOVER_MODES = ['click', 'hover'] as const;
export const POPOVER_TIMINGS = ['none', 'brief'] as const;
export const POPOVER_POLICY = {
  pointerEvents: 'auto',
  widthRem: 24,
  sideOffsetPx: 8,
  collisionPaddingPx: 8,
  arrowRem: 0.5,
  openDelay: { none: 0, brief: 300 },
  closeDelay: { none: 0, brief: 150 },
} as const;
export const POPOVER_DEFAULTS = {
  placement: 'bottom',
  align: 'center',
  arrow: false,
  modal: false,
  dismissible: true,
  retainContent: false,
  mode: 'click',
  openDelay: 'brief',
  closeDelay: 'brief',
  closeLabel: 'Close popover',
} as const;
