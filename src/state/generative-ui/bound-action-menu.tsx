import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { z } from 'zod';
import type { ValidationIssue } from '../../core/render-port.js';
import { DropdownMenu } from '../../components/dropdown-menu/index.js';
import { ContextMenu } from '../../components/context-menu/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';
import { useMenuItems } from './action-menu/use-menu-items.js';
const booleanSchema = z.boolean();

export function BoundActionMenu({
  node,
  registry,
  actions,
  children,
}: {
  node: Extract<GenerativeNode, { type: 'DropdownMenu' | 'ContextMenu' }>;
  registry: StateRegistry;
  actions: GenerativeActions;
  children?: ReactNode;
}): ReactNode {
  const target = useMemo(
    () => ({
      kinds: ['boolean'] as const,
      mode: 'readWrite' as const,
    }),
    [],
  );
  const open = useBoundValue(registry, node.open, target, booleanSchema);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  const items = useMenuItems(node.items, registry, actions, setIssues);
  if (!open.success) return <Issues issues={open.issues} />;
  if (!items.success) return <Issues issues={items.issues} />;
  const properties = {
    label: node.label,
    disabled: node.disabled,
    open: open.data.value,
    items: items.data,
    onOpenChange(value: boolean) {
      const changed = open.data.write(value);
      setIssues(changed.success ? [] : changed.issues);
    },
  };
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      {node.type === 'DropdownMenu' ? (
        <DropdownMenu {...properties} modal={node.modal} />
      ) : (
        <ContextMenu {...properties}>{children}</ContextMenu>
      )}
    </>
  );
}
