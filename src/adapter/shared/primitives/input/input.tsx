import { usePrimitives } from '../use-primitives.js';
import type { InputPrimitiveProps } from './input.props.js';

export function Input(properties: InputPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Input {...properties} />;
}
