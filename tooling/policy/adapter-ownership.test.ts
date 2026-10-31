import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { adapterOwnershipError, ADAPTER_OWNERSHIP_ERROR } from './adapter-ownership.js';

const root = process.cwd();

it.each([
  ['src/core/value.ts', 'src/adapter/mui/button.tsx'],
  ['src/adapter/mui/button.tsx', 'src/renderer/value.ts'],
  ['src/adapter/mui/button.tsx', 'src/adapter/mui/input.tsx'],
  ['src/adapter/mui/button.tsx', 'src/adapter/shared/value.ts'],
])('preserves legal ownership checks from %s to %s', (from, target) => {
  expect(
    adapterOwnershipError(resolve(root, from), resolve(root, target), root),
  ).toBeNull();
});

it.each([
  ['mui', 'shadcn'],
  ['shadcn', 'mui'],
  ['shared', 'mui'],
  ['shared', 'shadcn'],
])('rejects cross-owner access from %s to %s', (from, target) => {
  expect(
    adapterOwnershipError(
      resolve(root, `src/adapter/${from}/button.tsx`),
      resolve(root, `src/adapter/${target}/input.tsx`),
      root,
    ),
  ).toBe(ADAPTER_OWNERSHIP_ERROR);
});
