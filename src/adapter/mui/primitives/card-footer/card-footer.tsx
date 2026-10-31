import MaterialSurface from '@mui/material/Box';
import type { CardFooterPrimitiveProps } from
  '../../../shared/primitives/card-footer/card-footer.props.js';

export function MuiCardFooterPrimitive(properties: CardFooterPrimitiveProps) {
  return <MaterialSurface component="div" {...properties} />;
}
