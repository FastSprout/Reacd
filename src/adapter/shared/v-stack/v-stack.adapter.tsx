import type { VStackProps } from
  '@fastsprout/reacd/adapter-runtime/components/v-stack/v-stack.js';
import { Layout } from
  '@fastsprout/reacd/adapter-runtime/renderer/layout/layout.renderer.js';

export function SharedVStack(props: VStackProps) {
  return <Layout kind="VStack" {...props} />;
}
