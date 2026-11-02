import { useMaterialTextConstraint } from '../form/use-text-constraint.js';
import { materialDescriptionIds } from '../description-ids.js';
import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import type { InputProps } from
  '@fastsprout/reacd/adapter-runtime/components/input/input.props.js';
import { INPUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/input-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiInputProps = InputProps;

export function MuiInput(props: MuiInputProps) {
  const id = useId();
  const field = useNativeField(props);
  const validation = useMaterialTextConstraint({
    id,
    label: props.label,
    value: props.value,
    required: field.required,
    disabled: field.disabled,
    minLength: props.minLength,
    inputType: props.inputType,
  });
  const error = field.error || validation.error;
  const help = field.helperError || validation.error || props.description;

  const disabled = field.disabled;
  const blocked = field.blocked || Boolean(props.loading) || Boolean(props.readOnly);
  return (
    <TextField
      inert={field.blocked}
      id={id}
      inputRef={validation.inputRef}
      fullWidth
      label={props.label}
      value={props.value}
      name={field.name}
      type={props.inputType ?? INPUT_POLICY.defaultType}
      disabled={disabled}
      required={field.required}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
      helperText={help}
      error={Boolean(error)}
      slotProps={{
        input: {
          readOnly: Boolean(props.readOnly || props.loading),
          endAdornment: props.loading && (
            <InputAdornment position="end">
              <CircularProgress
                aria-label={`${INPUT_POLICY.loadingPrefix} ${props.label}`}
              />
            </InputAdornment>
          ),
        },
        htmlInput: {
          minLength: props.minLength,
          maxLength: props.maxLength ?? INPUT_POLICY.maximumLength,
          'aria-busy': props.loading,
          'aria-describedby': materialDescriptionIds(
            field.descriptionIds,
            `${id}-helper-text`,
            help,
          ),
        },
      }}
      onChange={(event) => {
        emitNativeValue(props.onValueChange, event.target.value, blocked);
      }}
    />
  );
}
