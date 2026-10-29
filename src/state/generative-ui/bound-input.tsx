import { useMemo } from 'react';
import type { z } from 'zod';
import { Input } from '../../components/input/input.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { inputValueSchema } from '../../schema/input/value.schema.js';
import type { inputNodeSchema } from '../../schema/input/generative.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundInput({
  node,
  registry,
}: {
  node: z.infer<typeof inputNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => inputValueSchema(node.maxLength, node.inputType),
    [node.maxLength, node.inputType],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <Input
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
