import type { CSSProperties } from 'react';
import type { HStackProps } from
  '@fastsprout/reacd/adapter-runtime/components/h-stack/h-stack.props.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnHStackProps = HStackProps;
export function ShadcnHStack({ children, spacing = 'medium' }: HStackProps) {
  const styles: CSSProperties & { '--stack-track': string } = {
    gap: `var(--space-${spacing})`,
    '--stack-track': `${LAYOUT_POLICY.stackTrackRem}rem`,
  };
  return <CardContent className="flex min-w-0 flex-wrap items-center p-0
    [&>*]:min-w-0 [&>*]:grow [&>*]:basis-[var(--stack-track)]" style={styles}>
    {children}
  </CardContent>;
}
