import { useMemo } from 'react';
import type { SelectMenuNode } from '../../schema/select-menu/index.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../../schema/selection/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';
import { BoundSelectMenuChannels } from './bound-select-menu-channels.js';

interface BindingProps {
  node: SelectMenuNode;
  registry: StateRegistry;
}

function BoundSelectMenuSingle({ node, registry }: BindingProps) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(() => singleSelectionValueSchema(node.items), [node.items]);
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type: _type,
    value: _value,
    query: _query,
    open: _open,
    mode: _mode,
    readOnly,
    ...properties
  } = node;
  return (
    <BoundSelectMenuChannels
      node={node}
      registry={registry}
      properties={{
        ...properties,
        mode: 'single',
        value: result.data.value,
        onValueChange: (value: string) => result.data.write(value).success,
        readOnly: readOnly || node.value.mode === 'read',
      }}
    />
  );
}

function BoundSelectMenuMultiple({ node, registry }: BindingProps) {
  const target = useMemo(
    () => ({ kinds: ['selection'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(() => multipleSelectionValueSchema(node.items), [node.items]);
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type: _type,
    value: _value,
    query: _query,
    open: _open,
    mode: _mode,
    readOnly,
    ...properties
  } = node;
  return (
    <BoundSelectMenuChannels
      node={node}
      registry={registry}
      properties={{
        ...properties,
        mode: 'multiple',
        value: result.data.value,
        onValueChange: (value: readonly string[]) => result.data.write(value).success,
        readOnly: readOnly || node.value.mode === 'read',
      }}
    />
  );
}

export function BoundSelectMenu(properties: BindingProps) {
  return properties.node.mode === 'multiple' ? (
    <BoundSelectMenuMultiple {...properties} />
  ) : (
    <BoundSelectMenuSingle {...properties} />
  );
}
