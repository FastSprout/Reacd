import type { ReactNode } from 'react';
import {
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  DashboardResizeHandle,
  DashboardSearchButton,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundDashboardGroup } from './bound-dashboard-group.js';
import { BoundDashboardSearch } from './bound-dashboard-search.js';

type DashboardNode = Extract<GenerativeNode, { type: `Dashboard${string}` }>;

export function isDashboardNode(node: GenerativeNode): node is DashboardNode {
  return node.type.startsWith('Dashboard');
}

export function DashboardNodeView({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: DashboardNode;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  switch (node.type) {
    case 'DashboardGroup':
      return (
        <BoundDashboardGroup
          node={node}
          registry={registry}
          regions={node.regions.map((region) => ({
            ...region,
            content: region.content.map(renderChild),
          }))}
        >
          {node.children.map(renderChild)}
        </BoundDashboardGroup>
      );
    case 'DashboardSidebar':
      return (
        <DashboardSidebar
          description={node.description}
          header={node.header?.map(renderChild)}
          footer={node.footer?.map(renderChild)}
          actions={node.actions?.map(renderChild)}
          collapsedContent={node.collapsedContent?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </DashboardSidebar>
      );
    case 'DashboardPanel':
      return (
        <DashboardPanel
          label={node.label}
          header={node.header?.map(renderChild)}
          footer={node.footer?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </DashboardPanel>
      );
    case 'DashboardNavbar':
      return (
        <DashboardNavbar
          title={node.title}
          leading={node.leading?.map(renderChild)}
          trailing={node.trailing?.map(renderChild)}
          start={node.start?.map(renderChild)}
          end={node.end?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </DashboardNavbar>
      );
    case 'DashboardToolbar':
      return (
        <DashboardToolbar
          label={node.label}
          start={node.start?.map(renderChild)}
          end={node.end?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </DashboardToolbar>
      );
    case 'DashboardSidebarCollapse':
    case 'DashboardSidebarToggle':
    case 'DashboardResizeHandle': {
      const { type, ...properties } = node;
      const Component = {
        DashboardSidebarCollapse,
        DashboardSidebarToggle,
        DashboardResizeHandle,
      }[type];
      return <Component {...properties} />;
    }
    case 'DashboardSearch':
      return <BoundDashboardSearch node={node} registry={registry} actions={actions} />;
    case 'DashboardSearchButton':
      return (
        <DashboardSearchButton
          label={node.label}
          disabled={node.disabled}
          onPress={() => {
            const handler = Object.hasOwn(actions, node.action)
              ? actions[node.action]
              : undefined;
            if (typeof handler === 'function') handler({ state: registry });
          }}
        />
      );
  }
}
