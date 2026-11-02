import { relative, resolve } from 'node:path';

export const ADAPTER_OWNERSHIP_ERROR =
  'Adapter UI must not depend on shared UI or another adapter.';

function adapterScope(file: string, root: string): string | undefined {
  const path = relative(resolve(root, 'src/adapter'), file);
  return path.startsWith('../') || !path.includes('/') ? undefined : path.split('/')[0];
}

export function adapterOwnershipError(
  file: string,
  target: string,
  root: string,
): string | null {
  const owner = adapterScope(file, root);
  const dependency = adapterScope(target, root);
  if (owner === undefined || dependency === undefined || owner === dependency) {
    return null;
  }
  return ADAPTER_OWNERSHIP_ERROR;
}
