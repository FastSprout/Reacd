import { usePrimitives } from '../use-primitives.js';
import type { ChoiceMarkProps } from './choice-mark.props.js';

export function ChoiceMark(properties: ChoiceMarkProps) {
  const primitives = usePrimitives();
  return <primitives.ChoiceMark {...properties} />;
}
