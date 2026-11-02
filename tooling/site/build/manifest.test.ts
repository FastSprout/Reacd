import { expect, it } from 'vitest';
import { assertLazyMaterialRuntime } from './manifest.js';

const manifest = {
  client: {
    file: 'assets/site.js',
    src: 'tooling/site/runtime/client.tsx',
    isEntry: true,
    imports: ['shared'],
    dynamicImports: ['material'],
  },
  shared: { file: 'assets/shared.js', imports: ['client'] },
  material: {
    file: 'assets/material.js',
    src: 'src/adapter/mui/mui.adapter.ts',
    isDynamicEntry: true,
  },
};
const modules = {
  'assets/site.js': ['/repo/tooling/site/runtime/client.tsx'],
  'assets/shared.js': ['/repo/src/components/jsx/runtime.ts'],
  'assets/material.js': ['/repo/node_modules/@mui/material/Button.js'],
};

it('accepts transitive shared cycles with an explicitly lazy native SDK', () => {
  expect(() => assertLazyMaterialRuntime(manifest, modules)).not.toThrow();
});
it.each([
  '/repo/node_modules/@mui/material/Button.js',
  'C:\\repo\\node_modules\\@emotion\\react\\index.js',
  '/repo/src/adapter/mui/mui.adapter.ts',
])('rejects real eager SDK ownership regardless of chunk names: %s', (id) => {
  expect(() =>
    assertLazyMaterialRuntime(manifest, {
      ...modules,
      'assets/shared.js': [id],
    }),
  ).toThrow('eagerly loads Material UI');
});
it('rejects missing entries, references, provenance and dynamic SDK boundaries', () => {
  expect(() => assertLazyMaterialRuntime({}, {})).toThrow('site entry');
  expect(() =>
    assertLazyMaterialRuntime(
      {
        ...manifest,
        another: manifest.client,
      },
      modules,
    ),
  ).toThrow('site entry');
  expect(() =>
    assertLazyMaterialRuntime(
      {
        ...manifest,
        shared: { file: 'assets/shared.js', imports: ['missing'] },
      },
      modules,
    ),
  ).toThrow('missing chunk');
  expect(() => assertLazyMaterialRuntime(manifest, {})).toThrow('provenance');
  expect(() =>
    assertLazyMaterialRuntime(
      {
        ...manifest,
        client: { ...manifest.client, dynamicImports: [] },
      },
      modules,
    ),
  ).toThrow('dynamic entry');
  expect(() =>
    assertLazyMaterialRuntime(
      {
        ...manifest,
        material: { ...manifest.material, isDynamicEntry: false },
      },
      modules,
    ),
  ).toThrow('dynamic entry');
  expect(() =>
    assertLazyMaterialRuntime(
      {
        ...manifest,
        material: { file: 'assets/material.js', isDynamicEntry: true },
      },
      modules,
    ),
  ).toThrow('dynamic entry');
});
it.each([null, [], { client: { file: 1 } }])(
  'validates external manifest and provenance data %s',
  (value) => {
    expect(() => assertLazyMaterialRuntime(value, modules)).toThrow();
    expect(() => assertLazyMaterialRuntime(manifest, value)).toThrow();
  },
);
