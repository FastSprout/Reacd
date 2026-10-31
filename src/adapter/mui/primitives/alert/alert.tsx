import Alert from '@mui/material/Alert';
import type { AlertPrimitiveProps } from
  '../../../shared/primitives/alert/alert.props.js';

export function MuiAlertPrimitive({
  variant,
  color: _color,
  ...properties
}: AlertPrimitiveProps) {
  return (
    <Alert
      {...properties}
      icon={false}
      severity={variant === 'destructive' ? 'error' : 'info'}
    />
  );
}
