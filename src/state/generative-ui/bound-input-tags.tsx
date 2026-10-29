import { useMemo } from 'react';
import type { z } from 'zod';
import { InputTags } from '../../components/input-tags/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { tagsValueSchema } from '../../schema/input-tags/index.js';
import type { inputTagsNodeSchema } from '../../schema/input-tags/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundInputTags({
  node,
  registry,
}: {
  node: z.infer<typeof inputTagsNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['selection'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => tagsValueSchema(node.maxTags, node.maxTagLength),
    [node.maxTags, node.maxTagLength],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputTags
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
