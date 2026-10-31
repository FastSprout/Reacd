import ButtonBase from '@mui/material/ButtonBase';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { AccordionTriggerPrimitiveProps } from
  '../../../shared/primitives/accordion-trigger/accordion-trigger.props.js';

export function MuiAccordionTriggerPrimitive({
  children,
  ...properties
}: AccordionTriggerPrimitiveProps) {
  return (
    <Accordion.Header>
      <Accordion.Trigger {...properties} asChild>
        <ButtonBase>
          {children}
          <ChevronDown aria-hidden="true" />
        </ButtonBase>
      </Accordion.Trigger>
    </Accordion.Header>
  );
}
