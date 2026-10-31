import { useId, useRef, useState } from 'react';
import type { CheckboxProps } from
  '@fastsprout/reacd/adapter-runtime/components/checkbox/checkbox.js';
import { CHECKBOX_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/checkbox-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Checkbox } from '../vendor/ui/checkbox.js';
import { Label } from '../vendor/ui/label.js';

export function ShadcnCheckbox({
  label,
  checked,
  onCheckedChange,
  indeterminate,
  description,
  name,
  value,
  required,
  disabled,
  readOnly,
}: CheckboxProps) {
  const id = useId();
  const control = useRef<HTMLButtonElement>(null);
  const [attempted, setAttempted] = useState(false);
  const metadata = useFieldMetadata(
    { name, required, disabled },
    description ? [`${id}-description`] : [],
  );
  const accepted = checked && !indeterminate;
  const localError =
    attempted && metadata.required && !accepted ? CHECKBOX_POLICY.requiredMessage : '';
  const feedback = metadata.error || localError;
  const descriptions = [
    ...metadata.descriptionIds,
    ...(localError && !metadata.error ? [`${id}-error`] : []),
  ];
  return (
    <div className="reacd-node reacd-field reacd-checkbox">
      <div className="reacd-check">
        <Checkbox
          ref={control}
          id={id}
          checked={indeterminate ? 'indeterminate' : checked}
          disabled={metadata.disabled}
          aria-readonly={readOnly || undefined}
          aria-required={metadata.required || undefined}
          aria-invalid={Boolean(feedback) || undefined}
          aria-describedby={descriptions.join(' ') || undefined}
          onCheckedChange={(next) => {
            if (!metadata.disabled && !readOnly) onCheckedChange(next === true);
          }}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
      {description && <p id={`${id}-description`}>{description}</p>}
      {localError && !metadata.error && (
        <p id={`${id}-error`} role="alert" className="reacd-field-error">
          {localError}
        </p>
      )}
      <input
        type="hidden"
        name={metadata.name}
        value={value ?? CHECKBOX_POLICY.submittedValue}
        disabled={metadata.disabled || !accepted}
      />
      <input
        type="text"
        hidden
        defaultValue=""
        required={metadata.required && !accepted}
        disabled={metadata.disabled}
        onInvalid={(event) => {
          event.preventDefault();
          setAttempted(true);
          control.current?.focus();
        }}
      />
    </div>
  );
}
