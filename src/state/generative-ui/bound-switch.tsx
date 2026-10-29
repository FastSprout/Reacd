import { useMemo } from 'react';
import type { z } from 'zod';
import { Switch } from '../../components/switch/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { switchNodeSchema } from '../../schema/switch/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundSwitch({
  node,
  registry,
}: {
  node: z.infer<typeof switchNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['boolean'] as const, mode: node.checked.mode }),
    [node.checked.mode],
  );
  const result = useBoundValue(registry, node.checked, target, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, checked: _checked, readOnly, ...properties } = node;
  return (
    <Switch
      {...properties}
      checked={result.data.value}
      onCheckedChange={result.data.write}
      readOnly={readOnly || node.checked.mode === 'read'}
    />
  );
}
