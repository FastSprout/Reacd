import Paper from '@mui/material/Paper';
import * as Accordion from '@radix-ui/react-accordion';
import type { AccordionItemPrimitiveProps } from
  '../../../shared/primitives/accordion-item/accordion-item.props.js';

export function MuiAccordionItemPrimitive({
  children,
  ...properties
}: AccordionItemPrimitiveProps) {
  return (
    <Accordion.Item {...properties} asChild>
      <Paper variant="outlined">{children}</Paper>
    </Accordion.Item>
  );
}
