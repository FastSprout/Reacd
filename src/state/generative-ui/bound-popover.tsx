import type { ReactNode } from 'react';
import { Popover } from '../../components/popover/popover.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';
const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
export function BoundPopover({
  node,
  children,
  footer,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'Popover' }>;
  children: ReactNode;
  footer: ReactNode;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, node.open, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type: _type,
    open: _open,
    children: _children,
    footer: _footer,
    ...properties
  } = node;
  return (
    <Popover
      {...properties}
      open={result.data.value}
      onOpenChange={result.data.write}
      footer={footer}
    >
      {children}
    </Popover>
  );
}
