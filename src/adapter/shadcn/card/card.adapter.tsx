import type { CardProps } from
  '@fastsprout/reacd/adapter-runtime/components/card/card.props.js';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Card, CardContent, CardFooter, CardHeader } from '../vendor/ui/card.js';

export type ShadcnCardProps = CardProps;
const spacingClasses = { small: 'gap-2', medium: 'gap-4', large: 'gap-6' } as const;
export function ShadcnCard({
  label,
  header,
  footer,
  children,
  spacing = DEFAULTS.spacing,
}: CardProps) {
  return (
    <Card
      role={label ? 'region' : undefined}
      aria-label={label}
      className="min-w-0"
    >
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent
        className={`grid min-w-0 grid-cols-1 pt-6 ${spacingClasses[spacing]}`}
      >
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
