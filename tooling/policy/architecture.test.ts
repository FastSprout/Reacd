import { describe, expect, it } from 'vitest';
import { LAYERS, checkArchitecture, checkFacade } from './architecture.js';
import { diagnostic } from './diagnostic.js';

const root = '/workspace';
const file = `${root}/src/components/button.tsx`;
const inspect = (source: string) => checkArchitecture(file, source, root);
const UI_IMPORTS = [
  "import { Root } from '@base-ui/react/combobox';",
  "export type { RootProps } from '@radix-ui/react-dialog';",
  "import type { Root } from 'react-dom/client';",
  "const load = import('tailwindcss');",
  "const style = require('class-variance-authority');",
];

describe('layer direction', () => {
  it('permits same-layer, leftward, and external imports', () => {
    expect(
      inspect(`
      import { z } from 'zod';
      import { x } from '../schema/button.js';
      import type { Y } from './types.js';
      export { value } from '../core/value.js';
      export const ownValue = 1;
    `),
    ).toEqual([]);
  });

  it.each([
    "import { x } from '../adapter/shadcn.js'",
    "import type { X } from '../state/provider.js'",
    "export * from '../renderer/index.js'",
    "export { x } from '@fastsprout/reacd/renderer/x.js'",
    "type X = import('../adapter/types.js').X",
    "const x = import('../adapter/x.js')",
    "const x = require('../state/x.js')",
    "import { x } from '@/state/x.js'",
    "import { x } from '/workspace/src/state/x.js'",
    "import { x } from '@fastsprout/reacd'",
    "import { x } from '../index.js'",
    "import { x } from '../legacy/x.js'",
    "import { x } from './__tests__/helper.js'",
    "import { x } from './button.test.js'",
    'const x = import(name)',
    'const x = require(name)',
    'const x = require()',
  ])('rejects an import bypass: %s', (source) => {
    expect(inspect(source)).toEqual([
      expect.objectContaining({ rule: 'architecture', file }),
    ]);
  });

  it('rejects implementation files outside declared layers', () => {
    expect(checkArchitecture('/workspace/src/legacy/x.ts', '', root)).toHaveLength(1);
  });

  it('reports parser failures without interpreting a partial AST', () => {
    expect(inspect('import {')).toEqual([expect.objectContaining({ rule: 'syntax' })]);
  });

  it('computes exact diagnostic positions', () => {
    expect(diagnostic('a.ts', 'first\n  second', 8, 'test', 'message')).toEqual({
      file: 'a.ts',
      line: 2,
      column: 3,
      rule: 'test',
      message: 'message',
    });
  });

  it.each([
    "'use server';",
    'console.log(1);',
    'export { local };',
    'import(computed);',
  ])('rejects non-facade entry statements: %s', (source) => {
    expect(checkFacade('/workspace/src/index.ts', source)).toEqual([
      expect.objectContaining({ rule: 'facade' }),
    ]);
  });
});

describe('native UI dependency boundary', () => {
  for (const layer of LAYERS) {
    it.each(UI_IMPORTS)(`${layer} enforces its SDK import capability: %s`, (source) => {
      const path = `${root}/src/${layer}/module.ts`;
      const issues = checkArchitecture(path, `\n${source}`, root);
      if (layer === 'renderer' || layer === 'adapter') expect(issues).toEqual([]);
      else
        expect(issues).toEqual([
          expect.objectContaining({ file: path, line: 2, rule: 'architecture' }),
        ]);
    });
  }

  it('preserves hooks, state, validation and business date imports everywhere', () => {
    for (const layer of LAYERS)
      expect(
        checkArchitecture(
          `${root}/src/${layer}/module.ts`,
          `import { useState } from 'react';
          import type { ReactNode } from 'react';
          import { atom } from 'jotai';
          import { z } from 'zod';
          import { CalendarDate } from '@internationalized/date';`,
          root,
        ),
      ).toEqual([]);
  });

  it('preserves the trusted stylesheet import from state bootstrap', () => {
    expect(
      checkArchitecture(
        `${root}/src/state/bootstrap.tsx`,
        "import '../renderer/styles.css';",
        root,
      ),
    ).toEqual([]);
  });

  it.each([
    "export { createRoot } from 'react-dom/client';",
    "export type { RootProps } from '@base-ui/react/combobox';",
  ])('rejects an SDK leak through a pure public facade: %s', (source) => {
    expect(checkFacade(`${root}/src/index.ts`, source)).toEqual([
      expect.objectContaining({ file: `${root}/src/index.ts`, rule: 'architecture' }),
    ]);
  });
});
