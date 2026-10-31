import { usePrimitives } from '../use-primitives.js';
import type { ControlOptionProps } from './control-option.props.js';

export function ControlOption(properties: ControlOptionProps) {
  const primitives = usePrimitives();
  return <primitives.ControlOption {...properties} />;
}
