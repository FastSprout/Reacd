import { usePrimitives } from '../use-primitives.js';
import type { SelectScrollDownButtonPrimitiveProps } from
  './select-scroll-down-button.props.js';

export function SelectScrollDownButton(
  properties: SelectScrollDownButtonPrimitiveProps,
) {
  const primitives = usePrimitives();
  return <primitives.SelectScrollDownButton {...properties} />;
}
