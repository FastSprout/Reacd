import { useMemo } from 'react';
import type { z } from 'zod';
import { Textarea } from '../../components/textarea/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { textareaValueSchema } from '../../schema/textarea/index.js';
import type { textareaNodeSchema } from '../../schema/textarea/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundTextarea({
  node,
  registry,
}: {
  node: z.infer<typeof textareaNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(() => textareaValueSchema(node.maxLength), [node.maxLength]);
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <Textarea
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
