import { useMemo, useState } from 'react';
import { ContentToc } from '../../components/content-toc/index.js';
import type { ValidationIssue } from '../../core/render-port.js';
import type { ContentTocNode } from '../../schema/content-toc/generative.schema.js';
import { contentCurrentSchema } from '../../schema/content-outline/value.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundContentToc({
  node,
  registry,
}: {
  node: ContentTocNode;
  registry: StateRegistry;
}) {
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  const schema = useMemo(() => contentCurrentSchema(node.items), [node.items]);
  const target = useMemo(
    () => ({
      kinds: ['text'] as const,
      mode: node.currentKey.mode,
    }),
    [node.currentKey.mode],
  );
  const current = useBoundValue(registry, node.currentKey, target, schema);
  if (!current.success) return <Issues issues={current.issues} />;
  const { type: _type, currentKey: _key, ...props } = node;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <ContentToc
        {...props}
        currentKey={current.data.value}
        onCurrentChange={
          node.currentKey.mode === 'read'
            ? undefined
            : (key) => {
                const result = current.data.write(key);
                setIssues(result.success ? [] : result.issues);
                return result.success;
              }
        }
      />
    </>
  );
}
