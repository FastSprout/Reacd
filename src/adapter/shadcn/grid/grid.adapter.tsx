import type { GridProps } from '../../../components/grid/grid.js';
import { Layout } from '../../../renderer/layout/layout.renderer.js';

export function ShadcnGrid(props: GridProps) {
  return <Layout kind="Grid" {...props} />;
}
