import ListItem from '@mui/material/ListItem';
import type { ControlOptionProps } from
  '../../../shared/primitives/control-option/control-option.props.js';

export function MuiControlOption(properties: ControlOptionProps) {
  return <ListItem component="div" {...properties} />;
}
