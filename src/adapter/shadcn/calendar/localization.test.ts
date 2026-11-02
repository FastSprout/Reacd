import { expect, it } from 'vitest';
import { calendarLocalization } from './localization.js';
import { canonicalDate, nativeDate } from './date-value.js';

it('round-trips proleptic Gregorian boundaries without local clock conversions', () => {
  for (const date of ['0001-01-01', '0099-12-31', '2024-02-29', '9999-12-31']) {
    expect(canonicalDate(nativeDate(date))).toBe(date);
  }
  expect(canonicalDate(undefined)).toBeNull();
});

it('uses explicit Gregorian captions, digits and labels', () => {
  const date = nativeDate('2026-11-05');
  const { formatters, labels } = calendarLocalization('en-US');
  expect(formatters.formatCaption(date)).toBe('November 2026');
  expect(formatters.formatMonthDropdown(date)).toBe('November');
  expect(formatters.formatYearDropdown(date)).toBe('2026');
  expect(formatters.formatDay(date)).toBe('5');
  expect(formatters.formatWeekdayName(date)).toBe('Thu');
  expect(labels.labelDayButton(date)).toBe('Thursday, November 5, 2026');
  expect(labels.labelGrid(date)).toBe('November 2026');
  expect(labels.labelGridcell(date)).toBe('5');
  expect(labels.labelWeekday(date)).toBe('Thursday');
  expect(labels.labelNext()).toBe('Next month');
  expect(labels.labelPrevious()).toBe('Previous month');
  expect(labels.labelNav()).toBe('Calendar navigation');
  expect(calendarLocalization('ar-SA-u-ca-islamic').formatters.formatDay(date)).toBe(
    new Intl.DateTimeFormat('ar-SA', {
      calendar: 'gregory',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date),
  );
});
