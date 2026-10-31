import { usePrimitives } from '../use-primitives.js';
import type { AccordionContentPrimitiveProps } from './accordion-content.props.js';

export function AccordionContent(properties: AccordionContentPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.AccordionContent {...properties} />;
}
