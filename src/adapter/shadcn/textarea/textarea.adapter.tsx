import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { TextareaProps } from
  '@fastsprout/reacd/adapter-runtime/components/textarea/textarea.props.js';
import { TEXTAREA_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/textarea-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Textarea } from '../vendor/ui/textarea.js';
import { useTextRegistration } from '../form-field/use-text-registration.js';
import { Label } from '../vendor/ui/label.js';
import { FieldDescription, FieldError } from '../vendor/ui/field.js';

export type ShadcnTextareaProps = TextareaProps;
export function ShadcnTextarea({
  label,
  value,
  onValueChange,
  placeholder,
  rows = TEXTAREA_POLICY.defaultRows,
  maxRows = TEXTAREA_POLICY.defaultMaxRows,
  autoResize,
  readOnly,
  minLength,
  maxLength = TEXTAREA_POLICY.maximumLength,
  description,
  ...properties
}: TextareaProps) {
  const id = useId();
  const metadata = useNativeField(properties, description ? [`${id}-help`] : []);
  const registered = useTextRegistration(metadata, id, { value, minLength });
  const error = registered?.error;
  const ownError = error && error !== metadata.error ? error : undefined;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        ref={registered?.ref}
        onBlur={registered?.onBlur}
        onInvalid={registered?.onInvalid}
        id={id}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={metadata.disabled}
        required={metadata.required}
        name={metadata.name}
        readOnly={readOnly}
        minLength={minLength}
        maxLength={maxLength}
        style={
          autoResize
            ? { fieldSizing: 'content', maxBlockSize: `${maxRows}lh` }
            : undefined
        }
        aria-invalid={Boolean(error || metadata.error)}
        aria-describedby={
          [...metadata.descriptionIds, ...(ownError ? [`${id}-error`] : [])].join(
            ' ',
          ) || undefined
        }
        onChange={(event) => {
          requestNativeChange(Boolean(metadata.blocked || readOnly), () => {
            onValueChange(event.target.value);
            registered?.onChange(event);
          });
        }}
      />
      {description && (
        <FieldDescription id={`${id}-help`}>{description}</FieldDescription>
      )}
      {ownError && <FieldError id={`${id}-error`}>{ownError}</FieldError>}
    </div>
  );
}
