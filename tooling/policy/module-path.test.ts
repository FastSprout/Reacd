import { expect, it } from 'vitest';
import { internalPath, isCodeReference, resolveModule } from './module-path.js';

it('resolves scoped, legacy, source and absolute aliases without reading disk', () => {
  for (const [specifier, expected] of [
    ['@fastsprout/reacd', '/repo/src/index.ts'],
    ['reacd', '/repo/src/index.ts'],
    ['@fastsprout/reacd/generative', '/repo/src/generative'],
    ['@/core/value.js', '/repo/src/core/value.js'],
    ['./value.js', '/repo/src/core/value.js'],
    ['/repo/src/core/value.js', '/repo/src/core/value.js'],
  ])
    expect(internalPath(specifier ?? '', '/repo/src/core/a.ts', '/repo')).toBe(
      expected,
    );
  expect(internalPath('node:fs', '/repo/src/core/a.ts', '/repo')).toBeNull();
});

it('distinguishes source modules from assets', () => {
  for (const reference of ['/a', '/a.js', '/a.tsx', '/a.d.ts', '/a.mts', '/a.cts'])
    expect(isCodeReference(reference)).toBe(true);
  expect(isCodeReference('/style.css')).toBe(false);
});

it.each([
  ['/a.js', '/a.ts'],
  ['/a.jsx', '/a.tsx'],
  ['/a.js', '/a.d.ts'],
  ['/a.mjs', '/a.mts'],
  ['/a.cjs', '/a.cts'],
  ['/a', '/a/index.ts'],
  ['/a', '/a/index.tsx'],
  ['/a', '/a/index.d.ts'],
  ['/a.ts', '/a.ts'],
])('resolves %s to the existing owned source %s', (reference, path) => {
  const node = { name: 'Owned module' };
  expect(resolveModule(reference, new Map([[path, node]]))).toBe(node);
});

it('returns no module for unresolved and unsupported source names', () => {
  expect(resolveModule('/missing.js', new Map())).toBeUndefined();
  expect(resolveModule('/missing.css', new Map())).toBeUndefined();
});
