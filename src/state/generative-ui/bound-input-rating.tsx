import { useMemo } from 'react';
import type { z } from 'zod';
import { InputRating } from '../../components/input-rating/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { ratingValueSchema } from '../../schema/input-rating/index.js';
import type { inputRatingNodeSchema } from '../../schema/input-rating/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundInputRating({
  node,
  registry,
}: {
  node: z.infer<typeof inputRatingNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['number'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => ratingValueSchema(node.length, node.step),
    [node.length, node.step],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputRating
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
