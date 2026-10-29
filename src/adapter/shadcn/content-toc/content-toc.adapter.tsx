import { useState } from 'react';
import type { ContentTocProps } from '../../../components/content-toc/index.js';
import { CONTENT_OUTLINE_DEFAULTS } from '../../../core/content-outline.js';
import { TREE_POLICY } from '../../../core/tree-policy.js';
import { OutlineBranch } from '../../../renderer/content-outline/outline-branch.js';

export function ShadcnContentToc({
  label,
  items,
  emptyLabel = CONTENT_OUTLINE_DEFAULTS.emptyLabel,
  ...properties
}: ContentTocProps) {
  const [issue, setIssue] = useState('');
  return (
    <nav className="reacd-node reacd-content-outline" aria-label={label}>
      {issue !== '' && <p role="alert">{issue}</p>}
      {items.length === 0 ? (
        <p>{emptyLabel}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <OutlineBranch
              {...properties}
              key={item.key}
              item={item}
              mode="toc"
              level={TREE_POLICY.initialLevel}
              report={setIssue}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}
