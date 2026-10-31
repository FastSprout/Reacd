import MaterialText from '@mui/material/AlertTitle';
import type { AlertTitlePrimitiveProps } from
  '../../../shared/primitives/alert-title/alert-title.props.js';

export function MuiAlertTitlePrimitive(properties: AlertTitlePrimitiveProps) {
  return <MaterialText component="h5" {...properties} />;
}
