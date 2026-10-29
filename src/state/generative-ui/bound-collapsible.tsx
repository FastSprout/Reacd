import type { ReactNode } from 'react';
import { Collapsible } from '../../components/collapsible/collapsible.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
export function BoundCollapsible({
  node,
  registry,
  children,
}: {
  node: Extract<GenerativeNode, { type: 'Collapsible' }>;
  registry: StateRegistry;
  children: ReactNode;
}) {
  const result = useBoundValue(registry, node.open, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Collapsible
      label={node.label}
      open={result.data.value}
      onOpenChange={result.data.write}
      disabled={node.disabled}
      retainContent={node.retainContent}
      showTrigger={node.showTrigger}
    >
      {children}
    </Collapsible>
  );
}
