import { usePrimitives } from '../use-primitives.js';
import type { TabsListPrimitiveProps } from './tabs-list.props.js';

export function TabsList(properties: TabsListPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.TabsList {...properties} />;
}
