import { MuiFieldFeedbackContext } from './feedback-context.js';
import { useContext, useId, useRef } from 'react';
import { MuiControlledErrorContext } from './controlled-error-context.js';
import { useControlledError } from './use-controlled-error.js';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import type { FormFieldProps } from
  '@fastsprout/reacd/adapter-runtime/components/form-field/form-field.props.js';
import { FieldMetadataContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { useNativeField } from '../native-field.js';

export type MuiFormFieldProps = FormFieldProps;

export function MuiFormField(props: MuiFormFieldProps) {
  const id = useId();
  const group = useRef<HTMLFieldSetElement>(null);
  const field = useNativeField(props);
  const feedback = [
    { id: `${id}-description`, text: props.description },
    { id: `${id}-hint`, text: props.hint },
    { id: `${id}-help`, text: props.help },
  ];
  const error = props.error ?? field.error;
  const owner = useContext(MuiControlledErrorContext);
  const inherited = props.error === undefined && owner === error;
  useControlledError({
    id,
    label: props.label ?? props.name,
    error,
    disabled: field.disabled || inherited,
    group,
  });
  const descriptionIds = [
    ...field.descriptionIds,
    ...feedback.filter((item) => item.text).map((item) => item.id),
    ...(error ? [`${id}-error`] : []),
  ];
  return (
    <FormControl
      component="fieldset"
      ref={group}
      tabIndex={-1}
      aria-label={props.label === undefined ? props.name : undefined}
      inert={field.blocked}
      fullWidth
      disabled={field.disabled}
      required={field.required}
      error={Boolean(error)}
    >
      {props.label && <FormLabel component="legend">{props.label}</FormLabel>}
      <FieldMetadataContext value={{ ...field, error, descriptionIds }}>
        <MuiControlledErrorContext value={error || owner}>
          <MuiFieldFeedbackContext value={true}>
            {props.children}
          </MuiFieldFeedbackContext>
        </MuiControlledErrorContext>
      </FieldMetadataContext>
      {feedback.map(
        (item) =>
          item.text && (
            <FormHelperText key={item.id} id={item.id}>
              {item.text}
            </FormHelperText>
          ),
      )}
      {error && (
        <FormHelperText id={`${id}-error`} error>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
}
