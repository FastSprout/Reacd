import { describe, expect, it } from 'vitest';
import { checkArchitecture } from './architecture.js';

const root = '/workspace';
const inspect = (layer: string, source: string) =>
  checkArchitecture(`${root}/src/${layer}/module.ts`, source, root);

describe('React ownership inside the six layers', () => {
  it.each([
    "import { useState } from 'react';",
    "import React from 'react';",
    "import * as React from 'react';",
    "import 'react';",
    "import { type ReactNode } from 'react';",
    "export { type ReactNode } from 'react';",
    "export { Children } from 'react';",
    "export * from 'react';",
    "export {} from 'react';",
    "const React = require('react');",
    "const React = import('react');",
    "import React = require('react');",
  ])('rejects React runtime in core: %s', (source) => {
    expect(inspect('core', `\n${source}`)).toEqual([
      expect.objectContaining({
        rule: 'architecture',
        line: 2,
        column: source.startsWith('const') ? 15 : 1,
      }),
    ]);
  });

  it.each([
    "import type React from 'react';",
    "import type { ReactNode } from 'react';",

    "export type { ReactNode } from 'react';",

    "export type * from 'react';",
    "type Node = import('react').ReactNode;",
    "import type React = require('react');",
  ])('preserves React types in core: %s', (source) => {
    expect(inspect('core', source)).toEqual([]);
  });

  it.each([
    "import { Children, isValidElement } from 'react';",
    "import { Children as Traverse, type ReactNode } from 'react';",
    "export { isValidElement } from 'react';",
    "export { 'Children' as Traverse } from 'react';",
    "export { Children, type ReactNode } from 'react';",
  ])('permits schema validation and traversal: %s', (source) => {
    expect(inspect('schema', source)).toEqual([]);
  });

  it.each([
    "import { useState } from 'react';",
    "import { createElement } from 'react';",
    "import { Children, createElement as construct } from 'react';",
    "export { useMemo } from 'react';",
    "import * as React from 'react';",
    "import React from 'react';",
    "const React = import('react');",
    "const React = require('react');",
    "export * from 'react';",
    "import 'react/jsx-runtime';",
    "import { type ReactNode } from 'react';",
    "export { type ReactNode } from 'react';",
  ])('rejects schema hooks and construction: %s', (source) => {
    expect(inspect('schema', source)).toEqual([
      expect.objectContaining({ rule: 'architecture' }),
    ]);
  });

  it('permits React hooks in components, renderer, adapter and state', () => {
    for (const layer of ['components', 'renderer', 'adapter', 'state']) {
      expect(inspect(layer, "import { useState } from 'react';")).toEqual([]);
    }
  });
});

describe('concrete declaration ownership', () => {
  const file = `${root}/src/components/button/button.tsx`;
  it.each([
    "import { Card } from '../card/card.js';",
    "export type { CardProps } from '../card/index.js';",
    "import { Card } from '@fastsprout/reacd/adapter-runtime/components/card/card.js';",
    "import { Card } from '../index.js';",
    "import { declarations } from '../catalog.js';",
  ])('rejects another component or assembly bypass: %s', (source) => {
    expect(checkArchitecture(file, source, root)).toEqual([
      expect.objectContaining({ rule: 'architecture' }),
    ]);
  });

  it.each([
    "import type { ButtonProps } from './button.props.js';",
    "import { useDeclaration } from '../shared/use-declaration.js';",
    "import { guard } from '../jsx/guard.js';",
    "import type { Node } from '../../core/node.js';",
  ])('permits own module and explicit shared infrastructure: %s', (source) => {
    expect(checkArchitecture(file, source, root)).toEqual([]);
  });

  it('permits explicit registry and barrel assembly only', () => {
    for (const name of [
      'index.ts',
      'catalog.ts',
      'chat-catalog.ts',
      'composition-catalog.ts',
      'form-catalog.ts',
      'component-names.ts',
    ]) {
      expect(
        checkArchitecture(
          `${root}/src/components/${name}`,
          "export { Card } from './card/card.js';",
          root,
        ),
      ).toEqual([]);
    }
    expect(
      checkArchitecture(
        `${root}/src/components/shared/leak.ts`,
        "import { Card } from '../card/card.js';",
        root,
      ),
    ).toHaveLength(1);
  });
});
