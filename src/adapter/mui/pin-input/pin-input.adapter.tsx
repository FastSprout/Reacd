import { useId } from 'react';
import TextField from '@mui/material/TextField';
import type { PinInputProps } from
  '@fastsprout/reacd/adapter-runtime/components/pin-input/pin-input.props.js';
import { PIN_INPUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/pin-input-policy.js';
import { pinValueSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/pin-input/pin-input.schema.js';
import { useNativeField } from '../native-field.js';
import { materialDescriptionIds } from '../description-ids.js';
import { usePinValidation } from './use-pin-validation.js';

export function MuiPinInput(props: PinInputProps) {
  const id = useId();
  const field = useNativeField(props);
  const length = props.length ?? PIN_INPUT_POLICY.length;
  const inputType = props.inputType ?? PIN_INPUT_POLICY.inputType;
  const numeric = inputType === 'numeric';
  const blocked = field.blocked || Boolean(props.readOnly);
  const validation = usePinValidation({
    id, label: props.label, value: props.value, length,
    required: field.required, disabled: field.disabled, error: field.error,
  });
  const placeholder = Array.from({ length }, (_, index) =>
    (props.separatorEvery && index > 0 && index % props.separatorEvery === 0
      ? PIN_INPUT_POLICY.separator : '') + PIN_INPUT_POLICY.placeholder,
  ).join('');
  const localError = field.error ? undefined : validation.message;
  const help = [
    field.helperError || localError || props.description,
    props.separatorEvery ? `${PIN_INPUT_POLICY.formatLabel}: ${placeholder}` : '',
  ].filter(Boolean).join(' ');
  return (
    <TextField
      id={id}
      inputRef={validation.inputRef}
      inert={field.blocked}
      fullWidth
      label={props.label}
      value={props.value}
      name={field.name}
      disabled={field.disabled}
      required={field.required}
      type={props.mask ? 'password' : 'text'}
      autoComplete={props.otp ? 'one-time-code' : 'off'}
      placeholder={placeholder}
      helperText={help}
      error={Boolean(field.error || validation.message)}
      slotProps={{
        input: { readOnly: Boolean(props.readOnly) },
        htmlInput: {
          inputMode: numeric ? 'numeric' : 'text', minLength: length,
          maxLength: length,
          pattern: numeric ? PIN_INPUT_POLICY.numericPattern
            : PIN_INPUT_POLICY.alphanumericPattern,
          'aria-describedby': materialDescriptionIds(
            field.descriptionIds, `${id}-helper-text`, help,
          ),
        },
      }}
      onChange={(event) => {
        const value = event.target.value;
        if (blocked || value === props.value
          || !pinValueSchema(length, inputType).safeParse(value).success) return;
        props.onValueChange(value);
        if (value.length === length) props.onComplete?.(value);
      }}
    />
  );
}
