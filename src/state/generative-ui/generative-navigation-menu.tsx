import { NavigationMenu } from '../../components/navigation-menu/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { generativeNavigationTarget } from './generative-navigation-target.js';

export function GenerativeNavigationMenu({
  node,
  registry,
  actions,
}: {
  node: Extract<GenerativeNode, { type: 'NavigationMenu' }>;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  return (
    <NavigationMenu
      label={node.label}
      orientation={node.orientation}
      items={node.items.map((item) => ({
        ...generativeNavigationTarget(item, registry, actions),
        description: item.description,
        children: item.children?.map((child) =>
          generativeNavigationTarget(child, registry, actions),
        ),
      }))}
    />
  );
}
