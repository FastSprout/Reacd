import type { CSSProperties, Ref } from 'react';
import type { PinInputProps } from
  '@fastsprout/reacd/adapter-runtime/components/pin-input/pin-input.props.js';
import { PIN_INPUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/pin-input-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { InputOTP } from '../vendor/ui/input-otp.js';
import { Field, FieldDescription, FieldError, FieldLabel } from '../vendor/ui/field.js';
import { ShadcnPinSlots } from './pin-slots.js';

export interface PinControlProps extends PinInputProps {
  readonly id: string;
  readonly inputRef?: Ref<HTMLInputElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly error?: string | undefined;
}

const minimumTarget: CSSProperties & { '--reacd-pin-target': string } = {
  '--reacd-pin-target': `${LAYOUT_POLICY.controlTargetPx}px`,
};

export function ShadcnPinControl({ inputRef, ...props }: PinControlProps) {
  const length = props.length ?? PIN_INPUT_POLICY.length;
  const numeric = (props.inputType ?? PIN_INPUT_POLICY.inputType) === 'numeric';
  const field = useNativeField(props, props.description ? [`${props.id}-help`] : []);
  const error = props.error || field.error;
  return (
    <Field data-invalid={Boolean(error)} style={minimumTarget}>
      <FieldLabel htmlFor={props.id}>{props.label}</FieldLabel>
      <InputOTP
        id={props.id}
        ref={inputRef}
        value={props.value}
        onChange={(value) => {
          if (field.blocked || props.readOnly) return;
          props.onValueChange(value);
          if (value.length === length && value !== props.value) {
            props.onComplete?.(value);
          }
        }}
        onBlur={props.onBlur}
        maxLength={length}
        minLength={length}
        name={field.name}
        required={field.required}
        disabled={field.disabled}
        readOnly={props.readOnly}
        type={props.mask ? 'password' : 'text'}
        inputMode={numeric ? 'numeric' : 'text'}
        pattern={
          numeric
            ? PIN_INPUT_POLICY.numericPattern
            : PIN_INPUT_POLICY.alphanumericPattern
        }
        pasteTransformer={(value) => value.replace(/[\s-]/g, '')}
        autoComplete={props.otp ? 'one-time-code' : 'off'}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [...field.descriptionIds, ...(props.error ? [`${props.id}-error`] : [])].join(
            ' ',
          ) || undefined
        }
        containerClassName="min-h-(--reacd-pin-target) min-w-0 max-w-full"
        render={(state) => (
          <ShadcnPinSlots
            state={state}
            mask={props.mask}
            separatorEvery={props.separatorEvery}
          />
        )}
      />
      {props.description && (
        <FieldDescription id={`${props.id}-help`}>{props.description}</FieldDescription>
      )}
      {props.error && <FieldError id={`${props.id}-error`}>{props.error}</FieldError>}
    </Field>
  );
}
