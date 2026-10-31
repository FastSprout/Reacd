import type { ControlPartProps } from
  '../../../shared/primitives/control-part/control-part.props.js';

export function ShadcnControlPart({ part: _part, ...properties }: ControlPartProps) {
  return <div {...properties} />;
}
