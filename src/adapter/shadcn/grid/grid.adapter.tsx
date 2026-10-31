import type { GridProps } from
  '@fastsprout/reacd/adapter-runtime/components/grid/grid.js';
import { Layout } from
  '@fastsprout/reacd/adapter-runtime/renderer/layout/layout.renderer.js';

export function ShadcnGrid(props: GridProps) {
  return <Layout kind="Grid" {...props} />;
}
