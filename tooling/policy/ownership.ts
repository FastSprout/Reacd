import { relative, resolve } from 'node:path';
import type { ImportReference } from './imports.js';

const SCHEMA_REACT_CAPABILITIES = new Set(['Children', 'isValidElement']);
const COMPONENT_INFRASTRUCTURE = new Set(['shared', 'jsx']);
const COMPONENT_ASSEMBLIES = new Set([
  'index.ts',
  'catalog.ts',
  'chat-catalog.ts',
  'composition-catalog.ts',
  'form-catalog.ts',
  'component-names.ts',
]);

export function reactOwnershipError(
  layer: string | undefined,
  reference: ImportReference,
): string | null {
  const { value, typeOnly, runtimeNames } = reference;
  if (value !== 'react' && !value?.startsWith('react/')) return null;
  if (typeOnly) return null;
  if (layer === 'core') return 'Core permits React types, never React runtime.';
  if (layer !== 'schema') return null;
  if (
    value === 'react' &&
    runtimeNames !== undefined &&
    runtimeNames.length > 0 &&
    runtimeNames.every((name) => SCHEMA_REACT_CAPABILITIES.has(name))
  )
    return null;
  return 'Schema permits named React validation and traversal only.';
}

export function componentOwnershipError(
  file: string,
  target: string,
  root: string,
): string | null {
  const base = resolve(root, 'src/components');
  const source = relative(base, file);
  const dependency = relative(base, target);
  if (source.startsWith('../') || dependency.startsWith('../')) return null;
  if (COMPONENT_ASSEMBLIES.has(source)) return null;
  const sourceOwner = source.split('/').slice(0, 1).join('/');
  const dependencyOwner = dependency.split('/').slice(0, 1).join('/');
  if (sourceOwner === dependencyOwner || COMPONENT_INFRASTRUCTURE.has(dependencyOwner))
    return null;
  return 'Concrete declarations depend on their own module or shared infrastructure.';
}
