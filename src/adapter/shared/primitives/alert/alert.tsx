import { usePrimitives } from '../use-primitives.js';
import type { AlertPrimitiveProps } from './alert.props.js';

export function Alert(properties: AlertPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Alert {...properties} />;
}
