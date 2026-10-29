import type { ViewportProps } from '../../components/viewport/viewport.js';

export function ViewportSurface({ children, compact }: ViewportProps) {
  return (
    <div className="reacd-node reacd-viewport" data-compact={compact}>
      {children}
    </div>
  );
}
