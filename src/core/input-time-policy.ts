import { DATE_TIME_POLICY } from './date-time-policy.js';

export const INPUT_TIME_POLICY = {
  hourCycle: 24,
  granularity: 'second',
  forceLeadingZeros: true,
  validationBehavior: 'native',
  anchorDate: '1970-01-01',
  anchorTimeZone: 'UTC',
  clearLabel: 'Clear',
  startLabel: 'Start',
  endLabel: 'End',
  invalidValue: 'Time must be within its allowed limits.',
  invalidRange: 'Time range must be ordered and within its allowed limits.',
  incompleteValue: 'Complete all time segments or clear the field.',
  completeDraftValue: DATE_TIME_POLICY.completeDraftValue,
} as const;
