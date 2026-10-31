import { expect, it } from 'vitest';
import {
  toCalendarDate,
  fromCalendarDate,
  calendarInitialDate,
} from './calendar-date.js';

it('round trips canonical dates through UTC without changing two-digit years', () => {
  for (const value of ['0001-01-01', '0099-12-31', '2000-02-29', '9999-12-31']) {
    const date = toCalendarDate(value);
    expect(date.getUTCFullYear()).toBe(Number(value.slice(0, 4)));
    expect(date.getUTCHours()).toBe(12);
    expect(fromCalendarDate(date)).toBe(value);
  }
});

it('chooses selected, partial endpoint or explicit reference and clamps limits', () => {
  for (const [properties, value] of [
    [{ value: null, referenceDate: '2026-10-29' }, '2026-10-29'],
    [{ value: '2026-10-30', referenceDate: '2026-10-29' }, '2026-10-30'],
    [
      {
        value: { start: '2026-10-28', end: '2026-10-30' },
        referenceDate: '2026-10-29',
      },
      '2026-10-28',
    ],
    [
      { value: { start: null, end: '2026-10-30' }, referenceDate: '2026-10-29' },
      '2026-10-30',
    ],
    [{ value: { start: null, end: null }, referenceDate: '2026-10-29' }, '2026-10-29'],
    [{ value: null, referenceDate: '2026-10-29', min: '2026-11-01' }, '2026-11-01'],
    [{ value: null, referenceDate: '2026-10-29', max: '2026-10-01' }, '2026-10-01'],
  ] as const)
    expect(fromCalendarDate(calendarInitialDate(properties))).toBe(value);
});
