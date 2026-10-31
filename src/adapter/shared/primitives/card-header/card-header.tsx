import { usePrimitives } from '../use-primitives.js';
import type { CardHeaderPrimitiveProps } from './card-header.props.js';

export function CardHeader(properties: CardHeaderPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.CardHeader {...properties} />;
}
