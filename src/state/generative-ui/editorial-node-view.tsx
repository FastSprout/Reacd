import type { ReactNode } from 'react';
import {
  BlogPost,
  BlogPosts,
  ChangelogVersion,
  ChangelogVersions,
} from '../../components/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { EditorialNode }
  from '../../schema/generative-v2/editorial-nodes.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function EditorialNodeView({
  node,
  renderChild,
  registry,
  actions,
}: {
  node: EditorialNode<GenerativeNode>;
  renderChild: (child: GenerativeNode, index: number) => ReactNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}): ReactNode {
  if (node.type === 'BlogPosts') {
    const { type: _type, children, posts, ...properties } = node;
    return (
      <BlogPosts {...properties}>
        {posts?.map(({ key, ...entry }) => (
          <EditorialNodeView
            key={key}
            node={{ ...entry, type: 'BlogPost' }}
            renderChild={renderChild}
            registry={registry}
            actions={actions}
          />
        ))}
        {children.map(renderChild)}
      </BlogPosts>
    );
  }
  if (node.type === 'ChangelogVersions') {
    const { type: _type, children, versions, ...properties } = node;
    return (
      <ChangelogVersions {...properties}>
        {versions?.map(({ key, ...entry }) => (
          <EditorialNodeView
            key={key}
            node={{ ...entry, type: 'ChangelogVersion' }}
            renderChild={renderChild}
            registry={registry}
            actions={actions}
          />
        ))}
        {children.map(renderChild)}
      </ChangelogVersions>
    );
  }
  const {
    type,
    action,
    children,
    header,
    badge,
    authors,
    footer,
    actions: controls,
    ...properties
  } = node;
  const Component = type === 'BlogPost' ? BlogPost : ChangelogVersion;
  const onPress =
    action === undefined
      ? undefined
      : () => {
          const handler = Object.hasOwn(actions, action) ? actions[action] : undefined;
          if (typeof handler === 'function') handler({ state: registry });
        };
  return (
    <Component
      {...properties}
      onPress={onPress}
      header={header?.map(renderChild)}
      badge={badge?.map(renderChild)}
      authors={authors?.map(renderChild)}
      footer={footer?.map(renderChild)}
      actions={controls?.map(renderChild)}
    >
      {children.map(renderChild)}
    </Component>
  );
}
