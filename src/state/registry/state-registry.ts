import type { Result } from '../../core/result.js';
import { inspectJsonBudget } from '../../core/json-budget.js';
import { stateDefinitionsSchema } from '../../schema/state/definitions.schema.js';
import type { ReacdStore } from '../store.js';
import { initializeStateRegistry } from './initialize-registry.js';
import type { StateRegistry } from './registry.types.js';

export function createStateRegistry(
  definitions: unknown,
  store?: ReacdStore,
): Result<StateRegistry> {
  const budget = inspectJsonBudget(definitions);
  if (budget.length > 0) return { success: false, issues: budget };
  const parsed = stateDefinitionsSchema.safeParse(definitions);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: ['state', ...issue.path.map(String)].join('.'),
        message: issue.message,
      })),
    };
  }
  return { success: true, data: initializeStateRegistry(parsed.data, store) };
}
