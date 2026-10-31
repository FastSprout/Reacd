import { usePrimitives } from '../use-primitives.js';
import type { SelectPrimitiveProps } from './select.props.js';

export function Select(properties: SelectPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Select {...properties} />;
}
