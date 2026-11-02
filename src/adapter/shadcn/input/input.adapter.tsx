import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import { useId } from 'react';
import type { InputProps } from
  '@fastsprout/reacd/adapter-runtime/components/input/input.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { INPUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/input-policy.js';
import { Input } from '../vendor/ui/input.js';
import { useTextRegistration } from '../form-field/use-text-registration.js';
import { Label } from '../vendor/ui/label.js';
import { FieldDescription, FieldError } from '../vendor/ui/field.js';

export type ShadcnInputProps = InputProps;
export function ShadcnInput({
  label,
  value,
  onValueChange,
  inputType = 'text',
  description,
  loading,
  placeholder,
  readOnly,
  minLength,
  maxLength = INPUT_POLICY.maximumLength,
  autoComplete,
  ...properties
}: InputProps) {
  const id = useId();
  const metadata = useNativeField(properties, description ? [`${id}-help`] : []);
  const registered = useTextRegistration(metadata, id, { value, minLength, inputType });
  const error = registered?.error;
  const ownError = error && error !== metadata.error ? error : undefined;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx }}
        ref={registered?.ref}
        onBlur={registered?.onBlur}
        onInvalid={registered?.onInvalid}
        id={id}
        type={inputType}
        value={value}
        onChange={(event) => {
          requestNativeChange(Boolean(metadata.blocked || readOnly || loading), () => {
            onValueChange(event.target.value);
            registered?.onChange(event);
          });
        }}
        name={metadata.name}
        required={metadata.required}
        disabled={metadata.disabled}
        readOnly={readOnly || loading}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-busy={loading}
        aria-invalid={Boolean(error || metadata.error)}
        aria-describedby={
          [...metadata.descriptionIds, ...(ownError ? [`${id}-error`] : [])].join(
            ' ',
          ) || undefined
        }
      />
      {description && (
        <FieldDescription id={`${id}-help`}>{description}</FieldDescription>
      )}
      {loading && (
        <FieldDescription role="status">
          {`${INPUT_POLICY.loadingPrefix} ${label}`}
        </FieldDescription>
      )}
      {ownError && <FieldError id={`${id}-error`}>{ownError}</FieldError>}
    </div>
  );
}
