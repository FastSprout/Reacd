import type { ContainerProps } from
  '@fastsprout/reacd/adapter-runtime/components/container/container.props.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnContainerProps = ContainerProps;
export function ShadcnContainer({ children }: ContainerProps) {
  return <CardContent className="container mx-auto p-0">{children}</CardContent>;
}
