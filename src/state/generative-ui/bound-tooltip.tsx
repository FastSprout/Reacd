import { Tooltip } from '../../components/tooltip/tooltip.js';
import type { TooltipProps } from '../../components/tooltip/tooltip.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
export function BoundTooltip({
  node,
  reference,
  registry,
  children,
}: {
  node: Extract<GenerativeNode, { type: 'Tooltip' }>;
  reference: StateBindingReference;
  registry: StateRegistry;
  children: TooltipProps['children'];
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, open: _open, children: _children, ...properties } = node;
  return (
    <Tooltip {...properties} open={result.data.value} onOpenChange={result.data.write}>
      {children}
    </Tooltip>
  );
}
