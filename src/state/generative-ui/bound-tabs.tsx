import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ValidationIssue } from '../../core/render-port.js';
import { Tabs } from '../../components/tabs/tabs.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { tabValueSchema } from '../../schema/tabs/value.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundTabs({
  node,
  registry,
  renderChild,
}: {
  node: Extract<GenerativeNode, { type: 'Tabs' }>;
  registry: StateRegistry;
  renderChild: (node: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  const schema = useMemo(() => tabValueSchema(node.items), [node.items]);
  const target = useMemo(
    () => ({
      kinds: ['text'] as const,
      mode: node.value.mode,
    }),
    [node.value.mode],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <Tabs
        label={node.label}
        value={result.data.value}
        onValueChange={(value) => {
          const changed = result.data.write(value);
          setIssues(changed.success ? [] : changed.issues);
        }}
        orientation={node.orientation}
        activationMode={node.activationMode}
        items={node.items.map((item) => ({
          ...item,
          disabled:
            item.disabled ||
            (node.value.mode === 'read' && item.value !== result.data.value),
          content: item.content?.map(renderChild),
        }))}
      >
        {node.children.map(renderChild)}
      </Tabs>
    </>
  );
}
