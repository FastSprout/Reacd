import type { TemporalRange } from './date-time.js';

export function nextCalendarRange(value: TemporalRange, day: string): TemporalRange {
  if (value.start !== null && value.end !== null) return { start: day, end: null };
  const first = value.start ?? value.end;
  if (first === null) return { start: day, end: null };
  return day < first ? { start: day, end: first } : { start: first, end: day };
}
