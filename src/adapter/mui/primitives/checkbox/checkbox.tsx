import ButtonBase from '@mui/material/ButtonBase';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import type { CheckboxPrimitiveProps } from
  '../../../shared/primitives/checkbox/checkbox.props.js';
import { MUI_CHECKBOX_STYLE } from '../styles.js';

export function MuiCheckboxPrimitive(properties: CheckboxPrimitiveProps) {
  return (
    <Checkbox.Root {...properties} asChild>
      <ButtonBase sx={MUI_CHECKBOX_STYLE}>
        <Checkbox.Indicator>
          <Check aria-hidden="true" />
        </Checkbox.Indicator>
      </ButtonBase>
    </Checkbox.Root>
  );
}
