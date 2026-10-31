import { materialFieldError } from '../field-state.js';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { InputPrimitiveProps } from
  '../../../shared/primitives/input/input.props.js';

export function MuiInputPrimitive({
  ref,
  className,
  ...properties
}: InputPrimitiveProps) {
  return (
    <OutlinedInput
      error={materialFieldError(properties['aria-invalid'])}
      fullWidth
      className={className}
      inputRef={ref}
      disabled={Boolean(properties.disabled)}
      readOnly={Boolean(properties.readOnly)}
      inputProps={properties}
    />
  );
}
