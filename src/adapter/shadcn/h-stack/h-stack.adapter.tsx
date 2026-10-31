import type { HStackProps } from
  '@fastsprout/reacd/adapter-runtime/components/h-stack/h-stack.js';
import { Layout } from
  '@fastsprout/reacd/adapter-runtime/renderer/layout/layout.renderer.js';

export function ShadcnHStack(props: HStackProps) {
  return <Layout kind="HStack" {...props} />;
}
