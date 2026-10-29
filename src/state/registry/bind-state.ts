import type { Result } from '../../core/result.js';
import { stateBindingSchema } from '../../schema/state/binding.schema.js';
import type { ReacdStore } from '../store.js';
import { readEntry } from './registry-entry.js';
import { stateFailure } from './transaction.js';
import type {
  BindingTarget,
  RegistryEntry,
  StateBinding,
  StateRegistry,
} from './registry.types.js';

export function bindState(
  entries: ReadonlyMap<string, RegistryEntry>,
  store: ReacdStore,
  update: StateRegistry['update'],
  reference: unknown,
  target: BindingTarget,
): Result<StateBinding> {
  const parsed = stateBindingSchema.safeParse(reference);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: ['binding', ...issue.path.map(String)].join('.'),
        message: issue.message,
      })),
    };
  }
  const { state, mode } = parsed.data;
  const entry = entries.get(state);
  if (entry === undefined) return stateFailure(state, 'State key is not registered.');
  if (!target.kinds.includes(entry.kind)) {
    return stateFailure(state, 'State kind is incompatible with this property.');
  }
  if (mode !== target.mode) {
    return stateFailure(state, 'Binding mode does not match this property.');
  }
  if (mode === 'readWrite' && entry.access !== 'readWrite') {
    return stateFailure(state, 'This state is read-only for components.');
  }
  const base = {
    key: entry.key,
    kind: entry.kind,
    atom: entry.atom,
    read: () => readEntry(entry, store),
  };
  return mode === 'read'
    ? { success: true, data: { ...base, mode } }
    : {
        success: true,
        data: { ...base, mode, write: (value) => update(state, value) },
      };
}
