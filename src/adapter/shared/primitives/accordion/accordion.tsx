import { usePrimitives } from '../use-primitives.js';
import type { AccordionPrimitiveProps } from './accordion.props.js';

export function Accordion(properties: AccordionPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Accordion {...properties} />;
}
