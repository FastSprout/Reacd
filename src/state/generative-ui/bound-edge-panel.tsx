import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { z } from 'zod';
import type { ValidationIssue } from '../../core/render-port.js';
import { Drawer } from '../../components/drawer/index.js';
import { Slideover } from '../../components/slideover/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const openSchema = z.boolean();
export function BoundEdgePanel({
  node,
  registry,
  children,
  footer,
}: {
  node: Extract<GenerativeNode, { type: 'Drawer' | 'Slideover' }>;
  registry: StateRegistry;
  children: ReactNode;
  footer: ReactNode;
}) {
  const target = useMemo(
    () => ({
      kinds: ['boolean'] as const,
      mode: 'readWrite' as const,
    }),
    [],
  );
  const result = useBoundValue(registry, node.open, target, openSchema);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type,
    open: _open,
    children: _children,
    footer: _footer,
    ...properties
  } = node;
  const Component = { Drawer, Slideover }[type];
  const feedback = issues.length > 0 ? <Issues issues={issues} /> : null;
  return (
    <>
      {!result.data.value && feedback}
      <Component
        {...properties}
        open={result.data.value}
        footer={footer}
        onOpenChange={(open) => {
          const changed = result.data.write(open);
          setIssues(changed.success ? [] : changed.issues);
        }}
      >
        {result.data.value && feedback}
        {children}
      </Component>
    </>
  );
}
