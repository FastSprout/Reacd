import type { ReactNode } from 'react';
import { Sidebar } from '../../components/sidebar/index.js';
import type { SidebarProps } from '../../components/sidebar/index.js';
import type { SidebarNode } from '../../schema/sidebar/generative.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

export function BoundSidebar({
  node,
  content,
  registry,
}: {
  node: SidebarNode<GenerativeNode>;
  content: Pick<
    SidebarProps,
    'children' | 'header' | 'footer' | 'actions' | 'collapsedContent'
  >;
  registry: StateRegistry;
}): ReactNode {
  const desktop = useBoundValue(registry, node.open, TARGET, booleanValueSchema);
  const mobile = useBoundValue(registry, node.mobileOpen, TARGET, booleanValueSchema);
  if (!desktop.success) return <Issues issues={desktop.issues} />;
  if (!mobile.success) return <Issues issues={mobile.issues} />;
  const {
    type: _type,
    open: _open,
    mobileOpen: _mobile,
    children: _children,
    header: _header,
    footer: _footer,
    actions: _actions,
    collapsedContent: _collapsed,
    ...properties
  } = node;
  return (
    <Sidebar
      {...properties}
      {...content}
      open={desktop.data.value}
      onOpenChange={desktop.data.write}
      mobileOpen={mobile.data.value}
      onMobileOpenChange={mobile.data.write}
    />
  );
}
