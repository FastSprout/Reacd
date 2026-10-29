import { useMemo } from 'react';
import type { z } from 'zod';
import { InputNumber } from '../../components/input-number/index.js';
import { INPUT_NUMBER_POLICY } from '../../core/input-number-policy.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { inputNumberNodeSchema } from '../../schema/input-number/index.js';
import { numericValueSchema } from '../../schema/input-number/input-number.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundInputNumber({
  node,
  registry,
}: {
  node: z.infer<typeof inputNumberNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({
      kinds: ['nullableNumber'] as const,
      mode: node.value.mode,
    }),
    [node.value.mode],
  );
  const schema = useMemo(
    () =>
      numericValueSchema
        .min(node.min ?? INPUT_NUMBER_POLICY.minimum)
        .max(node.max ?? INPUT_NUMBER_POLICY.maximum)
        .nullable(),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputNumber
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
