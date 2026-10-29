import { atom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import type { z } from 'zod';
import type { Result } from '../../core/result.js';
import type { StateSnapshot } from '../../schema/state/definitions.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { BindingTarget, StateRegistry } from '../registry/registry.types.js';
import { stateFailure } from '../registry/transaction.js';
import { parseBoundValue } from './binding-value.js';

export interface BoundValue<Value> {
  value: Value;
  write: (value: Value) => Result<StateSnapshot>;
}

export function useBoundValue<Value>(
  registry: StateRegistry,
  reference: StateBindingReference,
  target: BindingTarget,
  schema: z.ZodType<Value>,
): Result<BoundValue<Value>> {
  const binding = useMemo(
    () => registry.bind(reference, target),
    [registry, reference, target],
  );
  const valueAtom = useMemo(
    () =>
      atom<Result<BoundValue<Value>>>((get) => {
        if (!binding.success) return binding;
        const parsed = parseBoundValue(
          reference.state,
          schema,
          get(binding.data.atom).value,
        );
        if (!parsed.success) return parsed;
        return {
          success: true,
          data: {
            value: parsed.data,
            write(value) {
              if (binding.data.mode !== 'readWrite') {
                return stateFailure(reference.state, 'This binding is read-only.');
              }
              const next = parseBoundValue(reference.state, schema, value);
              if (!next.success) return next;
              return binding.data.write(next.data);
            },
          },
        };
      }),
    [binding, schema, reference.state],
  );
  const current = useAtomValue(valueAtom, { store: registry.store });
  useEffect(() => {
    if (!current.success) return;
    const lease = registry.constrain([reference.state], (read) => {
      const snapshot = read(reference.state);
      if (!snapshot.success) return snapshot;
      const parsed = parseBoundValue(reference.state, schema, snapshot.data.value);
      return parsed.success ? { success: true, data: undefined } : parsed;
    });
    return lease.success ? lease.data : undefined;
  }, [registry, reference.state, schema, current.success]);
  return current;
}
