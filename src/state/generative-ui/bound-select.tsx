import { useMemo } from 'react';
import type { z } from 'zod';
import { Select } from '../../components/select/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { selectNodeSchema } from '../../schema/select/index.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../../schema/selection/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

type SelectNode = z.infer<typeof selectNodeSchema>;
interface BoundSelectProps {
  readonly node: SelectNode;
  readonly registry: StateRegistry;
}

function BoundSingle({ node, registry }: BoundSelectProps) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(() => singleSelectionValueSchema(node.items), [node.items]);
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, readOnly, ...properties } = node;
  return (
    <Select
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

function BoundMultiple({ node, registry }: BoundSelectProps) {
  const target = useMemo(
    () => ({ kinds: ['selection'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(() => multipleSelectionValueSchema(node.items), [node.items]);
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, readOnly, ...properties } = node;
  return (
    <Select
      {...properties}
      mode="multiple"
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

export function BoundSelect(properties: BoundSelectProps) {
  return properties.node.mode === 'multiple' ? (
    <BoundMultiple {...properties} />
  ) : (
    <BoundSingle {...properties} />
  );
}
