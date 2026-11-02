import type { ColorModeSelectProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-select/index.js';
import {
  COLOR_MODES,
  COLOR_MODE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/color-mode-policy.js';
import { colorModeValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/color-mode/color-mode.schema.js';
import { MuiSelect } from '../select/select.adapter.js';

export type MuiColorModeSelectProps = ColorModeSelectProps;

export function MuiColorModeSelect(props: MuiColorModeSelectProps) {
  const labels = props.labels ?? COLOR_MODE_POLICY.labels;
  return (
    <MuiSelect
      label={props.label}
      value={props.value}
      description={props.description}
      disabled={props.disabled}
      readOnly={props.readOnly}
      items={COLOR_MODES.map((value) => ({ value, label: labels[value] }))}
      onValueChange={(value) => props.onValueChange(colorModeValueSchema.parse(value))}
    />
  );
}
