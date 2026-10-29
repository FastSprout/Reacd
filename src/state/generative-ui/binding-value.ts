import type { z } from 'zod';
import type { Result } from '../../core/result.js';

export function parseBoundValue<Value>(
  key: string,
  schema: z.ZodType<Value>,
  value: unknown,
): Result<Value> {
  const result = schema.safeParse(value);
  if (!result.success) {
    return {
      success: false,
      issues: result.error.issues.map((issue) => ({
        path: `binding[${JSON.stringify(key)}].${issue.path.map(String).join('.')}`,
        message: issue.message,
      })),
    };
  }
  return { success: true, data: result.data };
}
