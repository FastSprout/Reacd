import type { ReactNode } from 'react';
import { Badge, Empty, Kbd, Skeleton, Tooltip } from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { BoundEmpty } from './bound-empty.js';
import { BoundKbd } from './bound-kbd.js';
import { BoundSkeleton } from './bound-skeleton.js';
import { BoundTooltip } from './bound-tooltip.js';
import { BoundContentNavigation } from './bound-content-navigation.js';
import { BoundContentToc } from './bound-content-toc.js';

type DisplayNode = Extract<
  GenerativeNode,
  {
    type: 'Badge' | 'Empty' | 'Kbd' | 'Skeleton' | 'Tooltip' |
      'ContentNavigation' | 'ContentToc';
  }
>;

export function DisplayNodeView({
  node,
  registry,
  renderChild,
}: {
  node: DisplayNode;
  registry: StateRegistry;
  renderChild: (node: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  switch (node.type) {
    case 'Badge': {
      const { type: _type, ...properties } = node;
      return <Badge {...properties} />;
    }
    case 'ContentNavigation':
      return <BoundContentNavigation node={node} registry={registry} />;
    case 'ContentToc':
      return <BoundContentToc node={node} registry={registry} />;
    case 'Skeleton': {
      const { type: _type, show, ...properties } = node;
      return typeof show === 'object' ? (
        <BoundSkeleton properties={properties} reference={show} registry={registry} />
      ) : (
        <Skeleton {...properties} show={show} />
      );
    }
    case 'Empty': {
      const {
        type: _type,
        loading,
        leading,
        children,
        actions,
        footer,
        ...properties
      } = node;
      const content = {
        ...properties,
        leading: leading?.map(renderChild),
        children: children.map(renderChild),
        actions: actions?.map(renderChild),
        footer: footer?.map(renderChild),
      };
      return typeof loading === 'object' ? (
        <BoundEmpty properties={content} reference={loading} registry={registry} />
      ) : (
        <Empty {...content} loading={loading} />
      );
    }
    case 'Kbd': {
      const { type: _type, value, ...properties } = node;
      return typeof value === 'object' ? (
        <BoundKbd properties={properties} reference={value} registry={registry} />
      ) : (
        <Kbd {...properties} value={value} />
      );
    }
    case 'Tooltip': {
      const children = node.children.map(renderChild);
      if (node.open !== undefined)
        return (
          <BoundTooltip node={node} reference={node.open} registry={registry}>
            {children}
          </BoundTooltip>
        );
      const { type: _type, open: _open, children: _children, ...properties } = node;
      return <Tooltip {...properties}>{children}</Tooltip>;
    }
  }
}
