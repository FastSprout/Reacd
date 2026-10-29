import { describe, expect, it } from 'vitest';
import {
  isIsoDate,
  isIsoTime,
  orderedTemporalLimits,
  orderedTemporalRange,
  withinTemporalLimits,
} from './date-time.js';

describe('canonical calendar and local time', () => {
  it.each([
    '0001-01-01',
    '9999-12-31',
    '2024-01-31',
    '2024-02-29',
    '2024-03-31',
    '2024-04-30',
    '2024-05-31',
    '2024-06-30',
    '2024-07-31',
    '2024-08-31',
    '2024-09-30',
    '2024-10-31',
    '2024-11-30',
    '2024-12-31',
    '2000-02-29',
    '1900-02-28',
  ])('accepts a real proleptic Gregorian date %s', (value) => {
    expect(isIsoDate(value)).toBe(true);
  });

  it.each([
    '',
    '2024-1-01',
    '24-01-01',
    '10000-01-01',
    '0000-01-01',
    '2024-00-01',
    '2024-13-01',
    '2024-01-00',
    '2024-02-30',
    '2023-02-29',
    '1900-02-29',
    '2024-04-31',
    ' 2024-01-01',
    '2024-01-01\n',
    '2024-01-01T00:00:00Z',
    '٢٠٢٤-٠١-٠١',
  ])('rejects noncanonical or impossible date %j', (value) => {
    expect(isIsoDate(value)).toBe(false);
  });

  it.each(['00:00:00', '12:30:45', '23:59:59'])('accepts local time %s', (value) => {
    expect(isIsoTime(value)).toBe(true);
  });

  it.each([
    '',
    '0:00:00',
    '00:00',
    '24:00:00',
    '12:60:00',
    '12:00:60',
    '12:00:00.000',
    '12:00:00Z',
    '12:00:00+02:00',
    ' 12:00:00',
    '12:00:00\n',
  ])('rejects noncanonical local time %j', (value) => {
    expect(isIsoTime(value)).toBe(false);
  });
});

it('checks inclusive limits without treating empty values as an invalid draft', () => {
  expect(withinTemporalLimits(null, {})).toBe(true);
  expect(withinTemporalLimits('12:00:00', {})).toBe(true);
  expect(withinTemporalLimits('12:00:00', { min: '12:00:00' })).toBe(true);
  expect(withinTemporalLimits('12:00:00', { max: '12:00:00' })).toBe(true);
  expect(withinTemporalLimits('11:59:59', { min: '12:00:00' })).toBe(false);
  expect(withinTemporalLimits('12:00:01', { max: '12:00:00' })).toBe(false);
  expect(orderedTemporalLimits({})).toBe(true);
  expect(orderedTemporalLimits({ min: '12:00:00' })).toBe(true);
  expect(orderedTemporalLimits({ max: '12:00:00' })).toBe(true);
  expect(orderedTemporalLimits({ min: '12:00:00', max: '12:00:00' })).toBe(true);
  expect(orderedTemporalLimits({ min: '13:00:00', max: '12:00:00' })).toBe(false);
});

it('accepts either partial endpoint but rejects reversed complete intervals', () => {
  expect(orderedTemporalRange({ start: null, end: null })).toBe(true);
  expect(orderedTemporalRange({ start: null, end: '12:00:00' })).toBe(true);
  expect(orderedTemporalRange({ start: '12:00:00', end: null })).toBe(true);
  expect(orderedTemporalRange({ start: '12:00:00', end: '12:00:00' })).toBe(true);
  expect(orderedTemporalRange({ start: '12:00:00', end: '13:00:00' })).toBe(true);
  expect(orderedTemporalRange({ start: '13:00:00', end: '12:00:00' })).toBe(false);
});
