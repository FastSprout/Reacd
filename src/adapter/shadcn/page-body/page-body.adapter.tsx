import type { PageBodyProps } from
  '@fastsprout/reacd/adapter-runtime/components/page-body/page-body.props.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnPageBodyProps = PageBodyProps;
export function ShadcnPageBody({ children }: PageBodyProps) {
  return (
    <CardContent
      role="article"
      className="grid min-w-0 p-0"
      style={{ gap: 'var(--space-large)', overflowWrap: 'anywhere' }}
    >
      {children}
    </CardContent>
  );
}
