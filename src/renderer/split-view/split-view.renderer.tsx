import type { CSSProperties } from 'react';
import type { SplitViewProps } from '../../components/split-view/split-view.js';
import { DEFAULTS } from '../../core/policy.js';

export function SplitViewSurface({ children, spacing }: SplitViewProps) {
  const variables: CSSProperties & { '--reacd-gap': string } = {
    '--reacd-gap': `var(--reacd-${spacing ?? DEFAULTS.spacing})`,
  };
  return (
    <div className="reacd-node reacd-split" style={variables}>
      {children}
    </div>
  );
}
