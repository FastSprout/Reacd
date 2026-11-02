import type { PageGridProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-grid/page-grid.props.js';
import { PAGE_COMPOSITION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-composition-policy.js';
import { MuiGrid } from '../grid/grid.adapter.js';

export type MuiPageGridProps = PageGridProps;
export function MuiPageGrid({ children }: MuiPageGridProps) {
  return <MuiGrid columns={PAGE_COMPOSITION_POLICY.maximumColumns}>
    {children}
  </MuiGrid>;
}
