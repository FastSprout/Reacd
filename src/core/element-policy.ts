import { DEFAULTS } from './policy.js';

export const ELEMENT_POLICY = {
  maxAlertActions: 4,
  dismissPrefix: 'Dismiss',
  badgeSize: 'small',
  badgeScales: { small: 0.75, medium: 0.875, large: 1 },
} as const;
export const PROGRESS_POLICY = {
  max: DEFAULTS.progressMax,
  maximumMagnitude: Number.MAX_SAFE_INTEGER,
  percentScale: 100,
  fractionDigits: 2,
  showValue: true,
  indeterminateLabel: 'In progress',
} as const;
