import type { CSSProperties, ReactNode } from 'react';
import { DEFAULTS } from '../../core/policy.js';
import type { Spacing } from '../../core/policy.js';

export interface LayoutProps {
  kind: 'VStack' | 'HStack' | 'Grid' | 'Card';
  spacing?: Spacing | undefined;
  columns?: number | undefined;
  children?: ReactNode;
}

export function Layout({ kind, spacing, columns, children }: LayoutProps) {
  const variables: CSSProperties & Record<`--reacd-${string}`, string | number> = {
    '--reacd-gap': `var(--reacd-${spacing ?? DEFAULTS.spacing})`,
  };
  if (columns !== undefined) variables['--reacd-columns'] = columns;
  return (
    <div className={`reacd-node reacd-${kind.toLowerCase()}`} style={variables}>
      {children}
    </div>
  );
}
