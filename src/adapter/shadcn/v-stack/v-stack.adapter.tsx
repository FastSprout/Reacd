import type { VStackProps } from
  '@fastsprout/reacd/adapter-runtime/components/v-stack/v-stack.props.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnVStackProps = VStackProps;
export function ShadcnVStack({ children, spacing = 'medium' }: VStackProps) {
  return (
    <CardContent
      className="flex flex-col p-0"
      style={{ gap: `var(--space-${spacing})` }}
    >
      {children}
    </CardContent>
  );
}
