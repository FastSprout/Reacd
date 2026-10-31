import { usePrimitives } from '../use-primitives.js';
import type { TextareaPrimitiveProps } from './textarea.props.js';

export function Textarea(properties: TextareaPrimitiveProps) {
  const primitives = usePrimitives();
  return <primitives.Textarea {...properties} />;
}
