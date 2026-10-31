import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import * as Switch from '@radix-ui/react-switch';
import type { SwitchPrimitiveProps } from
  '../../../shared/primitives/switch/switch.props.js';
import { MUI_SWITCH_STYLE } from '../styles.js';

export function MuiSwitchPrimitive(properties: SwitchPrimitiveProps) {
  return (
    <Switch.Root {...properties} asChild>
      <ButtonBase sx={MUI_SWITCH_STYLE}>
        <Switch.Thumb asChild>
          <Box component="span" />
        </Switch.Thumb>
      </ButtonBase>
    </Switch.Root>
  );
}
