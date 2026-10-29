import type { ReactNode } from 'react';
import { FooterColumns } from '../../components/footer-columns/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { generativeNavigationTarget } from './generative-navigation-target.js';

export function GenerativeFooterColumns({
  node,
  registry,
  actions,
  renderChild,
}: {
  node: Extract<GenerativeNode, { type: 'FooterColumns' }>;
  registry: StateRegistry;
  actions: GenerativeActions;
  renderChild: (node: GenerativeNode, index: number) => ReactNode;
}) {
  return (
    <FooterColumns
      label={node.label}
      left={node.left?.map(renderChild)}
      right={node.right?.map(renderChild)}
      columns={node.columns.map((column) => ({
        ...column,
        children: column.children.map((item) =>
          generativeNavigationTarget(item, registry, actions),
        ),
      }))}
    />
  );
}
