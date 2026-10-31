import { usePrimitives } from '../use-primitives.js';
import type { ControlSurfaceProps } from './control-surface.props.js';

export function ControlSurface(properties: ControlSurfaceProps) {
  const primitives = usePrimitives();
  return <primitives.ControlSurface {...properties} />;
}
