import type { InputTimeProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-time/index.js';
import { INPUT_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-time-policy.js';
import { NativeTemporalField } from '../temporal-input/field.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { FieldSet, FieldLegend } from '../vendor/ui/field.js';

export type ShadcnInputTimeProps = InputTimeProps;
export function ShadcnInputTime(props: ShadcnInputTimeProps) {
  const field = useNativeField(props);
  if (props.mode !== 'range') return <NativeTemporalField {...props} kind="time" />;
  return (
    <FieldSet className="min-w-0" disabled={field.disabled}>
      <FieldLegend>{props.label}</FieldLegend>
      <NativeTemporalField
        {...props}
        kind="time"
        endpoint="start"
        label={`${props.label} ${INPUT_TIME_POLICY.startLabel}`}
        name={field.name === undefined ? undefined : `${field.name}.start`}
        value={props.value.start}
        peer={props.value.end}
        onValueChange={(start) => props.onValueChange({ ...props.value, start })}
      />
      <NativeTemporalField
        {...props}
        kind="time"
        endpoint="end"
        label={`${props.label} ${INPUT_TIME_POLICY.endLabel}`}
        name={field.name === undefined ? undefined : `${field.name}.end`}
        value={props.value.end}
        peer={props.value.start}
        onValueChange={(end) => props.onValueChange({ ...props.value, end })}
      />
    </FieldSet>
  );
}
