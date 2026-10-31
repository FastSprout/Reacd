import { usePrimitives } from '../use-primitives.js';
import type { AccordionItemPrimitiveProps } from './accordion-item.props.js';

export function AccordionItem(properties: AccordionItemPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.AccordionItem {...properties} />;
}
