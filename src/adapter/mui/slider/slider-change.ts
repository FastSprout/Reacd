import type { SliderProps } from
  '@fastsprout/reacd/adapter-runtime/components/slider/slider.props.js';

export function emitSliderValue(
  props: SliderProps,
  value: number | number[],
  blocked: boolean,
): void {
  if (blocked || props.readOnly) return;
  if (props.mode === 'range') {
    if (typeof value !== 'number') {
      const [start, end] = value;
      if (start !== undefined && end !== undefined) props.onValueChange({ start, end });
    }
  } else if (typeof value === 'number') props.onValueChange(value);
}
