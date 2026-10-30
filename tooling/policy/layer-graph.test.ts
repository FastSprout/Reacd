import { describe, expect, it } from 'vitest';
import { checkLayerGraph } from './layer-graph.js';

const root = '/workspace';
const file = (name: string, source: string) => ({ path: `${root}/${name}`, source });

describe('owned production layer graph', () => {
  it('resolves source extensions, aliases and directory barrels', () => {
    expect(
      checkLayerGraph(
        [
          file('src/core/value.tsx', 'export type Value = string;'),
          file('src/core/namespace.ts', 'namespace Own {} import Alias = Own;'),
          file('src/schema/shared/index.ts', 'export {};'),
          file(
            'src/schema/use.ts',
            `import type { Value } from '@/core/value.js';
            export * from './shared';
            import 'zod';
            import './shape.css';`,
          ),
          file('src/index.ts', "export * from './schema/use.js';"),
          file('src/bootstrap.ts', "export * from './schema/use.js';"),
          file('src/adapter/trusted.ts', "import './shadcn/vendor/vendor.js';"),
          file('src/core/value.test.ts', "import '../state/invalid.js';"),
          file('src/adapter/shadcn/vendor/vendor.ts', 'import(computed);'),
          file('tooling/conformance/view.tsx', 'import(computed);'),
        ],
        root,
      ),
    ).toEqual([]);
  });

  it('rejects type-only cycles with exact source coordinates', () => {
    const issues = checkLayerGraph(
      [
        file('src/core/a.ts', "import type { B } from '@/core/b.js';"),
        file('src/core/b.ts', "\nexport type { A } from './a.js';"),
      ],
      root,
    );
    expect(issues).toEqual([
      {
        file: `${root}/src/core/b.ts`,
        line: 2,
        column: 1,
        rule: 'architecture-cycle',
        message: 'Dependency cycle: src/core/a.ts -> src/core/b.ts -> src/core/a.ts.',
      },
    ]);
  });

  it('detects literal import, require, re-export and self cycles', () => {
    const issues = checkLayerGraph(
      [
        file('src/core/a.ts', "import('./b.js');"),
        file('src/core/b.ts', "require('./c.js');"),
        file('src/core/c.ts', "export * from './a.js';"),
        file('src/core/self.ts', "type Self = import('./self.js').Self;"),
        file('src/core/alias.ts', "import Alias = require('./alias.js');"),
      ],
      root,
    );
    expect(issues.map((issue) => issue.rule)).toEqual([
      'architecture-cycle',
      'architecture-cycle',
      'architecture-cycle',
    ]);
  });

  it.each([
    "import type { X } from '../state/x.js';",
    "import X = require('../state/x.js');",
    "export * from '@fastsprout/reacd';",
    "export * from '@fastsprout/reacd/generative';",
    "import './__tests__/fixture.js';",
    "require('./file.test.js');",
    'import(computed);',
    'require(computed);',
    'import(42);',
    'require(42);',
  ])('fails closed for %s', (source) => {
    expect(checkLayerGraph([file('src/core/invalid.ts', `\n${source}`)], root)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          file: `${root}/src/core/invalid.ts`,
          line: 2,
          column: 1,
          rule: 'architecture',
        }),
      ]),
    );
  });

  it('reports missing internal sources, invalid layers and facade bodies', () => {
    expect(
      checkLayerGraph(
        [
          file('src/core/missing.ts', "import './absent.js';"),
          file('src/legacy/use.ts', ''),
          file('src/index.ts', 'export const escape = 1;'),
        ],
        root,
      ).map((issue) => issue.rule),
    ).toEqual(['architecture-resolution', 'architecture', 'facade']);
  });

  it('ignores a partial AST and permits converging acyclic dependencies', () => {
    expect(checkLayerGraph([file('src/core/broken.ts', 'import {')], root)).toEqual([
      expect.objectContaining({ rule: 'syntax' }),
    ]);
    expect(
      checkLayerGraph(
        [
          file('src/core/a.ts', "import './c.js';"),
          file('src/core/b.ts', "import './c.js';"),
          file('src/core/c.ts', ''),
        ],
        root,
      ),
    ).toEqual([]);
    expect(checkLayerGraph([], root)).toEqual([]);
  });

  for (const entry of ['index', 'contract', 'generative', 'bootstrap']) {
    it.each([
      "export * from './core/value.test.js';",
      "export type { Value } from '@/core/value.spec.js';",
      "export * from '../test-support/fixture.js';",
      "export * from '@/core/__tests__';",
      "export * from './core/../core/value.test.js';",
    ])(`${entry} cannot export a test dependency: %s`, (source) => {
      const path = `src/${entry}.ts`;
      expect(
        checkLayerGraph(
          [
            file(path, `\n${source}`),
            file('src/core/value.test.ts', 'export const value = 1;'),
          ],
          root,
        ),
      ).toEqual([
        {
          file: `${root}/${path}`,
          line: 2,
          column: 1,
          rule: 'architecture',
          message: 'Production code cannot depend on tests.',
        },
      ]);
    });
  }

  it('keeps one diagnostic for ordinary production-to-test imports', () => {
    expect(
      checkLayerGraph([file('src/core/value.ts', "import './value.test.js';")], root),
    ).toEqual([
      expect.objectContaining({
        file: `${root}/src/core/value.ts`,
        rule: 'architecture',
        message: 'Production code cannot depend on tests.',
      }),
    ]);
  });

  it.each(['core', 'schema', 'components', 'state'])(
    '%s cannot import a borrowed native UI module',
    (layer) => {
      expect(
        checkLayerGraph(
          [
            file(
              `src/${layer}/leak.ts`,
              "import type { Props } from '@/adapter/shadcn/vendor/ui/button.js';",
            ),
          ],
          root,
        ),
      ).toEqual([
        expect.objectContaining({
          file: `${root}/src/${layer}/leak.ts`,
          rule: 'architecture',
          message: 'Native UI and styling dependencies belong to renderer or adapter.',
        }),
      ]);
    },
  );

  it('does not expose borrowed vendor components through a public facade', () => {
    expect(
      checkLayerGraph(
        [file('src/index.ts', "export * from './adapter/shadcn/vendor/ui/button.js';")],
        root,
      ),
    ).toEqual([
      expect.objectContaining({
        file: `${root}/src/index.ts`,
        rule: 'architecture',
        message: 'Native UI and styling dependencies belong to renderer or adapter.',
      }),
    ]);
  });

  it('keeps renderer-to-adapter vendor imports rightward', () => {
    expect(
      checkLayerGraph(
        [
          file(
            'src/renderer/leak.ts',
            "import '@/adapter/shadcn/vendor/ui/button.js';",
          ),
        ],
        root,
      ),
    ).toEqual([
      expect.objectContaining({
        file: `${root}/src/renderer/leak.ts`,
        rule: 'architecture',
        message: 'Dependency points right: @/adapter/shadcn/vendor/ui/button.js.',
      }),
    ]);
  });
});
