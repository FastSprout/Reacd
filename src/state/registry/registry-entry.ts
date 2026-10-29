import { atom } from 'jotai/vanilla';
import type { z } from 'zod';
import type { StateAccess, StateKind } from '../../core/state-policy.js';
import type {
  StateSnapshot,
  StateValue,
} from '../../schema/state/definitions.schema.js';
import type { ReacdStore } from '../store.js';
import type { RegistryEntry } from './registry.types.js';

export function createRegistryEntry<Value extends StateValue>(
  definition: Readonly<{
    key: string;
    kind: StateKind;
    access: StateAccess;
    initial: Value;
  }>,
  schema: z.ZodType<Value>,
  snapshot: (value: Value) => StateSnapshot,
): RegistryEntry {
  const valueAtom = atom<Value>(definition.initial);
  const snapshotAtom = atom((get) => Object.freeze(snapshot(get(valueAtom))));
  return {
    key: definition.key,
    kind: definition.kind,
    access: definition.access,
    initial: definition.initial,
    atom: snapshotAtom,
    prepare(value) {
      const result = schema.safeParse(value);
      if (!result.success) {
        return {
          success: false,
          issues: result.error.issues.map((issue) => ({
            path:
              `state[${JSON.stringify(definition.key)}].value.` +
              issue.path.map(String).join('.'),
            message: issue.message,
          })),
        };
      }
      return {
        success: true,
        data: {
          snapshot: Object.freeze(snapshot(result.data)),
          apply: (set) => {
            set(valueAtom, result.data);
          },
        },
      };
    },
  };
}

export function readEntry(entry: RegistryEntry, store: ReacdStore): StateSnapshot {
  return store.get(entry.atom);
}
