import { usePrimitives } from '../use-primitives.js';
import type { SelectScrollUpButtonPrimitiveProps } from
  './select-scroll-up-button.props.js';

export function SelectScrollUpButton(properties: SelectScrollUpButtonPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.SelectScrollUpButton {...properties} />;
}
