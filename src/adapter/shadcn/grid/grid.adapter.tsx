import type { GridProps } from
  '@fastsprout/reacd/adapter-runtime/components/grid/grid.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnGridProps = GridProps;
export function ShadcnGrid({ children, columns, spacing = 'medium' }: GridProps) {
  const gap = `var(--space-${spacing})`;
  const share = `calc((100% - (${columns} - 1) * ${gap}) / ${columns})`;
  const minimum = `min(100%, max(${LAYOUT_POLICY.gridTrackRem}rem, ${share}))`;
  return <CardContent className="grid min-w-0 p-0" style={{ gap,
    gridTemplateColumns: `repeat(auto-fit, minmax(${minimum}, 1fr))` }}>
    {children}
  </CardContent>;
}
