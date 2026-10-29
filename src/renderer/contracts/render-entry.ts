import { createElement } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { z } from 'zod';
import { Issues } from '../issues/issues.renderer.js';

export interface RenderEntry<Name extends string = string> {
  name: Name;
  render: (properties: unknown) => ReactNode;
}

export function renderEntry<Name extends string, P extends object>(
  name: Name,
  schema: z.ZodType<P>,
  component: ComponentType<P>,
): RenderEntry<Name> {
  return {
    name,
    render(properties) {
      const result = schema.safeParse(properties);
      if (!result.success) {
        return createElement(Issues, {
          issues: result.error.issues.map((issue) => ({
            path: [name, ...issue.path.map(String)].join('.'),
            message: issue.message,
          })),
        });
      }
      return createElement(component, result.data);
    },
  };
}
