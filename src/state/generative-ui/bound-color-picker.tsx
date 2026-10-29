import { useMemo } from 'react';
import type { z } from 'zod';
import { ColorPicker } from '../../components/color-picker/index.js';
import { colorValueSchema } from '../../schema/color-picker/index.js';
import type { colorPickerNodeSchema } from '../../schema/color-picker/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';
export function BoundColorPicker({
  node,
  registry,
}: {
  node: z.infer<typeof colorPickerNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(() => colorValueSchema(node.mode), [node.mode]);
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...props } = node;
  return (
    <ColorPicker
      {...props}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
