import type { ReactNode } from 'react';
import {
  PageCard,
  PageFeature,
  PageHeader,
  PageHero,
  PageSection,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type {
  PagePresentationNode,
} from '../../schema/generative-v2/page-presentation-nodes.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function PagePresentationNodeView({
  node,
  renderChild,
  registry,
  actions,
}: {
  node: PagePresentationNode<GenerativeNode>;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}): ReactNode {
  if (node.type === 'PageFeature' || node.type === 'PageCard') {
    const action = node.action;
    const onPress =
      action === undefined
        ? undefined
        : () => {
            const handler = Object.hasOwn(actions, action)
              ? actions[action]
              : undefined;
            if (typeof handler === 'function') handler({ state: registry });
          };
    if (node.type === 'PageCard') {
      const {
        type: _type,
        children,
        leading,
        header,
        footer,
        action: _action,
        ...card
      } = node;
      return (
        <PageCard
          {...card}
          leading={leading?.map(renderChild)}
          header={header?.map(renderChild)}
          footer={footer?.map(renderChild)}
          onPress={onPress}
        >
          {children.map(renderChild)}
        </PageCard>
      );
    }
    const { type: _type, children, leading, action: _action, ...properties } = node;
    return (
      <PageFeature
        {...properties}
        leading={leading?.map(renderChild)}
        onPress={onPress}
      >
        {children.map(renderChild)}
      </PageFeature>
    );
  }
  if (node.type === 'PageHeader') {
    const { type: _type, children, links, ...properties } = node;
    return (
      <PageHeader {...properties} links={links?.map(renderChild)}>
        {children.map(renderChild)}
      </PageHeader>
    );
  }
  const { children, links, header, footer, top, bottom } = node;
  const common = {
    children: children.map(renderChild),
    links: links?.map(renderChild),
    header: header?.map(renderChild),
    footer: footer?.map(renderChild),
    top: top?.map(renderChild),
    bottom: bottom?.map(renderChild),
  };
  if (node.type === 'PageSection') {
    const {
      type: _type,
      children: _children,
      links: _links,
      header: _header,
      footer: _footer,
      top: _top,
      bottom: _bottom,
      leading,
      features,
      ...section
    } = node;
    return (
      <PageSection
        {...section}
        {...common}
        leading={leading?.map(renderChild)}
        features={features?.map(renderChild)}
      />
    );
  }
  const {
    type: _type,
    children: _children,
    links: _links,
    header: _header,
    footer: _footer,
    top: _top,
    bottom: _bottom,
    ...properties
  } = node;
  return <PageHero {...properties} {...common} />;
}
