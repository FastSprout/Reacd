import { usePrimitives } from '../use-primitives.js';
import type { CardFooterPrimitiveProps } from './card-footer.props.js';

export function CardFooter(properties: CardFooterPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.CardFooter {...properties} />;
}
