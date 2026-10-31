import Box from '@mui/material/Box';
import * as Accordion from '@radix-ui/react-accordion';
import type { AccordionContentPrimitiveProps } from
  '../../../shared/primitives/accordion-content/accordion-content.props.js';

export function MuiAccordionContentPrimitive({
  children,
  ...properties
}: AccordionContentPrimitiveProps) {
  return (
    <Accordion.Content {...properties} asChild>
      <Box>{children}</Box>
    </Accordion.Content>
  );
}
