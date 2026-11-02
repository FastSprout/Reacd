import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { RenderPort } from '../../core/render-port.js';
import type { ThemeAdapter } from '../contracts/theme-adapter.js';
import { UnsupportedAdapterComponentError } from
  '../../core/unsupported-adapter-component-error.js';
import { Issues } from '../issues/issues.renderer.js';

export function createRenderPort(
  adapter: ThemeAdapter,
): RenderPort<Record<string, unknown>> {
  const entries = new Map<string, (properties: unknown) => ReactNode>(
    Object.values(adapter.components).map(
      (entry) => [entry.name, entry.render] as const,
    ),
  );
  return {
    render(name, properties) {
      const render = entries.get(name);
      if (render === undefined) {
        throw new UnsupportedAdapterComponentError(adapter.id, name);
      }
      return render(properties);
    },
    report(issues) {
      return createElement(Issues, { issues });
    },
  };
}
