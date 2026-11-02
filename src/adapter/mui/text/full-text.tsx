import { useId } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import type { TextProps } from
  '@fastsprout/reacd/adapter-runtime/components/text/text.props.js';
import { TEXT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/text-policy.js';

export function MuiFullText({ children }: Pick<TextProps, 'children'>) {
  const id = useId();
  return (
    <Accordion
      slots={{ heading: 'div' }}
      slotProps={{ transition: { unmountOnExit: true } }}
    >
      <AccordionSummary id={`${id}-trigger`} aria-controls={`${id}-content`}>
        {TEXT_POLICY.disclosureLabel}
      </AccordionSummary>
      <AccordionDetails id={`${id}-content`}>
        <Typography sx={{ overflowWrap: 'anywhere' }}>{children}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
