import { usePrimitives } from '../use-primitives.js';
import type { BadgePrimitiveProps } from './badge.props.js';

export function Badge(properties: BadgePrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Badge {...properties} />;
}
