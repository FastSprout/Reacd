import type { InputDateProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-date/index.js';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { NativeTemporalField } from '../temporal-input/field.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { FieldSet, FieldLegend } from '../vendor/ui/field.js';

export type ShadcnInputDateProps = InputDateProps;
export function ShadcnInputDate(props: ShadcnInputDateProps) {
  const field = useNativeField(props);
  if (props.mode !== 'range') return <NativeTemporalField {...props} kind="date" />;
  return (
    <FieldSet className="min-w-0" disabled={field.disabled}>
      <FieldLegend>{props.label}</FieldLegend>
      <NativeTemporalField
        {...props}
        kind="date"
        endpoint="start"
        label={`${props.label} ${INPUT_DATE_POLICY.startLabel}`}
        name={field.name === undefined ? undefined : `${field.name}.start`}
        value={props.value.start}
        peer={props.value.end}
        onValueChange={(start) => props.onValueChange({ ...props.value, start })}
      />
      <NativeTemporalField
        {...props}
        kind="date"
        endpoint="end"
        label={`${props.label} ${INPUT_DATE_POLICY.endLabel}`}
        name={field.name === undefined ? undefined : `${field.name}.end`}
        value={props.value.end}
        peer={props.value.start}
        onValueChange={(end) => props.onValueChange({ ...props.value, end })}
      />
    </FieldSet>
  );
}
