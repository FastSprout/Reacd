import type { ReactNode } from 'react';
import {
  Page,
  PageAnchors,
  PageCTA,
  PageLinks,
  Section,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type {
  PageNavigationNode,
} from '../../schema/generative-v2/page-navigation-nodes.schema.js';

export function PageNavigationNodeView({
  node,
  renderChild,
}: {
  node: PageNavigationNode<GenerativeNode>;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  if (node.type === 'PageAnchors' || node.type === 'PageLinks') {
    const { type, links, ...properties } = node;
    const Component = type === 'PageLinks' ? PageLinks : PageAnchors;
    return (
      <Component
        {...properties}
        links={links?.map((item) => ({
          ...item,
          leading: item.leading?.map(renderChild),
        }))}
      />
    );
  }
  if (node.type === 'Page') {
    const { type: _type, children, left, right, ...properties } = node;
    return (
      <Page
        {...properties}
        left={left?.map(renderChild)}
        right={right?.map(renderChild)}
      >
        {children.map(renderChild)}
      </Page>
    );
  }
  if (node.type === 'Section') {
    const { type: _type, children, ...properties } = node;
    return <Section {...properties}>{children.map(renderChild)}</Section>;
  }
  const {
    type: _type,
    children,
    links,
    header,
    footer,
    top,
    bottom,
    ...properties
  } = node;
  return (
    <PageCTA
      {...properties}
      links={links?.map(renderChild)}
      header={header?.map(renderChild)}
      footer={footer?.map(renderChild)}
      top={top?.map(renderChild)}
      bottom={bottom?.map(renderChild)}
    >
      {children.map(renderChild)}
    </PageCTA>
  );
}
