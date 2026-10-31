import { usePrimitives } from '../use-primitives.js';
import type { CheckboxPrimitiveProps } from './checkbox.props.js';

export function Checkbox(properties: CheckboxPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Checkbox {...properties} />;
}
