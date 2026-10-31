import Box from '@mui/material/Box';
import * as Select from '@radix-ui/react-select';
import { ChevronUp } from 'lucide-react';
import type { SelectScrollUpButtonPrimitiveProps } from
  '../../../shared/primitives/select-scroll-up-button/select-scroll-up-button.props.js';
import { MUI_SCROLL_BUTTON_STYLE } from '../styles.js';

export function MuiSelectScrollUpButtonPrimitive(
  properties: SelectScrollUpButtonPrimitiveProps,
) {
  return (
    <Select.ScrollUpButton {...properties} asChild>
      <Box sx={MUI_SCROLL_BUTTON_STYLE}>
        <ChevronUp aria-hidden="true" />
      </Box>
    </Select.ScrollUpButton>
  );
}
