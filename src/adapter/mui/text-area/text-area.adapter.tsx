import { useMaterialTextConstraint } from '../form/use-text-constraint.js';
import { useId } from 'react';
import { materialDescriptionIds } from '../description-ids.js';
import { emitNativeValue } from '../native-value.js';
import TextField from '@mui/material/TextField';
import type { TextAreaProps } from
  '@fastsprout/reacd/adapter-runtime/components/text-area/text-area.props.js';
import { useNativeField } from '../native-field.js';

export type MuiTextAreaProps = TextAreaProps;

export function MuiTextArea(props: MuiTextAreaProps) {
  const field = useNativeField(props);
  const id = useId();
  const validation = useMaterialTextConstraint<HTMLTextAreaElement>({
    id,
    label: props.label,
    value: props.value,
    required: field.required,
    disabled: field.disabled,
  });
  const error = field.error || validation.error;
  const help = field.helperError || validation.error;

  return (
    <TextField
      inert={field.blocked}
      id={id}
      name={field.name}
      slotProps={{
        htmlInput: {
          'aria-describedby': materialDescriptionIds(
            field.descriptionIds,
            `${id}-helper-text`,
            help,
          ),
        },
      }}
      inputRef={validation.inputRef}
      fullWidth
      multiline
      label={props.label}
      value={props.value}
      rows={props.rows}
      placeholder={props.placeholder}
      required={field.required}
      disabled={field.disabled}
      helperText={help}
      error={Boolean(error)}
      onChange={(event) => {
        emitNativeValue(props.onValueChange, event.target.value, field.blocked);
      }}
    />
  );
}
