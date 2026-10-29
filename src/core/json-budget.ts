import { DOCUMENT_POLICY } from './policy.js';
import type { ValidationIssue } from './render-port.js';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function inspectJsonBudget(input: unknown): ValidationIssue[] {
  const pending = [{ value: input, depth: 0 }];
  const seen = new WeakSet<object>();
  let values = 0;
  let characters = 0;
  for (let entry = pending.pop(); entry !== undefined; entry = pending.pop()) {
    values += 1;
    if (entry.depth > DOCUMENT_POLICY.maxDepth || values > DOCUMENT_POLICY.maxValues) {
      return [{ path: '$', message: 'Document depth or value budget exceeded.' }];
    }
    const { value, depth } = entry;
    if (typeof value === 'string') {
      characters += value.length;
    } else if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return [
          {
            path: '$',
            message: 'JSON must be a tree without cycles or shared objects.',
          },
        ];
      }
      seen.add(value);
      if (isArray(value)) {
        for (const child of value) pending.push({ value: child, depth: depth + 1 });
      } else {
        for (const [key, child] of Object.entries(value)) {
          characters += key.length;
          pending.push({ value: child, depth: depth + 1 });
        }
      }
    } else if (
      value !== null &&
      typeof value !== 'boolean' &&
      !(typeof value === 'number' && Number.isFinite(value))
    ) {
      return [{ path: '$', message: 'Only JSON values are allowed.' }];
    }
    if (characters > DOCUMENT_POLICY.maxCharacters) {
      return [{ path: '$', message: 'Document character budget exceeded.' }];
    }
  }
  return [];
}
