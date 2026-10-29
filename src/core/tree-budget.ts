import { TREE_POLICY } from './tree-policy.js';

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function boundedTree(input: unknown): boolean {
  if (!isArray(input)) return true;
  const pending = [{ value: input, level: 0 }];
  const seen = new WeakSet<object>();
  let nodes = 0;
  for (let entry = pending.pop(); entry !== undefined; entry = pending.pop()) {
    const { value, level } = entry;
    if (
      level > TREE_POLICY.maxDepth ||
      value.length > TREE_POLICY.maxNodes - nodes ||
      seen.has(value)
    )
      return false;
    seen.add(value);
    nodes += value.length;
    for (const child of value) {
      if (isArray(child)) return false;
      if (typeof child !== 'object' || child === null) continue;
      if (seen.has(child)) return false;
      seen.add(child);
      if ('children' in child && isArray(child.children))
        pending.push({ value: child.children, level: level + 1 });
    }
  }
  return true;
}
