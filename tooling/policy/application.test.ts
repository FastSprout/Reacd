import { describe, expect, it } from 'vitest';
import { checkApplication } from './application.js';

const inspect = (source: string) => checkApplication('app.tsx', source);

describe('application boundary', () => {
  it('permits composition, hooks, fragments, and ordinary business logic', () => {
    expect(
      inspect(`
      import { useId, type ReactNode } from 'react';
      import { Button } from '@fastsprout/reacd';
      import { calculate } from './business.js';
      export const App = () => <><Button label="Save" onPress={calculate}/></>;
    `),
    ).toEqual([]);
  });

  it.each([
    '<div />',
    '<svg:rect />',
    '<Card style={{}} />',
    '<Card className="x" />',
    '<Card {...properties} />',
    '<Text dangerouslySetInnerHTML={{__html:"x"}} />',
    "import './app.css'",
    "import('./app.scss')",
    'import(path)',
    "import { x } from '@fastsprout/reacd/renderer/private'",
    "import { jsx } from 'react/jsx-runtime'",
    "import { createRoot } from 'react-dom/client'",
    "import { createElement as h } from 'react'",
    "import { 'createElement' as h } from 'react'",
    "import React from 'react'",
    "import * as R from 'react'",
    'document.createElement("div")',
    'window.document',
    'globalThis.document',
  ])('rejects an escape: %s', (source) => {
    expect(inspect(source).length).toBeGreaterThan(0);
  });

  it('rejects a directly imported SDK Label inside closed reacd composition', () => {
    const source = `
      import { Root as Label } from '@radix-ui/react-label';
      import { ReacdProvider, Text, VStack } from '@fastsprout/reacd';
      export function BoundaryProof() {
        return (
          <ReacdProvider>
            <VStack>
              <Label htmlFor="direct-vendor-label">Direct vendor label</Label>
              <Text>Closed component sibling</Text>
            </VStack>
          </ReacdProvider>
        );
      }
    `;
    expect(inspect(source)).toEqual([
      expect.objectContaining({
        rule: 'application',
        message: 'Vendor UI and styling integrations belong to renderer or adapter.',
      }),
    ]);
  });

  it.each([
    "import { Root as Label } from '@radix-ui/react-label'",
    "import { Select } from '@base-ui/react/select'",
    "import { Editor } from '@tiptap/core'",
    "import { DayPicker } from '@daypicker/react'",
    "import { ListBox } from 'react-aria-components'",
    "import { createRoot } from 'react-dom/client'",
    "import { icons } from 'lucide-react'",
    "import { OTPInput } from 'input-otp'",
    "import { clsx } from 'clsx'",
    "import { cva } from 'class-variance-authority'",
    "import { twMerge } from 'tailwind-merge'",
    "import 'tailwindcss'",
    "import plugin from '@tailwindcss/vite'",
    "export { Root as Label } from '@radix-ui/react-label'",
    "export * from '@radix-ui/react-label'",
    "export type { LabelProps } from '@radix-ui/react-label'",
    "const vendor = import('@radix-ui/react-label')",
    "const vendor = require('@radix-ui/react-label')",
    "type Props = import('@radix-ui/react-label').LabelProps",
  ])('rejects trusted UI integration imports: %s', (source) => {
    expect(inspect(source)).toEqual([
      expect.objectContaining({
        rule: 'application',
        message: 'Vendor UI and styling integrations belong to renderer or adapter.',
      }),
    ]);
  });

  it.each([
    "import { useMemo, type ReactNode } from 'react'",
    "import { atom } from 'jotai'",
    "import { atomWithStorage } from 'jotai/utils'",
    "import { Text } from '@fastsprout/reacd'",
    "import { renderGenerative } from '@fastsprout/reacd/generative'",
    "import { z } from 'zod'",
    "import { parseDate } from '@internationalized/date'",
    "import { calculate } from './business/react-label.js'",
    "import { calculate } from '@radix-ui-business/math'",
    "import { calculate } from '@daypicker/react-calendar'",
    "import { calculate } from 'clsx-business'",
  ])('permits public APIs and ordinary business dependencies: %s', (source) => {
    expect(inspect(source)).toEqual([]);
  });

  it('supports member components and namespaced component props', () => {
    expect(inspect('<Views.Card xml:lang="en" />')).toEqual([]);
  });

  it('reports invalid TSX', () => {
    expect(inspect('<Card>')).toEqual([expect.objectContaining({ rule: 'syntax' })]);
  });
});
