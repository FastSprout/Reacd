import { useMemo } from 'react';
import { InputMenu } from '../../components/input-menu/index.js';
import type { InputMenuNode } from '../../schema/input-menu/index.js';
import { menuTextSchema } from '../../schema/form-menu-shared/text.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';
import { BoundInputMenuOpen } from './bound-input-menu-open.js';

export function BoundInputMenu({
  node,
  registry,
}: {
  node: InputMenuNode;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const result = useBoundValue(registry, node.value, target, menuTextSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, open, readOnly, ...rest } = node;
  const properties = {
    ...rest,
    value: result.data.value,
    onValueChange: (value: string) => result.data.write(value).success,
    readOnly: readOnly || node.value.mode === 'read',
  };
  return open === undefined ? (
    <InputMenu {...properties} />
  ) : (
    <BoundInputMenuOpen properties={properties} reference={open} registry={registry} />
  );
}
