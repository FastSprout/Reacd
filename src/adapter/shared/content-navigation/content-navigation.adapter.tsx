import { useState } from 'react';
import type { ContentNavigationProps } from
  '@fastsprout/reacd/adapter-runtime/components/content-navigation/index.js';
import { CONTENT_OUTLINE_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/content-outline.js';
import { TREE_POLICY } from '@fastsprout/reacd/adapter-runtime/core/tree-policy.js';
import { OutlineBranch } from
  '@fastsprout/reacd/adapter-runtime/renderer/content-outline/outline-branch.js';

export function SharedContentNavigation({
  label,
  items,
  emptyLabel = CONTENT_OUTLINE_DEFAULTS.emptyLabel,
  ...properties
}: ContentNavigationProps) {
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
              mode="navigation"
              level={TREE_POLICY.initialLevel}
              report={setIssue}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}
