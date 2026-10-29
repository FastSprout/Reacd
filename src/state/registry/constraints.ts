import type { Result } from '../../core/result.js';
import type { RegistryConstraint, StateReader } from './registry.types.js';

export function checkConstraints(
  constraints: Iterable<RegistryConstraint>,
  read: StateReader,
  changed?: ReadonlySet<string>,
): Result<void> {
  for (const constraint of constraints) {
    if (changed && ![...constraint.keys].some((key) => changed.has(key))) continue;
    try {
      const result = constraint.validate(read);
      if (!result.success) return result;
    } catch (error) {
      return {
        success: false,
        issues: [
          {
            path: 'state.constraints',
            message:
              error instanceof Error ? error.message : 'State constraint failed.',
          },
        ],
      };
    }
  }
  return { success: true, data: undefined };
}
