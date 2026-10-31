import type { ContainerProps } from
  '@fastsprout/reacd/adapter-runtime/components/container/container.js';

export function ShadcnContainer({ children }: ContainerProps) {
  return <div className="reacd-node reacd-container">{children}</div>;
}
