import type { Selection } from 'react-aria-components/ListBox';
import type { ListboxProps } from '../../../components/listbox/index.js';
import { SELECTION_POLICY } from '../../../core/selection-policy.js';

export function listboxKeys(properties: ListboxProps): readonly string[] {
  if (properties.mode === 'multiple') return properties.value;
  return properties.value === SELECTION_POLICY.emptySingleValue
    ? []
    : [properties.value];
}

export function orderedListboxSelection(
  next: Selection,
  properties: ListboxProps,
): readonly string[] | undefined {
  const previous = listboxKeys(properties);
  if (next === 'all') {
    if (properties.mode !== 'multiple') return undefined;
    return [
      ...previous,
      ...properties.items
        .filter((item) => !item.disabled && !previous.includes(item.value))
        .map((item) => item.value),
    ];
  }
  const values = [...next];
  if (!values.every((key): key is string => typeof key === 'string')) return undefined;
  const retained = previous.filter((key) => next.has(key));
  const additions = properties.items
    .filter((item) => next.has(item.value) && !previous.includes(item.value))
    .map((item) => item.value);
  if (retained.length + additions.length !== values.length) return undefined;
  return [...retained, ...additions];
}
