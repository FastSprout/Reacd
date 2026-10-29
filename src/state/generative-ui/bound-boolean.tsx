import { Toggle } from '../../components/toggle/toggle.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

export function BoundBoolean({
  node,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'Toggle' }>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, node.checked, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Toggle
      label={node.label}
      disabled={node.disabled}
      checked={result.data.value}
      onCheckedChange={result.data.write}
    />
  );
}
