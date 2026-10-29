export const TIMELINE_ORIENTATIONS = ['vertical', 'horizontal'] as const;
export const TIMELINE_POLICY = {
  maxItems: 100,
  statuses: { completed: 'Completed', current: 'Current', upcoming: 'Upcoming' },
} as const;
export const TIMELINE_DEFAULTS = {
  orientation: 'vertical',
  intent: 'primary',
  reverse: false,
} as const;
