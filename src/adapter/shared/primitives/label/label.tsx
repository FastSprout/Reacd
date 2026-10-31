import { usePrimitives } from '../use-primitives.js';
import type { LabelPrimitiveProps } from './label.props.js';

export function Label(properties: LabelPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Label {...properties} />;
}
