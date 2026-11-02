import type { ViewportProps } from
  '@fastsprout/reacd/adapter-runtime/components/viewport/viewport.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnViewportProps = ViewportProps;
export function ShadcnViewport({ children, compact }: ViewportProps) {
  return (
    <CardContent
      className="mx-auto min-w-0 w-full p-0"
      style={{ maxWidth: compact ? LAYOUT_POLICY.compactViewportPx : undefined }}
    >
      {children}
    </CardContent>
  );
}
