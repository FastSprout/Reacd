import { usePrimitives } from '../use-primitives.js';
import type { TabsContentPrimitiveProps } from './tabs-content.props.js';

export function TabsContent(properties: TabsContentPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.TabsContent {...properties} />;
}
