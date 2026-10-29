import type { ReactNode } from 'react';
import {
  PageAside,
  PageBody,
  PageColumns,
  PageGrid,
  PageList,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type {
  PageCompositionNode,
} from '../../schema/generative-v2/page-nodes.schema.js';

export function PageNodeView({
  node,
  renderChild,
}: {
  node: PageCompositionNode<GenerativeNode>;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
}): ReactNode {
  if (node.type === 'PageAside') {
    return (
      <PageAside
        label={node.label}
        top={node.top?.map(renderChild)}
        bottom={node.bottom?.map(renderChild)}
      >
        {node.children.map(renderChild)}
      </PageAside>
    );
  }
  const { type, children, ...properties } = node;
  const Component = { PageBody, PageColumns, PageGrid, PageList }[type];
  return <Component {...properties}>{children.map(renderChild)}</Component>;
}
