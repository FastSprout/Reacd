import type { ChoiceMarkProps } from
  '../../../shared/primitives/choice-mark/choice-mark.props.js';

export function ShadcnChoiceMark({
  appearance: _appearance,
  ...properties
}: ChoiceMarkProps) {
  return <span {...properties} />;
}
