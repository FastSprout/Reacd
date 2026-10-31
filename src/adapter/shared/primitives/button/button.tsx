import { usePrimitives } from '../use-primitives.js';
import type { ButtonPrimitiveProps } from './button.props.js';

export function Button(properties: ButtonPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Button {...properties} />;
}
