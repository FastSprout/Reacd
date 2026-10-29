export const PROGRESS_GROUP_POLICY = {
  maxMagnitude: Number.MAX_SAFE_INTEGER,
  maxItems: 100,
  percent: 100,
} as const;
export const PROGRESS_GROUP_DEFAULTS = {
  max: 100,
  showStatus: true,
  intent: 'primary',
} as const;
