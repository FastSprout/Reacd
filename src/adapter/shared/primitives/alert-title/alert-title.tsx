import { usePrimitives } from '../use-primitives.js';
import type { AlertTitlePrimitiveProps } from './alert-title.props.js';

export function AlertTitle(properties: AlertTitlePrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.AlertTitle {...properties} />;
}
