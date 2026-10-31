import { usePrimitives } from '../use-primitives.js';
import type { SwitchPrimitiveProps } from './switch.props.js';

export function Switch(properties: SwitchPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Switch {...properties} />;
}
