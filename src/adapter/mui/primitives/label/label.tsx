import FormLabel from '@mui/material/FormLabel';
import type { LabelPrimitiveProps } from
  '../../../shared/primitives/label/label.props.js';

export function MuiLabelPrimitive({
  color: _color,
  ...properties
}: LabelPrimitiveProps) {
  return <FormLabel {...properties} />;
}
