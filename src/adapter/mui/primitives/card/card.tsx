import MaterialSurface from '@mui/material/Card';
import type { CardPrimitiveProps } from '../../../shared/primitives/card/card.props.js';

export function MuiCardPrimitive(properties: CardPrimitiveProps) {
  return <MaterialSurface component="div" {...properties} />;
}
