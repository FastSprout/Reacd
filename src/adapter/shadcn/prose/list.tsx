import { useId } from 'react';
import type { ReactNode } from 'react';
import type {
  ProseBlock,
  ProseList,
} from '@fastsprout/reacd/adapter-runtime/core/prose.js';
import { PROSE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/prose-policy.js';
import { Checkbox } from '../vendor/ui/checkbox.js';

export function ShadcnProseList({
  node,
  renderContent,
}: {
  readonly node: ProseList;
  readonly renderContent: (nodes: readonly ProseBlock[]) => ReactNode;
}) {
  const id = useId();
  const inset =
    `min(${PROSE_POLICY.listInsetRem}rem, ` +
    `${PROSE_POLICY.maxInsetPercent}%)`;
  const items = node.items.map((item, index) => (
    <li key={index}>
      {item.checked !== undefined && (
        <Checkbox
          checked={item.checked}
          disabled
          aria-label={PROSE_POLICY.taskLabel}
          aria-describedby={`${id}-${index}`}
        />
      )}
      <div id={`${id}-${index}`}>{renderContent(item.children)}</div>
    </li>
  ));
  return node.ordered ? (
    <ol
      start={node.start}
      className="my-6 list-decimal [&>li]:mt-2"
      style={{ marginInlineStart: inset }}
    >
      {items}
    </ol>
  ) : (
    <ul className="my-6 list-disc [&>li]:mt-2" style={{ marginInlineStart: inset }}>
      {items}
    </ul>
  );
}
