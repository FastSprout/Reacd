import { Children } from 'react';
import type { PageListProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-list/page-list.props.js';
import { PAGE_COMPOSITION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';
import { CardContent } from '../vendor/ui/card.js';
import { Separator } from '../vendor/ui/separator.js';

export type ShadcnPageListProps = PageListProps;
export function ShadcnPageList({
  children,
  divide = PAGE_COMPOSITION_DEFAULTS.divide,
}: PageListProps) {
  return (
    <CardContent
      role="list"
      className="grid min-w-0 p-0"
      style={{ gap: 'var(--space-medium)', overflowWrap: 'anywhere' }}
    >
      {Children.map(Children.toArray(children), (child, index) => (
        <CardContent role="listitem" className="min-w-0 p-0">
          {divide && index > 0 && <Separator decorative={false} />}
          {child}
        </CardContent>
      ))}
    </CardContent>
  );
}
