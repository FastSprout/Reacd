import { useId, useRef } from 'react';
import type { FormFieldProps } from '../../../components/form-field/index.js';
import { FORM_FIELD_POLICY } from '../../../core/form-field-policy.js';
import {
  FieldMetadataContext,
  useFieldMetadata,
} from '../../../renderer/form-field/field-metadata.js';
import { focusFieldControl } from './focus-control.js';

export function ShadcnFormField({
  name,
  label,
  description,
  hint,
  help,
  error,
  required,
  disabled,
  children,
}: FormFieldProps) {
  const id = useId();
  const root = useRef<HTMLFieldSetElement>(null);
  const localError = error?.trim() ?? '';
  const feedback = localError || help;
  const ids = [
    ...(description ? [`${id}-description`] : []),
    ...(hint ? [`${id}-hint`] : []),
    ...(feedback ? [`${id}-feedback`] : []),
  ];
  const metadata = useFieldMetadata({ name, required, disabled }, ids);
  const value = { ...metadata, error: localError || metadata.error };
  return (
    <FieldMetadataContext value={value}>
      <fieldset
        ref={root}
        tabIndex={-1}
        disabled={value.disabled}
        className="reacd-node reacd-form-field"
        aria-describedby={value.descriptionIds.join(' ') || undefined}
        aria-invalid={Boolean(value.error) || undefined}
      >
        {label && (
          <legend>
            {label}
            {value.required && <> {FORM_FIELD_POLICY.requiredIndicator}</>}
          </legend>
        )}
        {hint && (
          <p id={`${id}-hint`} className="reacd-field-hint">
            {hint}
          </p>
        )}
        {description && <p id={`${id}-description`}>{description}</p>}
        {children}
        {feedback && (
          <p
            id={`${id}-feedback`}
            role={localError ? 'alert' : undefined}
            className={localError ? 'reacd-field-error' : undefined}
          >
            {feedback}
          </p>
        )}
        <input
          type="text"
          hidden
          defaultValue=""
          required={Boolean(localError)}
          disabled={value.disabled}
          onInvalid={(event) => {
            event.preventDefault();
            focusFieldControl(root.current);
          }}
        />
      </fieldset>
    </FieldMetadataContext>
  );
}
