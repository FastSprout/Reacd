import type { z } from 'zod';
import type { RenderPort } from '../src/core/render-port.js';
import { Issues } from '../src/renderer/issues/issues.renderer.js';

export function declarationProbe<Properties extends { readonly label: string }>(
  schema: z.ZodType<Properties>,
) {
  const declarations = new Map<string, Properties>();
  const port: RenderPort<Record<string, unknown>> = {
    render(_name, value) {
      const properties = schema.parse(value);
      declarations.set(properties.label, properties);
      return null;
    },
    report: (issues) => <Issues issues={issues} />,
  };
  return {
    port,
    read(label: string): Properties {
      const properties = declarations.get(label);
      if (!properties) throw new Error(`Missing declaration: ${label}.`);
      return properties;
    },
  };
}
