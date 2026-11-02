import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ProseInline } from '@fastsprout/reacd/adapter-runtime/core/prose.js';

export function ShadcnProseInline({
  nodes,
}: {
  readonly nodes: readonly ProseInline[];
}) {
  return nodes.map((node, index) => (
    <Fragment key={index}>{renderInline(node)}</Fragment>
  ));
}
function renderInline(node: ProseInline): ReactNode {
  switch (node.type) {
    case 'text':
      return node.text;
    case 'code':
      return (
        <code className="relative rounded bg-muted px-1 font-mono text-sm">
          {node.text}
        </code>
      );
    case 'strong':
    case 'emphasis':
    case 'delete': {
      const tags = { strong: 'strong', emphasis: 'em', delete: 'del' } as const;
      const Tag = tags[node.type];
      return (
        <Tag>
          <ShadcnProseInline nodes={node.children} />
        </Tag>
      );
    }
    case 'link':
      return (
        <a
          href={node.href}
          className="font-medium text-primary underline underline-offset-4"
        >
          <ShadcnProseInline nodes={node.children} />
        </a>
      );
    case 'break':
      return <br />;
  }
}
