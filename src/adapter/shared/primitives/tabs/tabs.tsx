import { usePrimitives } from '../use-primitives.js';
import type { TabsPrimitiveProps } from './tabs.props.js';

export function Tabs(properties: TabsPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Tabs {...properties} />;
}
