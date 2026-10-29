import { z } from 'zod';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { expect, it } from 'vitest';
import { dateValueSchema, timeValueSchema } from './index.js';

it('exports date and time lexical constraints for independent AJV use', () => {
  const ajv = new Ajv2020({ strict: false });
  const date = ajv.compile(z.toJSONSchema(dateValueSchema));
  const time = ajv.compile(z.toJSONSchema(timeValueSchema));
  expect(date('2024-02-29')).toBe(true);
  expect(date(null)).toBe(true);
  expect(time('23:59:59')).toBe(true);
  expect(time(null)).toBe(true);
  for (const value of [
    '2024-2-29',
    '24-02-29',
    '2024-02-29T00:00:00Z',
    '2024-02-29\n',
    {},
  ])
    expect(date(value)).toBe(false);
  for (const value of ['12:00', '1:00:00', '24:00:00', '12:00:60', '12:00:00Z'])
    expect(time(value)).toBe(false);
});

it('keeps calendar semantics in runtime validation beyond portable shape', () => {
  const date = new Ajv2020({ strict: false }).compile(z.toJSONSchema(dateValueSchema));
  expect(date('2024-02-30')).toBe(true);
  expect(dateValueSchema.safeParse('2024-02-30').success).toBe(false);
});
