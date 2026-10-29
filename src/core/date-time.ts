import { DATE_TIME_POLICY } from './date-time-policy.js';

export interface TemporalLimits {
  readonly min?: string | undefined;
  readonly max?: string | undefined;
}

export interface TemporalRange {
  readonly start: string | null;
  readonly end: string | null;
}

export function isIsoDate(value: string): boolean {
  if (
    value.length !== DATE_TIME_POLICY.dateLength ||
    !DATE_TIME_POLICY.datePattern.test(value)
  )
    return false;
  const parts = value.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const leapYear =
    year % DATE_TIME_POLICY.leapYearCycle === 0 &&
    (year % DATE_TIME_POLICY.centuryCycle !== 0 ||
      year % DATE_TIME_POLICY.leapCenturyCycle === 0);
  const maximumDay =
    month === DATE_TIME_POLICY.februaryMonth && leapYear
      ? DATE_TIME_POLICY.leapFebruaryDays
      : (DATE_TIME_POLICY.monthDays[month - 1] ?? 0);
  return value >= DATE_TIME_POLICY.minimumDate && day >= 1 && day <= maximumDay;
}

export function isIsoTime(value: string): boolean {
  return (
    value.length === DATE_TIME_POLICY.timeLength &&
    DATE_TIME_POLICY.timePattern.test(value)
  );
}

export function orderedTemporalLimits(limits: TemporalLimits): boolean {
  return (
    limits.min === undefined || limits.max === undefined || limits.min <= limits.max
  );
}

export function withinTemporalLimits(
  value: string | null,
  limits: TemporalLimits,
): boolean {
  return (
    value === null ||
    ((limits.min === undefined || value >= limits.min) &&
      (limits.max === undefined || value <= limits.max))
  );
}

export function orderedTemporalRange(value: TemporalRange): boolean {
  return value.start === null || value.end === null || value.start <= value.end;
}
