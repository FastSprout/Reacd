import { ControlPart } from '../primitives/control-part.js';
import { useCallback } from 'react';
import { Slider } from '@base-ui/react/slider';

export function SliderThumb({
  index,
  label,
  description,
  readOnly,
  invalid,
}: {
  readonly index: number;
  readonly label: string;
  readonly description: string | undefined;
  readonly readOnly: boolean;
  readonly invalid: boolean;
}) {
  const input = useCallback(
    (element: HTMLInputElement | null) => {
      if (element === null) return;
      if (readOnly) element.setAttribute('aria-readonly', 'true');
      else element.removeAttribute('aria-readonly');
      if (invalid) element.setAttribute('aria-invalid', 'true');
      else element.removeAttribute('aria-invalid');
    },
    [readOnly, invalid],
  );
  return (
    <Slider.Thumb
      render={<ControlPart part="thumb" />}
      index={index}
      aria-label={label}
      aria-describedby={description}
      inputRef={input}
      className="reacd-range-thumb"
    />
  );
}
