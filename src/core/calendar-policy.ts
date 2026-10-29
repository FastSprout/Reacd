import { DATE_TIME_POLICY } from './date-time-policy.js';

export const CALENDAR_POLICY = {
  minimumMonths: 1,
  maximumMonths: 2,
  firstWeekday: 0,
  lastWeekday: 6,
  daysPerWeek: 7,
  utcHour: 12,
  yearDigits: 4,
  partDigits: 2,
  timeZone: 'UTC',
} as const;

export const CALENDAR_DEFAULTS = {
  locale: DATE_TIME_POLICY.locale,
  numberOfMonths: 1,
  weekStartsOn: 1,
  mode: 'single',
  disabled: false,
  readOnly: false,
  required: false,
  previousLabel: 'Previous month',
  nextLabel: 'Next month',
  navigationLabel: 'Calendar navigation',
  requiredSingle: 'Select a date.',
  requiredRange: 'Select a complete date range.',
} as const;
