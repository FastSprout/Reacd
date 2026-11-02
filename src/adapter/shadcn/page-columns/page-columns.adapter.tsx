import { Children } from 'react';
import type { PageColumnsProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-columns/page-columns.props.js';
import { PAGE_COMPOSITION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnPageColumnsProps = PageColumnsProps;
export function ShadcnPageColumns({ children }: PageColumnsProps) {
  return (
    <CardContent
      className="min-w-0 p-0"
      style={{
        columnCount: PAGE_COMPOSITION_POLICY.maximumColumns,
        columnWidth: `${PAGE_COMPOSITION_POLICY.columnTrackRem}rem`,
        columnGap: 'var(--space-medium)',
        overflowWrap: 'anywhere',
      }}
    >
      {Children.map(children, (child) =>
        child == null ? null : (
          <CardContent
            className="min-w-0 p-0"
            style={{
              breakInside: 'avoid',
              marginBlockEnd: 'var(--space-medium)',
            }}
          >
            {child}
          </CardContent>
        ),
      )}
    </CardContent>
  );
}
