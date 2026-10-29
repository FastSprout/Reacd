import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Splitter } from '../../components/splitter/index.js';
import type { SplitterProps } from '../../components/splitter/index.js';
import type { SplitterNode } from '../../schema/splitter/generative.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { panelLayoutSchemaFor } from '../../schema/splitter/splitter.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['panelLayout'], mode: 'readWrite' } as const;

export function BoundSplitter({
  node,
  panels,
  registry,
}: {
  node: SplitterNode<GenerativeNode>;
  panels: SplitterProps['panels'];
  registry: StateRegistry;
}): ReactNode {
  const schema = useMemo(() => panelLayoutSchemaFor(node.panels), [node.panels]);
  const result = useBoundValue(registry, node.value, TARGET, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Splitter
      label={node.label}
      orientation={node.orientation}
      disabled={node.disabled}
      panels={panels}
      value={result.data.value}
      onValueChange={result.data.write}
    />
  );
}
