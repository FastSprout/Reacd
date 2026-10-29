import type { HStackProps } from '../../../components/h-stack/h-stack.js';
import { Layout } from '../../../renderer/layout/layout.renderer.js';

export function ShadcnHStack(props: HStackProps) {
  return <Layout kind="HStack" {...props} />;
}
