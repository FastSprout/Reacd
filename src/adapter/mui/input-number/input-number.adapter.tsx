import { useMaterialTextConstraint } from '../form/use-text-constraint.js';
import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import { NumberField } from '@base-ui/react/number-field';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { InputNumberProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-number/input-number.props.js';
import { INPUT_NUMBER_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-number-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiInputNumberProps = InputNumberProps;

export function MuiInputNumber(props: MuiInputNumberProps) {
  const id = useId();
  const field = useNativeField(props);
  const validation = useMaterialTextConstraint({
    id,
    label: props.label,
    value: props.value === null ? '' : String(props.value),
    required: field.required,
    disabled: field.disabled,
  });
  const error = field.error || validation.error;
  return (
    <NumberField.Root
      id={id}
      inputRef={validation.inputRef}
      value={props.value}
      onValueChange={(value) =>
        emitNativeValue(props.onValueChange, value, field.blocked)
      }
      min={props.min ?? INPUT_NUMBER_POLICY.minimum}
      max={props.max ?? INPUT_NUMBER_POLICY.maximum}
      step={props.step ?? INPUT_NUMBER_POLICY.step}
      locale={props.locale ?? INPUT_NUMBER_POLICY.locale}
      format={props.format}
      name={field.name}
      disabled={field.disabled}
      required={field.required}
      readOnly={Boolean(props.readOnly)}
      render={({ color: _color, ...root }, state) => (
        <FormControl
          {...root}
          inert={field.blocked}
          fullWidth
          variant="outlined"
          disabled={state.disabled}
          required={state.required}
          error={Boolean(error)}
        >
          {root.children}
        </FormControl>
      )}
    >
      <InputLabel htmlFor={id} shrink={props.value !== null ? true : undefined}>
        {props.label}
      </InputLabel>
      <NumberField.Input
        id={id}
        placeholder={props.placeholder}
        render={(input, state) => (
          <OutlinedInput
            label={props.label}
            inputRef={input.ref}
            value={state.inputValue}
            slotProps={{
              input: {
                ...input,
                'aria-invalid': Boolean(error),
                'aria-describedby': [...field.descriptionIds, `${id}-help`].join(' '),
              },
            }}
            endAdornment={
              <InputAdornment position="end">
                <NumberField.Decrement
                  render={<IconButton aria-label={`Decrease ${props.label}`} />}
                >
                  <Remove />
                </NumberField.Decrement>
                <NumberField.Increment
                  render={<IconButton aria-label={`Increase ${props.label}`} />}
                >
                  <Add />
                </NumberField.Increment>
              </InputAdornment>
            }
          />
        )}
      />
      <FormHelperText id={`${id}-help`}>
        {field.helperError || validation.error || props.description}
      </FormHelperText>
    </NumberField.Root>
  );
}
