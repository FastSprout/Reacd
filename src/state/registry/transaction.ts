import { atom } from 'jotai/vanilla';
import type { Result } from '../../core/result.js';
import type { StateSnapshot } from '../../schema/state/definitions.schema.js';
import type { ReacdStore } from '../store.js';
import { readEntry } from './registry-entry.js';
import { checkConstraints } from './constraints.js';
import type {
  PreparedWrite,
  RegistryConstraint,
  RegistryEntry,
  StateUpdate,
} from './registry.types.js';

const transactionAtom = atom(null, (_get, set, updates: readonly PreparedWrite[]) => {
  for (const update of updates) update.apply(set);
});

export function stateFailure(key: string, message: string): Result<never> {
  return {
    success: false,
    issues: [
      {
        path: `state[${JSON.stringify(key)}]`,
        message,
      },
    ],
  };
}

export function commitState(
  entries: ReadonlyMap<string, RegistryEntry>,
  store: ReacdStore,
  updates: readonly StateUpdate[],
  constraints: Iterable<RegistryConstraint>,
): Result<readonly StateSnapshot[]> {
  const writes: PreparedWrite[] = [];
  const selected: RegistryEntry[] = [];
  const seen = new Set<string>();
  for (const update of updates) {
    if (seen.has(update.key)) {
      return stateFailure(update.key, 'Duplicate update in one transaction.');
    }
    seen.add(update.key);
    const entry = entries.get(update.key);
    if (entry === undefined) {
      return stateFailure(update.key, 'State key is not registered.');
    }
    const prepared = entry.prepare(update.value);
    if (!prepared.success) return prepared;
    writes.push(prepared.data);
    selected.push(entry);
  }
  const staged = new Map(
    writes.map((write) => [write.snapshot.key, write.snapshot] as const),
  );
  const checked = checkConstraints(
    constraints,
    (key) => {
      const snapshot = staged.get(key);
      if (snapshot !== undefined) return { success: true, data: snapshot };
      const entry = entries.get(key);
      return entry === undefined
        ? stateFailure(key, 'State key is not registered.')
        : { success: true, data: readEntry(entry, store) };
    },
    seen,
  );
  if (!checked.success) return checked;
  store.set(transactionAtom, writes);
  return { success: true, data: selected.map((entry) => readEntry(entry, store)) };
}
