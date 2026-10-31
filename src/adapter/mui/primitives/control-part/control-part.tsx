import Box from '@mui/material/Box';
import type { ControlPartProps } from
  '../../../shared/primitives/control-part/control-part.props.js';
import { MUI_CONTROL_STYLES } from './styles.js';

export function MuiControlPart({ part, ...properties }: ControlPartProps) {
  return <Box {...properties} sx={MUI_CONTROL_STYLES[part]} />;
}
