import { CALENDAR_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';
import type {
  TemporalLimits,
  TemporalRange,
} from '@fastsprout/reacd/adapter-runtime/core/date-time.js';

export function toCalendarDate(value: string): Date {
  const parts = value.split('-');
  const date = new Date(0);
  date.setUTCFullYear(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  date.setUTCHours(CALENDAR_POLICY.utcHour, 0, 0, 0);
  return date;
}

export function fromCalendarDate(value: Date): string {
  const year = String(value.getUTCFullYear()).padStart(CALENDAR_POLICY.yearDigits, '0');
  const month = String(value.getUTCMonth() + 1).padStart(
    CALENDAR_POLICY.partDigits,
    '0',
  );
  const day = String(value.getUTCDate()).padStart(CALENDAR_POLICY.partDigits, '0');
  return `${year}-${month}-${day}`;
}

export function calendarInitialDate({
  value,
  referenceDate,
  min,
  max,
}: TemporalLimits & {
  value: string | null | TemporalRange;
  referenceDate: string;
}): Date {
  let selected =
    typeof value === 'object' && value !== null
      ? (value.start ?? value.end ?? referenceDate)
      : (value ?? referenceDate);
  if (min !== undefined && selected < min) selected = min;
  if (max !== undefined && selected > max) selected = max;
  return toCalendarDate(selected);
}
