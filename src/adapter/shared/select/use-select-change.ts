import { useMemo } from 'react';
import type { SelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/select/index.js';
import { SELECTION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/selection-policy.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
  canRequestSelection,
} from '@fastsprout/reacd/adapter-runtime/schema/selection/index.js';

export function useSelectChange(
  properties: SelectProps,
  disabled: boolean,
  active: boolean,
): (value: unknown) => void {
  const single = useMemo(
    () => singleSelectionValueSchema(properties.items),
    [properties.items],
  );
  const multiple = useMemo(
    () => multipleSelectionValueSchema(properties.items),
    [properties.items],
  );
  return (candidate) => {
    if (disabled || properties.readOnly || properties.loading || !active) return;
    if (properties.mode === 'multiple') {
      const parsed = multiple.safeParse(candidate);
      if (
        parsed.success &&
        canRequestSelection(properties.value, parsed.data, properties.items)
      )
        properties.onValueChange(parsed.data);
    } else {
      const parsed = single.safeParse(
        candidate === null ? SELECTION_POLICY.emptySingleValue : candidate,
      );
      if (!parsed.success) return;
      const previous =
        properties.value === SELECTION_POLICY.emptySingleValue
          ? []
          : [properties.value];
      const next =
        parsed.data === SELECTION_POLICY.emptySingleValue ? [] : [parsed.data];
      if (canRequestSelection(previous, next, properties.items)) {
        properties.onValueChange(parsed.data);
      }
    }
  };
}
