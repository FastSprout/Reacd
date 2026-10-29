import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import { themeNodeSchema } from './generative.schema.js';
import { appNodeSchema } from '../app/generative.schema.js';
import { errorNodeSchema } from '../error/generative.schema.js';

const content = z.strictObject({ type: z.literal('Text'), content: z.string() });

describe('generative application context', () => {
  it('validates App and Theme safe children', () => {
    for (const schema of [appNodeSchema(content), themeNodeSchema(content)]) {
      expect(
        schema.safeParse({
          type: schema.shape.type.value,
          children: [{ type: 'Text', content: 'Body' }],
        }).success,
      ).toBe(true);
      expect(
        schema.safeParse({
          type: schema.shape.type.value,
          children: [{ type: 'div' }],
        }).success,
      ).toBe(false);
    }
  });

  it('validates every error recovery slot', () => {
    const schema = errorNodeSchema(content);
    for (const slot of ['children', 'leading', 'actions']) {
      expect(
        schema.safeParse({
          type: 'Error',
          title: 'Unavailable',
          statusCode: 503,
          children: [],
          [slot]: [{ type: 'Text', content: 'Recovery' }],
        }).success,
      ).toBe(true);
      expect(
        schema.safeParse({
          type: 'Error',
          title: 'Unavailable',
          statusCode: 503,
          children: [],
          [slot]: [{ type: 'div' }],
        }).success,
      ).toBe(false);
    }
  });
});
