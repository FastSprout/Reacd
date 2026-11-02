import { PROSE_POLICY } from '../../core/prose-policy.js';
import { proseArrayValues } from './array-values.js';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function boundedProse(value: unknown): boolean {
  const pending = [{ value, depth: 0 }];
  let characters = 0;
  for (const item of pending) {
    if (item.depth > PROSE_POLICY.maxDepth) return false;
    if (typeof item.value === 'string') {
      characters += item.value.length;
      if (characters > PROSE_POLICY.maxCharacters) return false;
    } else if (isArray(item.value)) {
      if (item.value.length > PROSE_POLICY.maxArrayLength) return false;
      const children = proseArrayValues(item.value);
      if (children === null) return false;
      for (const child of children) {
        pending.push({ value: child, depth: item.depth + 1 });
      }
    } else if (isObject(item.value)) {
      const prototype: unknown = Object.getPrototypeOf(item.value);
      if (prototype !== null && prototype !== Object.prototype) return false;
      const properties = Object.getOwnPropertyDescriptors(item.value);
      if (Object.keys(properties).length > PROSE_POLICY.maxObjectProperties)
        return false;
      if (Object.getOwnPropertySymbols(item.value).length > 0) return false;
      for (const property of Object.values(properties)) {
        if (property.get !== undefined || property.set !== undefined) return false;
        const child: unknown = property.value;
        pending.push({ value: child, depth: item.depth + 1 });
      }
    }
    if (pending.length > PROSE_POLICY.maxValues) return false;
  }
  return true;
}
