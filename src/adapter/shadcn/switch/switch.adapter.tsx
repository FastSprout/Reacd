import { useId, useRef, useState } from 'react';
import type { SwitchProps } from '../../../components/switch/switch.props.js';
import { SWITCH_POLICY } from '../../../core/switch-policy.js';
import { useFieldMetadata } from '../../../renderer/form-field/field-metadata.js';
import { Switch } from '../vendor/ui/switch.js';
import { Label } from '../vendor/ui/label.js';

export function ShadcnSwitch({
  label,
  description,
  checked,
  onCheckedChange,
  name,
  value,
  required,
  disabled,
  readOnly,
  loading,
}: SwitchProps) {
  const id = useId();
  const control = useRef<HTMLButtonElement>(null);
  const [attempted, setAttempted] = useState(false);
  const metadata = useFieldMetadata(
    { name, required, disabled },
    description ? [`${id}-description`] : [],
  );
  const localError =
    attempted && metadata.required && !checked ? SWITCH_POLICY.requiredMessage : '';
  const feedback = metadata.error || localError;
  const descriptions = [
    ...metadata.descriptionIds,
    ...(localError && !metadata.error ? [`${id}-error`] : []),
  ];
  return (
    <div className="reacd-node reacd-field reacd-switch">
      <div className="reacd-check reacd-toggle">
        <Switch
          ref={control}
          id={id}
          checked={checked}
          disabled={metadata.disabled}
          aria-readonly={readOnly || undefined}
          aria-required={metadata.required || undefined}
          aria-busy={loading || undefined}
          aria-invalid={Boolean(feedback) || undefined}
          aria-describedby={descriptions.join(' ') || undefined}
          onCheckedChange={(next) => {
            if (!metadata.disabled && !readOnly && !loading) onCheckedChange(next);
          }}
        />
        <Label htmlFor={id}>{label}</Label>
      </div>
      {description && <p id={`${id}-description`}>{description}</p>}
      {loading && (
        <p role="status">
          {SWITCH_POLICY.loadingPrefix} {label}
        </p>
      )}
      {localError && !metadata.error && (
        <p id={`${id}-error`} role="alert" className="reacd-field-error">
          {localError}
        </p>
      )}
      <input
        type="hidden"
        name={metadata.name}
        value={value ?? SWITCH_POLICY.submittedValue}
        disabled={metadata.disabled || !checked}
      />
      <input
        type="text"
        hidden
        defaultValue=""
        required={metadata.required && !checked}
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
