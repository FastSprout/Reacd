import { materialFieldError } from '../field-state.js';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { TextareaPrimitiveProps } from
  '../../../shared/primitives/textarea/textarea.props.js';

export function MuiTextareaPrimitive({
  ref,
  className,
  ...properties
}: TextareaPrimitiveProps) {
  return (
    <OutlinedInput
      error={materialFieldError(properties['aria-invalid'])}
      fullWidth
      multiline
      inputComponent="textarea"
      className={className}
      inputRef={ref}
      disabled={Boolean(properties.disabled)}
      readOnly={Boolean(properties.readOnly)}
      inputProps={properties}
    />
  );
}
