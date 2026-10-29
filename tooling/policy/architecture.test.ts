import { describe, expect, it } from 'vitest';
import { checkArchitecture } from './architecture.js';
import { diagnostic } from './diagnostic.js';

const root = '/workspace';
const file = `${root}/src/components/button.tsx`;
const inspect = (source: string) => checkArchitecture(file, source, root);

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
    "export { x } from 'reacd/renderer/x.js'",
    "type X = import('../adapter/types.js').X",
    "const x = import('../adapter/x.js')",
    "const x = require('../state/x.js')",
    "import { x } from '@/state/x.js'",
    "import { x } from '/workspace/src/state/x.js'",
    "import { x } from 'reacd'",
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
});
