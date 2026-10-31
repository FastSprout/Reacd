import { expect, it } from 'vitest';
import { checkLayerGraph } from './layer-graph.js';

const root = '/workspace';
const file = (name: string, source: string) => ({ path: `${root}/${name}`, source });

it('resolves adapter SDK imports without bypassing graph boundaries', () => {
  const sdk = '@fastsprout/reacd/adapter-runtime/';
  const sources = [
    file('src/core/a.ts', `import type { B } from '${sdk}core/b.js';`),
    file('src/core/b.ts', `export type { A } from '${sdk}core/a.js';`),
    file('src/schema/leak.ts', `import '${sdk}renderer/private.js';`),
    file('src/renderer/private.ts', 'export {};'),
    file('src/adapter/leak.ts', `import '${sdk}core/private.test.js';`),
  ];
  expect(checkLayerGraph(sources, root)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ rule: 'architecture-cycle' }),
      expect.objectContaining({
        message: `Dependency points right: ${sdk}renderer/private.js.`,
      }),
      expect.objectContaining({ message: 'Production code cannot depend on tests.' }),
    ]),
  );
  expect(
    checkLayerGraph(
      [
        file('src/core/value.ts', 'export type Value = string;'),
        file('src/adapter/use.ts', `import type { Value } from '${sdk}core/value.js';`),
      ],
      root,
    ),
  ).toEqual([]);
});

it.each([
  [
    'core',
    'adapter/shadcn/vendor/ui/button.js',
    'Adapter runtime exposes core, schema, components and renderer modules only.',
  ],
  [
    'renderer',
    'adapter/shadcn/vendor/ui/button.js',
    'Adapter runtime exposes core, schema, components and renderer modules only.',
  ],
  ['index.ts', 'core/value.test.js', 'Production code cannot depend on tests.'],
  [
    'index.ts',
    'adapter/shadcn/vendor/ui/button.js',
    'Adapter runtime exposes core, schema, components and renderer modules only.',
  ],
])('SDK paths retain %s ownership for %s', (owner, target, message) => {
  const entry = owner === 'index.ts' ? `src/${owner}` : `src/${owner}/leak.ts`;
  const source = `export * from '@fastsprout/reacd/adapter-runtime/${target}';`;
  expect(checkLayerGraph([file(entry, source)], root)).toEqual([
    expect.objectContaining({
      file: `${root}/${entry}`,
      line: 1,
      column: 1,
      rule: 'architecture',
      message,
    }),
  ]);
});

it.each([
  ['state/module.ts', 'state/store.js', 'import'],
  ['adapter/shadcn/module.ts', 'adapter/shadcn/vendor/ui/button.js', 'import'],
  ['index.ts', 'state/store.js', 'export type'],
  ['index.ts', 'renderer/../state/store.js', 'export type'],
  ['adapter/module.ts', 'core/policy', 'import'],
  ['adapter/module.ts', 'core//policy.js', 'import'],
  ['adapter/module.ts', 'core/policy.js?raw', 'import'],
  ['adapter/module.ts', 'core/policy.js#raw', 'import'],
  ['adapter/module.ts', 'core/./policy.js', 'import'],
  ['state/module.ts', 'core/../state/store.js', 'import'],
  ['adapter/module.ts', 'core/policy.ts', 'import'],
  ['adapter/module.ts', 'core/policy.js?raw.js', 'import'],
])('rejects an unexported SDK capability: %s -> %s', (owner, target, kind) => {
  const value = `@fastsprout/reacd/adapter-runtime/${target}`;
  const source =
    kind === 'export type'
      ? `export type { State } from '${value}';`
      : `import '${value}';`;
  expect(checkLayerGraph([file(`src/${owner}`, source)], root)).toEqual([
    expect.objectContaining({
      file: `${root}/src/${owner}`,
      line: 1,
      column: 1,
      rule: 'architecture',
      message:
        'Adapter runtime exposes core, schema, components and renderer modules only.',
    }),
  ]);
});
