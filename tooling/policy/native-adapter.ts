import { relative, resolve } from 'node:path';
import { adapterOwnershipError } from './adapter-ownership.js';
import { internalPath } from './module-path.js';

export const SHARED_UI_ERROR =
  'Shared adapter UI is retired. Compose components in the selected SDK adapter.';
export const COMMON_CONTROL_CSS_ERROR =
  'Common renderer control CSS must not implement native adapter UI.';

export function isSharedAdapterPath(file: string, root: string): boolean {
  return relative(resolve(root, 'src'), file).startsWith('adapter/shared/');
}

export function nativeAdapterImportError(
  file: string,
  value: string,
  root: string,
): string | null {
  const target = internalPath(value.replace(/[?#].*$/, ''), file, root);
  if (target === null) return null;
  if (isSharedAdapterPath(target, root)) return SHARED_UI_ERROR;
  const path = relative(resolve(root, 'src/renderer'), target);
  if (path === 'styles.css' || /^styles\/.*\.css$/.test(path)) {
    return COMMON_CONTROL_CSS_ERROR;
  }
  return adapterOwnershipError(file, target, root);
}
