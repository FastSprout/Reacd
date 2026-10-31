import { usePrimitives } from '../use-primitives.js';
import type { SelectTriggerPrimitiveProps } from './select-trigger.props.js';

export function SelectTrigger(properties: SelectTriggerPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.SelectTrigger {...properties} />;
}
