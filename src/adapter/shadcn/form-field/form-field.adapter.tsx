import { useId } from 'react';
import type { FormFieldProps } from
  '@fastsprout/reacd/adapter-runtime/components/form-field/form-field.props.js';
import {
  FieldMetadataContext,
  useFieldMetadata,
} from '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Field, FieldDescription, FieldError, FieldTitle } from '../vendor/ui/field.js';

export type ShadcnFormFieldProps = FormFieldProps;
export function ShadcnFormField({
  name,
  label,
  required,
  disabled,
  description,
  hint,
  help,
  error,
  children,
}: FormFieldProps) {
  const id = useId();
  const descriptions = Object.entries({ description, hint, help });
  const ids = descriptions
    .filter(([, text]) => Boolean(text))
    .map(([kind]) => `${id}-${kind}`);
  if (error) ids.push(`${id}-error`);
  const inherited = useFieldMetadata({ name, required, disabled }, ids);
  const metadata = { ...inherited, error: error ?? inherited.error };
  return (
    <Field
      aria-labelledby={label ? `${id}-label` : undefined}
      data-invalid={Boolean(metadata.error)}
      data-disabled={metadata.disabled}
    >
      {label && <FieldTitle id={`${id}-label`}>{label}</FieldTitle>}
      <FieldMetadataContext.Provider value={metadata}>
        {children}
      </FieldMetadataContext.Provider>
      {descriptions.map(
        ([kind, text]) =>
          text && (
            <FieldDescription key={kind} id={`${id}-${kind}`}>
              {text}
            </FieldDescription>
          ),
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  );
}
