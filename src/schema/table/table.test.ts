import { expect, it } from 'vitest';
import { tableComponentSchema, tableDeclarationSchema } from './table.schema.js';
import { tableNodeSchema } from './generative.schema.js';
const STATIC = { caption: 'Static', columns: ['Name'], rows: [['Alpha']] };
it('retains static compatibility and validates row dimensions', () => {
  for (const schema of [tableComponentSchema, tableDeclarationSchema]) {
    expect(schema.safeParse(STATIC).success).toBe(true);
    expect(schema.safeParse({ ...STATIC, rows: [[]] }).success).toBe(false);
  }
  expect(tableDeclarationSchema.safeParse({ ...STATIC, mode: 'static' }).success).toBe(
    true,
  );
  expect(
    tableDeclarationSchema.safeParse({ ...STATIC, onRetry: 'retry' }).success,
  ).toBe(false);
  expect(tableNodeSchema.safeParse({ type: 'Table', ...STATIC }).success).toBe(true);
  expect(
    tableNodeSchema.safeParse({ type: 'Table', ...STATIC, rows: [[]] }).success,
  ).toBe(false);
});
