import type { PageGridProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-grid/page-grid.props.js';
import { PAGE_COMPOSITION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';
import { ShadcnGrid } from '../grid/grid.adapter.js';

export type ShadcnPageGridProps = PageGridProps;
export function ShadcnPageGrid({ children }: PageGridProps) {
  return (
    <ShadcnGrid columns={PAGE_COMPOSITION_POLICY.maximumColumns}>{children}</ShadcnGrid>
  );
}
