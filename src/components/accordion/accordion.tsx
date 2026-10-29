import type { ReactNode } from 'react';
import type { AccordionProps } from './accordion.props.js';
import { accordionSchema } from '../../schema/accordion/accordion.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { AccordionProps } from './accordion.props.js';
export function Accordion(props: AccordionProps): ReactNode {
  return useDeclaration('Accordion', accordionSchema, props);
}
