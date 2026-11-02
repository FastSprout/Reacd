import { useMaterialTextConstraint } from '../form/use-text-constraint.js';
import { materialDescriptionIds } from '../description-ids.js';
import { emitNativeValue } from '../native-value.js';
import { useId } from 'react';
import TextField from '@mui/material/TextField';
import type { TextareaProps } from
  '@fastsprout/reacd/adapter-runtime/components/textarea/textarea.props.js';
import { TEXTAREA_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/textarea-policy.js';
import { useNativeField } from '../native-field.js';

export type MuiTextareaProps = TextareaProps;

export function MuiTextarea(props: MuiTextareaProps) {
  const id = useId();
  const field = useNativeField(props);
  const validation = useMaterialTextConstraint<HTMLTextAreaElement>({
    id,
    label: props.label,
    value: props.value,
    required: field.required,
    disabled: field.disabled,
    minLength: props.minLength,
  });
  const error = field.error || validation.error;
  const help = field.helperError || validation.error || props.description;

  const blocked = field.blocked || Boolean(props.readOnly);
  return (
    <TextField
      inert={field.blocked}
      id={id}
      inputRef={validation.inputRef}
      fullWidth
      multiline
      label={props.label}
      value={props.value}
      name={field.name}
      disabled={field.disabled}
      required={field.required}
      placeholder={props.placeholder}
      helperText={help}
      error={Boolean(error)}
      {...(props.autoResize
        ? {
            minRows: props.rows ?? TEXTAREA_POLICY.defaultRows,
            maxRows: props.maxRows ?? TEXTAREA_POLICY.defaultMaxRows,
          }
        : { rows: props.rows ?? TEXTAREA_POLICY.defaultRows })}
      slotProps={{
        input: { readOnly: Boolean(props.readOnly) },
        htmlInput: {
          minLength: props.minLength,
          maxLength: props.maxLength ?? TEXTAREA_POLICY.maximumLength,
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
