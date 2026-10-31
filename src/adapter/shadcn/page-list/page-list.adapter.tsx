import { Children } from 'react';
import type { PageListProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-list/page-list.js';
import { PAGE_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';

export function ShadcnPageList({
  children,
  divide = PAGE_COMPOSITION_DEFAULTS.divide,
}: PageListProps) {
  return (
    <ul className="reacd-node reacd-page-list" role="list" data-divide={divide}>
      {Children.map(Children.toArray(children), (child) => (
        <li className="reacd-page-list-item">{child}</li>
      ))}
    </ul>
  );
}
