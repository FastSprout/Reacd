import { ColorModeNodeView } from './color-mode-node-view.js';
import { BoundLocaleSelect } from './bound-locale-select.js';
import { CarouselNodeView } from './carousel-node-view.js';
import { BoundMarquee } from './bound-marquee.js';
import { GenerativeChart } from './generative-chart.js';
import { GenerativeTable } from './generative-table.js';
import type { ReactNode } from 'react';
import { AdditionalNodeView, isAdditionalNode } from './additional-node-view.js';
import type { AdditionalNode } from './additional-node-view.js';
import { ChatNodeView } from './chat-node-view.js';
import { BoundToast } from './bound-toast.js';
import { AuthFormNodeView } from './auth-form-node-view.js';
import { PageLogos } from '../../components/page-logos/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/generative-node.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { isDashboardNode, DashboardNodeView } from './dashboard-node-view.js';
import { EditorialNodeView } from './editorial-node-view.js';
import { PricingNodeView } from './pricing-node-view.js';
import { ContentSurround } from '../../components/content-surround/index.js';
import { BoundContentSearch } from './bound-content-search.js';
import { BoundContentSearchButton } from './bound-content-search-button.js';
import { BoundEdgePanel } from './bound-edge-panel.js';
import { BoundActionMenu } from './bound-action-menu.js';

type CompositionNode = AdditionalNode | Extract<GenerativeNode, {
  type: `Dashboard${string}` | 'BlogPost' | 'BlogPosts' | 'ChangelogVersion' |
    'ChangelogVersions' | 'Drawer' | 'Slideover' | 'ContextMenu' | 'DropdownMenu' |
    'PricingPlan' | 'PricingPlans' | 'PricingTable' |
    'ContentSurround' | 'ContentSearch' | 'ContentSearchButton' |
    'AuthForm' | 'PageLogos' | 'Toast' |
    'ChatAttachment' | 'ChatMessage' | 'ChatMessages' |
    'Carousel' | 'Marquee' | 'Chart' | 'Table' |
    'ColorModeButton' | 'ColorModeSwitch' | 'ColorModeSelect' |
    'ColorModeAvatar' | 'ColorModeImage' | 'LocaleSelect';
}>;

export function isCompositionNode(node: GenerativeNode): node is CompositionNode {
  return node.type === 'ColorModeButton' || node.type === 'ColorModeSwitch' ||
    node.type === 'ColorModeSelect' || node.type === 'ColorModeAvatar' ||
    node.type === 'ColorModeImage' || node.type === 'LocaleSelect' ||
    node.type === 'Carousel' || node.type === 'Marquee' ||
    node.type === 'Chart' || node.type === 'Table' || isAdditionalNode(node) ||
    node.type === 'ChatAttachment' ||
    node.type === 'ChatMessage' || node.type === 'ChatMessages' ||
    node.type === 'Toast' || node.type === 'AuthForm' ||
    node.type === 'PageLogos' ||
    isDashboardNode(node) || node.type === 'BlogPost' ||
    node.type === 'BlogPosts' || node.type === 'ChangelogVersion' ||
    node.type === 'ChangelogVersions' || node.type === 'Drawer' ||
    node.type === 'Slideover' || node.type === 'ContextMenu' ||
    node.type === 'DropdownMenu' || node.type === 'PricingPlan' ||
    node.type === 'PricingPlans' || node.type === 'PricingTable' ||
    node.type === 'ContentSurround' || node.type === 'ContentSearch' ||
    node.type === 'ContentSearchButton';
}

export function CompositionNodeView(properties: {
  node: CompositionNode;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  const { node, registry, actions, renderChild } = properties;
  if (isAdditionalNode(node))
    return <AdditionalNodeView {...properties} node={node} />;
  if (isDashboardNode(node))
    return <DashboardNodeView {...properties} node={node} />;
  switch (node.type) {
    case 'ColorModeButton':
    case 'ColorModeSwitch':
    case 'ColorModeSelect':
    case 'ColorModeAvatar':
    case 'ColorModeImage':
      return <ColorModeNodeView node={node} registry={registry} />;
    case 'LocaleSelect':
      return <BoundLocaleSelect node={node} registry={registry} />;
    case 'Carousel':
      return <CarouselNodeView {...properties} node={node} />;
    case 'Marquee':
      return <BoundMarquee node={node} registry={registry} />;
    case 'Chart':
      return <GenerativeChart node={node} registry={registry} actions={actions} />;
    case 'Table':
      return <GenerativeTable node={node} registry={registry} actions={actions} />;
    case 'ChatAttachment':
    case 'ChatMessage':
    case 'ChatMessages':
      return <ChatNodeView node={node} registry={registry} actions={actions} />;
    case 'Toast':
      return <BoundToast node={node} registry={registry} actions={actions} />;
    case 'AuthForm':
      return <AuthFormNodeView node={node} registry={registry}
        actions={actions} renderChild={renderChild} />;
    case 'PageLogos': {
      const { type: _type, ...logos } = node;
      return <PageLogos {...logos} />;
    }
    case 'ContentSurround': {
      const { type: _type, ...surround } = node;
      return <ContentSurround {...surround} />;
    }
    case 'ContentSearch':
      return (
        <BoundContentSearch
          node={node} registry={registry} actions={actions}
          renderChild={renderChild}
        />
      );
    case 'ContentSearchButton':
      return <BoundContentSearchButton node={node} registry={registry} />;
    case 'PricingPlan':
    case 'PricingPlans':
    case 'PricingTable':
      return <PricingNodeView node={node} renderChild={renderChild} />;
    case 'BlogPost':
    case 'BlogPosts':
    case 'ChangelogVersion':
    case 'ChangelogVersions':
      return <EditorialNodeView {...properties} node={node} />;
    case 'Drawer':
    case 'Slideover':
      return (
        <BoundEdgePanel
          node={node}
          registry={registry}
          footer={node.footer?.map(renderChild)}
        >
          {node.children.map(renderChild)}
        </BoundEdgePanel>
      );
    case 'ContextMenu':
      return (
        <BoundActionMenu node={node} registry={registry} actions={actions}>
          {node.children.map(renderChild)}
        </BoundActionMenu>
      );
    case 'DropdownMenu':
      return <BoundActionMenu node={node} registry={registry} actions={actions} />;
  }
}
