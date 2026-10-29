import type { ReactNode } from 'react';
import type { GenerativeNode } from '../../schema/generative-v2/generative-node.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { BoundSidebar } from './bound-sidebar.js';
import { BoundSplitter } from './bound-splitter.js';

export function SidebarSplitterNodeView({
  node,
  registry,
  renderChild,
}: {
  node: Extract<GenerativeNode, { type: 'Sidebar' | 'Splitter' }>;
  registry: StateRegistry;
  renderChild: (node: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  if (node.type === 'Sidebar')
    return (
      <BoundSidebar
        node={node}
        registry={registry}
        content={{
          children: node.children.map(renderChild),
          header: node.header?.map(renderChild),
          footer: node.footer?.map(renderChild),
          actions: node.actions?.map(renderChild),
          collapsedContent: node.collapsedContent?.map(renderChild),
        }}
      />
    );
  return (
    <BoundSplitter
      node={node}
      registry={registry}
      panels={node.panels.map((panel) => ({
        ...panel,
        content: panel.content.map(renderChild),
      }))}
    />
  );
}
