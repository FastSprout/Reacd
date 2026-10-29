import type { SelectionOption } from './options.schema.js';

export function canRequestSelection(
  previous: readonly string[],
  next: readonly string[],
  items: readonly SelectionOption[],
): boolean {
  if (new Set(next).size !== next.length) return false;
  const existing = new Set(previous);
  const available = new Map(items.map((item) => [item.value, item]));
  return next.every((value) => {
    const option = available.get(value);
    return option !== undefined && (!option.disabled || existing.has(value));
  });
}
