import { useMemo } from 'react';
import { RadioGroup } from '../../components/radio-group/radio-group.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { choiceValueSchema, validChoiceValue } from '../../schema/shared/choices.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['text'], mode: 'readWrite' } as const;
export function BoundRadioGroup({
  node,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'RadioGroup' }>;
  registry: StateRegistry;
}) {
  const schema = useMemo(
    () => choiceValueSchema.refine((value) => validChoiceValue(node.items, value)),
    [node.items],
  );
  const result = useBoundValue(registry, node.value, TARGET, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <RadioGroup
      label={node.label}
      description={node.description}
      items={node.items}
      value={result.data.value}
      onValueChange={result.data.write}
      disabled={node.disabled}
      required={node.required}
      name={node.name}
      orientation={node.orientation}
    />
  );
}
