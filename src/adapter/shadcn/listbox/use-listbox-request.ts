import { useState } from 'react';
import type { Selection } from 'react-aria-components/ListBox';
import type { ListboxProps } from '../../../components/listbox/index.js';
import { LISTBOX_DEFAULTS, LISTBOX_POLICY } from '../../../core/listbox-policy.js';
import { SELECTION_POLICY } from '../../../core/selection-policy.js';
import { canRequestSelection } from '../../../schema/selection/index.js';
import { listboxKeys, orderedListboxSelection } from './selection.js';

export function useListboxRequest(properties: ListboxProps) {
  const values = listboxKeys(properties);
  const [initial] = useState(() => Object.freeze([...values]));
  const [failure, setFailure] = useState<{ basis: string; message: string }>();
  const basis = JSON.stringify([
    properties.mode ?? LISTBOX_DEFAULTS.mode,
    values,
    properties.items.map(({ value, disabled }) => [value, Boolean(disabled)]),
    Boolean(properties.disabled),
    Boolean(properties.readOnly),
    properties.status ?? LISTBOX_DEFAULTS.status,
  ]);
  if (failure !== undefined && failure.basis !== basis) setFailure(undefined);
  const blocked =
    properties.disabled ||
    properties.readOnly ||
    (properties.status ?? LISTBOX_DEFAULTS.status) !== 'ready';
  function fail(message: string) {
    setFailure({ basis, message });
    return false;
  }
  function request(next: readonly string[]): boolean {
    if (blocked) return false;
    if (
      (properties.mode !== 'multiple' && next.length > LISTBOX_POLICY.singleLimit) ||
      !canRequestSelection(values, next, properties.items)
    ) {
      return fail(LISTBOX_POLICY.invalidChange);
    }
    if (next.length === values.length && next.every((key, n) => key === values[n])) {
      setFailure(undefined);
      return true;
    }
    try {
      const decision: unknown =
        properties.mode === 'multiple'
          ? properties.onValueChange(Object.freeze([...next]))
          : properties.onValueChange(next[0] ?? SELECTION_POLICY.emptySingleValue);
      if (decision === false) return fail(LISTBOX_POLICY.invalidChange);
      if (decision !== undefined && decision !== true) {
        if (decision instanceof Promise) void decision.catch(() => undefined);
        return fail(LISTBOX_POLICY.invalidCallback);
      }
      setFailure(undefined);
      return true;
    } catch {
      return fail(LISTBOX_POLICY.invalidCallback);
    }
  }
  function select(next: Selection) {
    if (blocked) return;
    const keys = orderedListboxSelection(next, properties);
    if (keys === undefined) fail(LISTBOX_POLICY.invalidChange);
    else request(keys);
  }
  return {
    values,
    blocked,
    failure: failure?.basis === basis ? failure.message : undefined,
    select,
    request,
    reset: () => request(initial),
  };
}
