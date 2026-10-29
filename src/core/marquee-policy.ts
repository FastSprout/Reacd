export const MARQUEE_PACES = ['slow', 'normal', 'fast'] as const;
export const MARQUEE_DIRECTIONS = ['forward', 'backward'] as const;
export const MARQUEE_POLICY = {
  maxItems: 20,
  visualCopies: 2,
  travelPercent: 50,
  itemWidthRem: 16,
  durationsSeconds: { slow: 60, normal: 40, fast: 20 },
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
} as const;
export const MARQUEE_DEFAULTS = {
  pace: 'normal',
  direction: 'forward',
  readOnly: false,
  emptyMessage: 'No notices available.',
  pauseLabel: 'Pause movement',
  resumeLabel: 'Resume movement',
  readLabel: 'Read all notices',
  pausedLabel: 'Movement paused.',
  enabledLabel: 'Movement enabled. Hover or focus pauses it temporarily.',
  reducedLabel: 'Motion is disabled by your reduced-motion preference.',
  unknownLabel: 'Notices are static until motion preferences are available.',
  readonlyLabel: 'Read-only notices are shown without motion.',
} as const;
