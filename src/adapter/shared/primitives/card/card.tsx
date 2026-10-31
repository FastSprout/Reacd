import { usePrimitives } from '../use-primitives.js';
import type { CardPrimitiveProps } from './card.props.js';

export function Card(properties: CardPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Card {...properties} />;
}
