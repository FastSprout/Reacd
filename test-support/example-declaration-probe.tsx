import { Fragment, isValidElement, useId, useLayoutEffect } from 'react';
import { Provider } from 'jotai';
import { RenderContext } from '../src/components/shared/port.js';
import type { ReactNode } from 'react';
import type { z } from 'zod';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { UnsupportedAdapterComponentError } from
  '../src/core/unsupported-adapter-component-error.js';
import type { RenderPort } from '../src/core/render-port.js';
import { Issues } from '../src/renderer/issues/issues.renderer.js';
import { textComponentSchema as textSchema } from '../src/schema/text/text.schema.js';

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function elements(value: unknown): ReactNode {
  if (isValidElement(value)) return value;
  const children: readonly unknown[] = Array.isArray(value)
    ? value
    : record(value)
      ? Object.values(value)
      : [];
  return children.map((child, index) => (
    <Fragment key={index}>{elements(child)}</Fragment>
  ));
}

export function exampleDeclarationProbe() {
  const declarations = new Map<string, { kind: string; value: unknown }>();
  function Capture({ kind, value }: { kind: string; value: unknown }) {
    const id = useId();
    useLayoutEffect(() => {
      declarations.set(id, { kind, value });
      return () => {
        declarations.delete(id);
      };
    }, [id, kind, value]);
    return kind === 'Text' ? textSchema.parse(value).children : elements(value);
  }
  const port: RenderPort<Record<string, unknown>> = {
    render: (kind, value) => <Capture kind={kind} value={value} />,
    report: (issues) => <Issues issues={issues} />,
  };
  function Surface({ children }: { readonly children: ReactNode }) {
    return (
      <Provider>
        <RenderContext value={port}>{children}</RenderContext>
      </Provider>
    );
  }
  return {
    port,
    Surface,
    read<Properties>(kind: string, schema: z.ZodType<Properties>, label?: string) {
      for (const entry of declarations.values()) {
        if (entry.kind !== kind) continue;
        const properties = schema.parse(entry.value);
        if (
          label === undefined ||
          (record(properties) && properties['label'] === label)
        )
          return properties;
      }
      throw new Error(`Missing declaration: ${kind}/${label ?? ''}.`);
    },
    texts() {
      return [...declarations.values()]
        .filter((entry) => entry.kind === 'Text')
        .map((entry) => textSchema.parse(entry.value).children);
    },
  };
}

export function expectUnsupportedExample(view: ReactNode, componentName: string) {
  let diagnostic: unknown;
  try {
    renderToString(<ReacdProvider adapter={shadcnAdapter}>{view}</ReacdProvider>);
  } catch (error) {
    diagnostic = error;
  }
  expect(diagnostic).toBeInstanceOf(UnsupportedAdapterComponentError);
  expect(diagnostic).toMatchObject({ adapterId: 'shadcn-ui', componentName });
}
