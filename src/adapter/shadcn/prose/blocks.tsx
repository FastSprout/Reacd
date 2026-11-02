import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ProseBlock } from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { Separator } from '../vendor/ui/separator.js';
import { ShadcnProseHeading } from './typography.js';
import { ShadcnProseInline } from './inline.js';
import { ShadcnProseCode } from './code.js';
import { ShadcnProseList } from './list.js';
import { ShadcnProseTable } from './table.js';

export function ShadcnProseBlocks({
  nodes,
}: {
  readonly nodes: readonly ProseBlock[];
}) {
  return nodes.map((node, index) => (
    <Fragment key={index}>{renderBlock(node)}</Fragment>
  ));
}
function renderBlock(node: ProseBlock): ReactNode {
  switch (node.type) {
    case 'heading':
      return (
        <ShadcnProseHeading level={node.level} id={node.id}>
          <ShadcnProseInline nodes={node.children} />
        </ShadcnProseHeading>
      );
    case 'paragraph':
      return (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <ShadcnProseInline nodes={node.children} />
        </p>
      );
    case 'list':
      return (
        <ShadcnProseList
          node={node}
          renderContent={(nodes) => <ShadcnProseBlocks nodes={nodes} />}
        />
      );
    case 'code':
      return <ShadcnProseCode node={node} />;
    case 'table':
      return <ShadcnProseTable node={node} />;
    case 'quote':
      return (
        <blockquote
          className="mt-6 border-s-2 italic"
          style={{
            paddingInlineStart:
              `min(${PROSE_POLICY.quoteInsetRem}rem, ` +
              `${PROSE_POLICY.maxInsetPercent}%)`,
          }}
        >
          <ShadcnProseBlocks nodes={node.children} />
        </blockquote>
      );
    case 'thematicBreak':
      return <Separator decorative={false} />;
    case 'image':
      return (
        <img
          src={node.src}
          alt={node.alt}
          title={node.title}
          className="h-auto max-w-full rounded-md"
        />
      );
  }
}
