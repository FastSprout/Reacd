import MaterialSurface from '@mui/material/Box';
import type { CardHeaderPrimitiveProps } from
  '../../../shared/primitives/card-header/card-header.props.js';

export function MuiCardHeaderPrimitive(properties: CardHeaderPrimitiveProps) {
  return <MaterialSurface component="div" {...properties} />;
}
