import { usePrimitives } from '../use-primitives.js';
import type { SeparatorPrimitiveProps } from './separator.props.js';

export function Separator(properties: SeparatorPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Separator {...properties} />;
}
