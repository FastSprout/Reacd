import { useCallback, useMemo, useReducer, useState } from 'react';
import type { FormConstraint } from
  '@fastsprout/reacd/adapter-runtime/core/form-constraint.js';
import { FormConstraintRegistry } from
  '@fastsprout/reacd/adapter-runtime/core/form-constraint-registry.js';

export function useMaterialValidation() {
  const [registry] = useState(() => new FormConstraintRegistry());
  const [focusHandles] = useState(() => new Map<string, () => void>());
  const [attempted, setAttempted] = useState(false);
  const [, refresh] = useReducer((revision: number) => revision + 1, 0);
  const register = useCallback(
    (constraint: FormConstraint) => {
      const remove = registry.register(constraint);
      refresh();
      return () => {
        remove();
        refresh();
      };
    },
    [registry],
  );
  const registerFocus = useCallback(
    (id: string, focus: () => void) => {
      focusHandles.set(id, focus);
      return () => {
        focusHandles.delete(id);
      };
    },
    [focusHandles],
  );
  const metadata = useMemo(() => ({ attempted, register }), [attempted, register]);
  const focusMetadata = useMemo(() => ({ register: registerFocus }), [registerFocus]);
  return {
    metadata,
    focusMetadata,
    issues: attempted ? registry.inspect() : [],
    submit: () => {
      const issues = registry.inspect();
      setAttempted(true);
      const first = issues[0];
      if (first !== undefined) {
        focusHandles.get(first.id)?.();
        return false;
      }
      return true;
    },
  };
}
