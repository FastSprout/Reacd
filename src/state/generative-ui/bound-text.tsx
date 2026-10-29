import { Text } from '../../components/text/text.js';
import type { TextProps } from '../../components/text/text.props.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { displayValueSchema } from '../../schema/generative-v2/binding-contracts.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['text', 'number', 'boolean'], mode: 'read' } as const;

export function BoundText({
  registry,
  reference,
  ...properties
}: {
  registry: StateRegistry;
  reference: StateBindingReference;
} & Omit<TextProps, 'children'>) {
  const result = useBoundValue(registry, reference, TARGET, displayValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return <Text {...properties}>{result.data.value}</Text>;
}
