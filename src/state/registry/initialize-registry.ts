import type { Result } from '../../core/result.js';
import type {
  StateDefinitions,
  StateSnapshot,
} from '../../schema/state/definitions.schema.js';
import { definitionSignature } from '../../schema/state/definition-signature.js';
import { createReacdStore } from '../store.js';
import type { ReacdStore } from '../store.js';
import { createEntry } from './create-entry.js';
import { bindState } from './bind-state.js';
import { readEntry } from './registry-entry.js';
import { commitState, stateFailure } from './transaction.js';
import type { RegistryConstraint, StateRegistry } from './registry.types.js';
import { checkConstraints } from './constraints.js';

export function initializeStateRegistry(
  definitions: StateDefinitions,
  store?: ReacdStore,
): StateRegistry {
  const activeStore = store ?? createReacdStore();
  const constraints = new Set<RegistryConstraint>();
  const entries = new Map(
    definitions.map((definition) => [definition.key, createEntry(definition)] as const),
  );
  function read(key: string): Result<StateSnapshot> {
    const entry = entries.get(key);
    return entry === undefined
      ? stateFailure(key, 'State key is not registered.')
      : { success: true, data: readEntry(entry, activeStore) };
  }
  const registry: StateRegistry = {
    store: activeStore,
    keys: Object.freeze([...entries.keys()]),
    definitionSignature: definitionSignature(definitions),
    read,
    transaction: (updates) => commitState(entries, activeStore, updates, constraints),
    update(key, value) {
      const result = commitState(entries, activeStore, [{ key, value }], constraints);
      return result.success ? read(key) : result;
    },
    reset: () =>
      commitState(
        entries,
        activeStore,
        [...entries.values()].map((entry) => ({
          key: entry.key,
          value: entry.initial,
        })),
        constraints,
      ),
    subscribe(key, listener) {
      const entry = entries.get(key);
      if (entry === undefined) {
        return stateFailure(key, 'State key is not registered.');
      }
      return {
        success: true,
        data: activeStore.sub(entry.atom, () =>
          listener(readEntry(entry, activeStore)),
        ),
      };
    },
    bind: (reference, target) =>
      bindState(entries, activeStore, registry.update, reference, target),
    constrain(keys, validate) {
      if (keys.length === 0) {
        return stateFailure('constraints', 'A constraint requires state keys.');
      }
      for (const key of keys) {
        if (!entries.has(key)) return stateFailure(key, 'State key is not registered.');
      }
      const constraint = { keys: new Set(keys), validate };
      const checked = checkConstraints([constraint], read);
      if (!checked.success) return checked;
      constraints.add(constraint);
      return {
        success: true,
        data: () => {
          constraints.delete(constraint);
        },
      };
    },
  };
  return Object.freeze(registry);
}
