import { useMemo } from 'react';
import { Tree } from '../../components/tree/tree.js';
import { treeValueSchema, treeExpandedSchema } from '../../schema/tree/value.schema.js';
import type { TreeNodeDeclaration } from '../../schema/tree/generative.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundTree({
  node,
  registry,
}: {
  node: TreeNodeDeclaration;
  registry: StateRegistry;
}) {
  const selectedSchema = useMemo(
    () => treeValueSchema(node.items, node.multiple),
    [node.items, node.multiple],
  );
  const expandedSchema = useMemo(() => treeExpandedSchema(node.items), [node.items]);
  const selectedTarget = useMemo(
    () => ({
      kinds: ['selection'] as const,
      mode: node.value.mode,
    }),
    [node.value.mode],
  );
  const expandedTarget = useMemo(
    () => ({
      kinds: ['selection'] as const,
      mode: node.expanded.mode,
    }),
    [node.expanded.mode],
  );
  const selected = useBoundValue(registry, node.value, selectedTarget, selectedSchema);
  const expanded = useBoundValue(
    registry,
    node.expanded,
    expandedTarget,
    expandedSchema,
  );
  if (!selected.success) return <Issues issues={selected.issues} />;
  if (!expanded.success) return <Issues issues={expanded.issues} />;
  const { type: _type, value: _value, expanded: _expanded, ...properties } = node;
  return (
    <Tree
      {...properties}
      value={selected.data.value}
      expanded={expanded.data.value}
      onValueChange={selected.data.write}
      onExpandedChange={expanded.data.write}
      selectionReadOnly={node.value.mode === 'read' || node.selectionReadOnly}
      expansionReadOnly={node.expanded.mode === 'read' || node.expansionReadOnly}
    />
  );
}
