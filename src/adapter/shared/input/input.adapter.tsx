import { useId, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import type { InputProps } from
  '@fastsprout/reacd/adapter-runtime/components/input/input.js';
import { INPUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/input-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Input } from '../primitives/input.js';
import { Label } from '../primitives/label.js';
import { inputValidationMessage } from './validation-message.js';

export function SharedInput({
  label,
  value,
  onValueChange,
  inputType,
  placeholder,
  name,
  required,
  disabled,
  description,
  readOnly,
  loading,
  minLength,
  maxLength,
  autoComplete,
}: InputProps) {
  const id = useId();
  const control = useRef<HTMLInputElement>(null);
  const [attempted, setAttempted] = useState(false);
  const metadata = useFieldMetadata(
    { name, required, disabled },
    description ? [`${id}-description`] : [],
  );
  const minimum = minLength ?? INPUT_POLICY.minimumLength;
  const maximum = maxLength ?? INPUT_POLICY.maximumLength;
  const type = inputType ?? INPUT_POLICY.defaultType;
  const localError = inputValidationMessage(
    value,
    metadata.required,
    minimum,
    type === 'email',
  );
  const visibleError = attempted ? localError : '';
  const feedback = metadata.error || visibleError;
  const descriptions = [
    ...metadata.descriptionIds,
    ...(visibleError && !metadata.error ? [`${id}-error`] : []),
  ];
  function invalid(event: SyntheticEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAttempted(true);
    control.current?.focus();
  }
  return (
    <div className="reacd-node reacd-field reacd-input">
      <Label htmlFor={id}>{label}</Label>
      {description && <p id={`${id}-description`}>{description}</p>}
      <Input
        ref={control}
        id={id}
        type={type}
        value={value}
        name={metadata.name}
        placeholder={placeholder}
        required={metadata.required}
        disabled={metadata.disabled}
        readOnly={readOnly || loading}
        minLength={minimum}
        maxLength={maximum}
        autoComplete={autoComplete}
        aria-invalid={Boolean(feedback) || undefined}
        aria-busy={loading || undefined}
        aria-describedby={descriptions.join(' ') || undefined}
        onInvalid={invalid}
        onChange={(event) => {
          const next = event.target.value;
          if (!metadata.disabled && !readOnly && !loading && next.length <= maximum) {
            onValueChange(next);
          }
        }}
      />
      {loading && (
        <p role="status">
          {INPUT_POLICY.loadingPrefix} {label}
        </p>
      )}
      {visibleError && !metadata.error && (
        <p id={`${id}-error`} role="alert" className="reacd-field-error">
          {visibleError}
        </p>
      )}
      <input
        type="text"
        hidden
        defaultValue=""
        required={Boolean(localError)}
        disabled={metadata.disabled}
        onInvalid={invalid}
      />
    </div>
  );
}
