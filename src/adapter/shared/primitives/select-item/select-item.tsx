import { usePrimitives } from '../use-primitives.js';
import type { SelectItemPrimitiveProps } from './select-item.props.js';

export function SelectItem(properties: SelectItemPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.SelectItem {...properties} />;
}
