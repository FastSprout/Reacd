import type { PageGridProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-grid/page-grid.js';

export function SharedPageGrid({ children }: PageGridProps) {
  return <div className="reacd-node reacd-page-grid">{children}</div>;
}
