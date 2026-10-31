import Paper from '@mui/material/Paper';
import type { ControlSurfaceProps } from
  '../../../shared/primitives/control-surface/control-surface.props.js';

export function MuiControlSurface(properties: ControlSurfaceProps) {
  return <Paper component="div" {...properties} />;
}
