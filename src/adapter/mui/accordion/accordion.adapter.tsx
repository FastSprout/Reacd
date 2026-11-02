import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useContext, useId } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import type { AccordionProps } from
  '@fastsprout/reacd/adapter-runtime/components/accordion/accordion.props.js';
import { ACCORDION_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/accordion-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiAccordionProps = AccordionProps;

export function MuiAccordion(props: MuiAccordionProps) {
  const id = useId();
  const active = useContext(PortalActiveContext);
  const field = useNativeField(props);
  const multiple = props.mode === 'multiple';
  const collapsible = props.collapsible ?? ACCORDION_DEFAULTS.collapsible;
  return (
    <Box role="group" aria-label={props.label}>
      {props.items.map((item, index) => (
        <Accordion
          key={item.value}
          expanded={props.value.includes(item.value)}
          disabled={field.blocked || Boolean(item.disabled)}
          slotProps={{ transition: { unmountOnExit: !props.retainContent } }}
          onChange={(_event, expanded) => {
            if (!expanded && !multiple && !collapsible) return;
            props.onValueChange(
              expanded
                ? multiple
                  ? [...props.value, item.value]
                  : [item.value]
                : props.value.filter((value) => value !== item.value),
            );
          }}
        >
          <AccordionSummary
            id={`${id}-${index}-summary`}
            aria-controls={`${id}-${index}-content`}
          >
            {item.label}
          </AccordionSummary>
          <AccordionDetails id={`${id}-${index}-content`}>
            <PortalActiveContext value={active && props.value.includes(item.value)}>
              {item.content}
            </PortalActiveContext>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
