import { usePrimitives } from '../use-primitives.js';
import type { AlertDescriptionPrimitiveProps } from './alert-description.props.js';

export function AlertDescription(properties: AlertDescriptionPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.AlertDescription {...properties} />;
}
