import MaterialText from '@mui/material/Typography';
import type { AlertDescriptionPrimitiveProps } from
  '../../../shared/primitives/alert-description/alert-description.props.js';

export function MuiAlertDescriptionPrimitive(
  properties: AlertDescriptionPrimitiveProps,
) {
  return <MaterialText component="div" {...properties} />;
}
