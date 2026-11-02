import type { SplitViewProps } from
  '@fastsprout/reacd/adapter-runtime/components/split-view/split-view.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnSplitViewProps = SplitViewProps;
export function ShadcnSplitView({ children, spacing }: SplitViewProps) {
  const track = `min(100%, ${LAYOUT_POLICY.splitTrackRem}rem)`;
  return (
    <CardContent
      className="grid min-w-0 p-0"
      style={{
        gap: `var(--space-${spacing})`,
        gridTemplateColumns: `repeat(auto-fit, minmax(${track}, 1fr))`,
      }}
    >
      {children}
    </CardContent>
  );
}
