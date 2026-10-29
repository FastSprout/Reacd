import { expect, it } from 'vitest';
import { nextCalendarRange } from './calendar-range.js';

it('starts, orders, completes equal endpoints and restarts controlled ranges', () => {
  expect(nextCalendarRange({ start: null, end: null }, '2026-10-29')).toEqual({
    start: '2026-10-29',
    end: null,
  });
  expect(nextCalendarRange({ start: '2026-10-29', end: null }, '2026-10-30')).toEqual({
    start: '2026-10-29',
    end: '2026-10-30',
  });
  expect(nextCalendarRange({ start: '2026-10-29', end: null }, '2026-10-28')).toEqual({
    start: '2026-10-28',
    end: '2026-10-29',
  });
  expect(nextCalendarRange({ start: null, end: '2026-10-29' }, '2026-10-30')).toEqual({
    start: '2026-10-29',
    end: '2026-10-30',
  });
  expect(nextCalendarRange({ start: '2026-10-29', end: null }, '2026-10-29')).toEqual({
    start: '2026-10-29',
    end: '2026-10-29',
  });
  expect(
    nextCalendarRange({ start: '2026-10-28', end: '2026-10-30' }, '2026-10-29'),
  ).toEqual({ start: '2026-10-29', end: null });
});
