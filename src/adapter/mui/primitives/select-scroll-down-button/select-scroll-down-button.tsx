import Box from '@mui/material/Box';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import type { SelectScrollDownButtonPrimitiveProps } from
  '../../../shared/primitives/select.js';
import { MUI_SCROLL_BUTTON_STYLE } from '../styles.js';

export function MuiSelectScrollDownButtonPrimitive(
  properties: SelectScrollDownButtonPrimitiveProps,
) {
  return (
    <Select.ScrollDownButton {...properties} asChild>
      <Box sx={MUI_SCROLL_BUTTON_STYLE}>
        <ChevronDown aria-hidden="true" />
      </Box>
    </Select.ScrollDownButton>
  );
}
