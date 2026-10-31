import { Children } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { CardProps } from
  '@fastsprout/reacd/adapter-runtime/components/card/card.js';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Card, CardHeader, CardFooter } from '../vendor/ui/card.js';

function hasContent(value: ReactNode): boolean {
  return Children.toArray(value).some((child) => child !== '');
}

export function ShadcnCard({ children, spacing, label, header, footer }: CardProps) {
  const variables: CSSProperties & { '--reacd-gap': string } = {
    '--reacd-gap': `var(--reacd-${spacing ?? DEFAULTS.spacing})`,
  };
  return (
    <Card
      className="reacd-node reacd-card"
      style={variables}
      role={label === undefined ? undefined : 'region'}
      aria-label={label}
    >
      {!hasContent(header) ? null : (
        <CardHeader className="reacd-card-slot" data-slot="reacd-card-header">
          {header}
        </CardHeader>
      )}
      {children}
      {!hasContent(footer) ? null : (
        <CardFooter className="reacd-card-slot" data-slot="reacd-card-footer">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
