import { usePrimitives } from '../use-primitives.js';
import type { ControlPartProps } from './control-part.props.js';

export function ControlPart(properties: ControlPartProps) {
  const primitives = usePrimitives();
  return <primitives.ControlPart {...properties} />;
}
