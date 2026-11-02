import type { Layout } from 'react-resizable-panels';
import type { SplitterProps } from
  '@fastsprout/reacd/adapter-runtime/components/splitter/index.js';
import { panelLayoutSchemaFor } from
  '@fastsprout/reacd/adapter-runtime/schema/splitter/splitter.schema.js';
import { SPLITTER_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/splitter-policy.js';

export function sdkLayout(prefix: string, value: SplitterProps['value']): Layout {
  return Object.fromEntries(value.map(({ id, share }) => [`${prefix}-${id}`, share]));
}
export function declaredLayout(
  prefix: string,
  layout: Layout,
  panels: SplitterProps['panels'],
) {
  return panelLayoutSchemaFor(
    panels.map((panel) => ({
      ...panel,
      minShare: panel.minShare ?? SPLITTER_POLICY.minShare,
      maxShare: panel.maxShare ?? SPLITTER_POLICY.maxShare,
    })),
  ).safeParse(
    panels.map(({ id }) => ({
      id,
      share: layout[`${prefix}-${id}`],
    })),
  );
}
