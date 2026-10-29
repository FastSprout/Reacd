import { describe, expect, it } from 'vitest';
import { errorSchema } from './error.schema.js';

describe('error presentation contract', () => {
  it('accepts HTTP errors and safe recovery links', () => {
    expect(
      errorSchema.safeParse({
        statusCode: 404,
        title: 'Page unavailable',
        redirect: '/',
      }).success,
    ).toBe(true);
  });

  it('rejects success codes, unsafe recovery and nameless errors', () => {
    for (const value of [
      { statusCode: 200 },
      { statusCode: 600 },
      { statusCode: 400.5 },
      { title: '' },
      { redirect: 'javascript:alert(1)' },
      { stack: 'private trace' },
    ])
      expect(
        errorSchema.safeParse({
          statusCode: 500,
          title: 'Service unavailable',
          ...value,
        }).success,
      ).toBe(false);
  });
});
