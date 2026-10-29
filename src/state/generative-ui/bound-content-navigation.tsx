import { useMemo, useState } from 'react';
import { ContentNavigation } from '../../components/content-navigation/index.js';
import type { ValidationIssue } from '../../core/render-port.js';
import type {
  ContentNavigationNode,
} from '../../schema/content-navigation/generative.schema.js';
import {
  contentCurrentSchema,
  contentExpansionSchema,
} from '../../schema/content-outline/value.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundContentNavigation({
  node,
  registry,
}: {
  node: ContentNavigationNode;
  registry: StateRegistry;
}) {
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  const currentSchema = useMemo(() => contentCurrentSchema(node.items), [node.items]);
  const expandedSchema = useMemo(
    () => contentExpansionSchema(node.items),
    [node.items],
  );
  const currentTarget = useMemo(
    () => ({
      kinds: ['text'] as const,
      mode: node.currentKey.mode,
    }),
    [node.currentKey.mode],
  );
  const expandedTarget = useMemo(
    () => ({
      kinds: ['selection'] as const,
      mode: node.expandedKeys.mode,
    }),
    [node.expandedKeys.mode],
  );
  const current = useBoundValue(
    registry,
    node.currentKey,
    currentTarget,
    currentSchema,
  );
  const expanded = useBoundValue(
    registry,
    node.expandedKeys,
    expandedTarget,
    expandedSchema,
  );
  if (!current.success) return <Issues issues={current.issues} />;
  if (!expanded.success) return <Issues issues={expanded.issues} />;
  const { type: _type, currentKey: _current, expandedKeys: _expanded, ...props } = node;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <ContentNavigation
        {...props}
        currentKey={current.data.value}
        expandedKeys={expanded.data.value}
        expansionReadOnly={node.expandedKeys.mode === 'read' || node.expansionReadOnly}
        onCurrentChange={
          node.currentKey.mode === 'read'
            ? undefined
            : (key) => {
                const result = current.data.write(key);
                setIssues(result.success ? [] : result.issues);
                return result.success;
              }
        }
        onExpandedKeysChange={(keys) => {
          const result = expanded.data.write(keys);
          setIssues(result.success ? [] : result.issues);
        }}
      />
    </>
  );
}
