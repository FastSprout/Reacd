import { useMemo } from 'react';
import { Listbox } from '../../components/listbox/index.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../../schema/selection/index.js';
import type { ListboxNode } from '../../schema/listbox/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';

interface BoundListboxProps {
  readonly node: ListboxNode;
  readonly registry: StateRegistry;
}

function BoundSingleListbox({ node, registry }: BoundListboxProps) {
  const schema = useMemo(() => singleSelectionValueSchema(node.items), [node.items]);
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, ...properties } = node;
  return (
    <Listbox
      {...properties}
      mode="single"
      value={result.data.value}
      onValueChange={(next) => result.data.write(next).success}
      readOnly={node.readOnly || node.value.mode === 'read'}
    />
  );
}

function BoundMultipleListbox({ node, registry }: BoundListboxProps) {
  const schema = useMemo(() => multipleSelectionValueSchema(node.items), [node.items]);
  const target = useMemo(
    () => ({ kinds: ['selection'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, ...properties } = node;
  return (
    <Listbox
      {...properties}
      mode="multiple"
      value={result.data.value}
      onValueChange={(next) => result.data.write(next).success}
      readOnly={node.readOnly || node.value.mode === 'read'}
    />
  );
}

export function BoundListbox(properties: BoundListboxProps) {
  return properties.node.mode === 'multiple' ? (
    <BoundMultipleListbox {...properties} />
  ) : (
    <BoundSingleListbox {...properties} />
  );
}
