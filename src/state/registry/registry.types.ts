import type { Atom, Setter } from 'jotai/vanilla';
import type { Result } from '../../core/result.js';
import type { StateAccess, StateKind } from '../../core/state-policy.js';
import type {
  StateSnapshot,
  StateValue,
} from '../../schema/state/definitions.schema.js';
import type { ReacdStore } from '../store.js';

export interface PreparedWrite {
  snapshot: StateSnapshot;
  apply: (set: Setter) => void;
}

export type StateReader = (key: string) => Result<StateSnapshot>;
export type StateConstraint = (read: StateReader) => Result<void>;

export interface RegistryConstraint {
  keys: ReadonlySet<string>;
  validate: StateConstraint;
}

export interface RegistryEntry {
  readonly key: string;
  readonly kind: StateKind;
  readonly access: StateAccess;
  readonly initial: StateValue;
  readonly atom: Atom<StateSnapshot>;
  prepare: (value: unknown) => Result<PreparedWrite>;
}

export interface BindingTarget {
  readonly kinds: readonly StateKind[];
  readonly mode: StateAccess;
}

interface BindingBase {
  readonly key: string;
  readonly kind: StateKind;
  readonly atom: Atom<StateSnapshot>;
  read: () => StateSnapshot;
}

export type StateBinding =
  | (BindingBase & { readonly mode: 'read' })
  | (BindingBase & {
      readonly mode: 'readWrite';
      write: (value: unknown) => Result<StateSnapshot>;
    });

export interface StateUpdate {
  readonly key: string;
  readonly value: unknown;
}

export interface StateRegistry {
  readonly store: ReacdStore;
  readonly keys: readonly string[];
  readonly definitionSignature: string;
  read: (key: string) => Result<StateSnapshot>;
  update: (key: string, value: unknown) => Result<StateSnapshot>;
  transaction: (updates: readonly StateUpdate[]) => Result<readonly StateSnapshot[]>;
  reset: () => Result<readonly StateSnapshot[]>;
  subscribe: (
    key: string,
    listener: (snapshot: StateSnapshot) => void,
  ) => Result<() => void>;
  bind: (reference: unknown, target: BindingTarget) => Result<StateBinding>;
  constrain: (keys: readonly string[], validate: StateConstraint) => Result<() => void>;
}
