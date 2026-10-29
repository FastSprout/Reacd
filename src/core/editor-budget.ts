import { EDITOR_BLOCK_TYPES, EDITOR_POLICY } from './editor-policy.js';

const BLOCK_TYPES: ReadonlySet<string> = new Set(EDITOR_BLOCK_TYPES);

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function dataValue(record: object, key: string): unknown {
  const value: unknown = Object.getOwnPropertyDescriptor(record, key)?.value;
  return value;
}

function validArrayProperties(record: object, length: number): boolean {
  for (const key in record)
    if (
      Object.hasOwn(record, key) &&
      (!/^(0|[1-9]\d*)$/u.test(key) || Number(key) >= length)
    )
      return false;
  return true;
}

export function boundedEditor(input: unknown): boolean {
  const pending = [{ value: input, depth: 0 }];
  const seen = new WeakSet<object>();
  let values = 1;
  let characters = 0;
  let blocks = 0;
  function enqueue(value: unknown, depth: number): boolean {
    values += 1;
    if (values > EDITOR_POLICY.maxValues || depth > EDITOR_POLICY.maxDepth)
      return false;
    pending.push({ value, depth });
    return true;
  }
  try {
    for (let entry = pending.pop(); entry !== undefined; entry = pending.pop()) {
      const { value, depth } = entry;
      if (typeof value === 'string') {
        characters += value.length;
      } else if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return false;
        seen.add(value);
        const prototype: unknown = Object.getPrototypeOf(value);
        if (isArray(value)) {
          const length = dataValue(value, 'length');
          if (
            prototype !== Array.prototype ||
            typeof length !== 'number' ||
            !Number.isSafeInteger(length) ||
            length < 0 ||
            length > EDITOR_POLICY.maxValues - values
          )
            return false;
          if (!validArrayProperties(value, length)) return false;
          for (let index = 0; index < length; index += 1) {
            const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
            if (descriptor === undefined || !('value' in descriptor)) return false;
            const child: unknown = descriptor.value;
            if (!enqueue(child, depth + 1)) return false;
          }
        } else {
          if (prototype !== Object.prototype && prototype !== null) return false;
          const type = dataValue(value, 'type');
          if (typeof type === 'string' && BLOCK_TYPES.has(type)) {
            blocks += 1;
            if (blocks > EDITOR_POLICY.maxBlocks) return false;
          }
          for (const key in value) {
            if (!Object.hasOwn(value, key)) continue;
            characters += key.length;
            if (characters > EDITOR_POLICY.maxCharacters) return false;
            const property = Object.getOwnPropertyDescriptor(value, key);
            if (property === undefined || !('value' in property)) return false;
            const child: unknown = property.value;
            if (!enqueue(child, depth + 1)) return false;
          }
        }
      } else if (
        value !== null &&
        typeof value !== 'boolean' &&
        !(typeof value === 'number' && Number.isFinite(value))
      )
        return false;
      if (characters > EDITOR_POLICY.maxCharacters) return false;
    }
    return true;
  } catch {
    return false;
  }
}
