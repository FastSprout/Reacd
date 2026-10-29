import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  isoDateSchema,
  dateValueSchema,
  dateLimitsSchema,
  boundedDateValueSchema,
  dateRangeValueSchema,
  isoTimeSchema,
  timeValueSchema,
  timeLimitsSchema,
  boundedTimeValueSchema,
  timeRangeValueSchema,
  dateLocaleSchema,
} from './index.js';

describe.each([
  {
    name: 'date',
    scalar: isoDateSchema,
    nullable: dateValueSchema,
    limits: dateLimitsSchema,
    bounded: boundedDateValueSchema,
    range: dateRangeValueSchema,
    min: '2024-02-28',
    middle: '2024-02-29',
    max: '2024-03-01',
    before: '2024-02-27',
    after: '2024-03-02',
    invalid: '2024-02-30',
  },
  {
    name: 'time',
    scalar: isoTimeSchema,
    nullable: timeValueSchema,
    limits: timeLimitsSchema,
    bounded: boundedTimeValueSchema,
    range: timeRangeValueSchema,
    min: '12:00:00',
    middle: '12:00:01',
    max: '12:00:02',
    before: '11:59:59',
    after: '12:00:03',
    invalid: '24:00:00',
  },
])('$name data contracts', (domain) => {
  it('validates external values and does not coerce or accept SDK objects', () => {
    expect(domain.scalar.parse(domain.middle)).toBe(domain.middle);
    expect(domain.nullable.parse(null)).toBeNull();
    expect(domain.nullable.parse(domain.middle)).toBe(domain.middle);
    for (const value of [
      undefined,
      0,
      false,
      {},
      new Date('2024-02-29T12:00:00Z'),
      { toString: () => domain.middle },
      domain.invalid,
    ]) {
      expect(domain.scalar.safeParse(value).success).toBe(false);
      expect(domain.nullable.safeParse(value).success).toBe(false);
    }
  });

  it('validates closed ordered limits before constructing bounded schemas', () => {
    const limits = { min: domain.min, max: domain.max };
    const bounded = domain.bounded(limits);
    for (const value of [null, domain.min, domain.middle, domain.max])
      expect(bounded.safeParse(value).success).toBe(true);
    for (const value of [domain.before, domain.after, domain.invalid])
      expect(bounded.safeParse(value).success).toBe(false);
    expect(domain.bounded().parse(domain.middle)).toBe(domain.middle);
    expect(domain.bounded({ min: domain.min }).parse(domain.max)).toBe(domain.max);
    expect(domain.bounded({ max: domain.max }).parse(domain.min)).toBe(domain.min);
    expect(Object.isFrozen(domain.limits.parse(limits))).toBe(true);
    for (const invalid of [
      { min: domain.max, max: domain.min },
      { min: domain.invalid },
      { max: domain.invalid },
      { extra: 'native' },
    ]) {
      expect(domain.limits.safeParse(invalid).success).toBe(false);
    }
    expect(() => domain.bounded({ min: domain.max, max: domain.min })).toThrow(
      z.ZodError,
    );
    expect(() => domain.range({ min: domain.invalid })).toThrow(z.ZodError);
  });

  it('keeps partial ranges and rejects reversed or escaped intervals', () => {
    const range = domain.range({ min: domain.min, max: domain.max });
    for (const value of [
      { start: null, end: null },
      { start: domain.middle, end: null },
      { start: null, end: domain.middle },
      { start: domain.min, end: domain.max },
      { start: domain.middle, end: domain.middle },
    ]) {
      const result = range.parse(value);
      expect(result).toEqual(value);
      expect(Object.isFrozen(result)).toBe(true);
    }
    for (const value of [
      { start: domain.max, end: domain.min },
      { start: domain.before, end: null },
      { start: null, end: domain.after },
      { start: domain.invalid, end: null },
      { start: null, end: domain.invalid },
      { start: null },
      { end: null },
      { start: null, end: null, className: 'escape' },
      [],
      null,
    ])
      expect(range.safeParse(value).success).toBe(false);
    expect(domain.range().parse({ start: domain.min, end: null })).toEqual({
      start: domain.min,
      end: null,
    });
  });
});

it('requires a supported date locale and rejects malformed identifiers', () => {
  for (const locale of ['en-US', 'pl-PL', 'ar-EG', 'ja-JP-u-ca-japanese'])
    expect(dateLocaleSchema.parse(locale)).toBe(locale);
  for (const locale of ['', 'not_a_locale', 'zz-ZZ', 'x'.repeat(101), null])
    expect(dateLocaleSchema.safeParse(locale).success).toBe(false);
});
