import type { VStackProps } from '../../../components/v-stack/v-stack.js';
import { Layout } from '../../../renderer/layout/layout.renderer.js';

export function ShadcnVStack(props: VStackProps) {
  return <Layout kind="VStack" {...props} />;
}
