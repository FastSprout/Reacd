import { useMemo } from 'react';
import { CheckboxGroup } from '../../components/checkbox-group/checkbox-group.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import {
  choiceSelectionSchema,
  validChoiceSelection,
} from '../../schema/shared/choices.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['selection'], mode: 'readWrite' } as const;
export function BoundCheckboxGroup({
  node,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'CheckboxGroup' }>;
  registry: StateRegistry;
}) {
  const schema = useMemo(
    () =>
      choiceSelectionSchema.refine((value) =>
        validChoiceSelection({ items: node.items, max: node.max, value }),
      ),
    [node.items, node.max],
  );
  const result = useBoundValue(registry, node.value, TARGET, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <CheckboxGroup
      label={node.label}
      description={node.description}
      items={node.items}
      value={result.data.value}
      onValueChange={result.data.write}
      max={node.max}
      disabled={node.disabled}
      required={node.required}
      name={node.name}
      orientation={node.orientation}
    />
  );
}
