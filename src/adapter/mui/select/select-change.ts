import type { SelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/select/select.props.js';

export function emitSelectValue(
  props: SelectProps,
  value: string | string[],
  blocked: boolean,
): void {
  if (blocked) return;
  if (props.mode === 'multiple') {
    if (typeof value !== 'string') props.onValueChange(value);
  } else if (typeof value === 'string') props.onValueChange(value);
}
