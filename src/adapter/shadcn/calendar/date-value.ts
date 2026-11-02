import { parseDate } from '@internationalized/date';
import { CALENDAR_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/calendar-policy.js';

export function nativeDate(value: string): Date {
  return parseDate(value).toDate(CALENDAR_POLICY.timeZone);
}

export function canonicalDate(value: Date | undefined): string | null {
  if (value === undefined) return null;
  const year = String(value.getUTCFullYear()).padStart(CALENDAR_POLICY.yearDigits, '0');
  const month = String(value.getUTCMonth() + 1).padStart(
    CALENDAR_POLICY.partDigits,
    '0',
  );
  const day = String(value.getUTCDate()).padStart(CALENDAR_POLICY.partDigits, '0');
  return `${year}-${month}-${day}`;
}
