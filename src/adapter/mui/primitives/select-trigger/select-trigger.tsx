import ButtonBase from '@mui/material/ButtonBase';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import type { SelectTriggerPrimitiveProps } from
  '../../../shared/primitives/select-trigger/select-trigger.props.js';
import { MUI_SELECT_TRIGGER_STYLE } from '../styles.js';

export function MuiSelectTriggerPrimitive({
  children,
  ...properties
}: SelectTriggerPrimitiveProps) {
  return (
    <Select.Trigger {...properties} asChild>
      <ButtonBase sx={MUI_SELECT_TRIGGER_STYLE}>
        {children}
        <ChevronDown aria-hidden="true" />
      </ButtonBase>
    </Select.Trigger>
  );
}
