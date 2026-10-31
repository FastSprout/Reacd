import { usePrimitives } from '../use-primitives.js';
import type { SelectValuePrimitiveProps } from './select-value.props.js';

export function SelectValue(properties: SelectValuePrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.SelectValue {...properties} />;
}
