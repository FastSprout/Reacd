import { usePrimitives } from '../use-primitives.js';
import type { TabsTriggerPrimitiveProps } from './tabs-trigger.props.js';

export function TabsTrigger(properties: TabsTriggerPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.TabsTrigger {...properties} />;
}
