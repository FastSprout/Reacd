import { usePrimitives } from '../use-primitives.js';
import type { AccordionTriggerPrimitiveProps } from './accordion-trigger.props.js';

export function AccordionTrigger(properties: AccordionTriggerPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.AccordionTrigger {...properties} />;
}
