import { useId, useRef, useState } from 'react';
import type { TextareaProps } from
  '@fastsprout/reacd/adapter-runtime/components/textarea/textarea.props.js';
import { TEXTAREA_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/textarea-policy.js';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { Textarea } from '../primitives/textarea.js';
import { Label } from '../primitives/label.js';
import { useAutoRows } from './use-auto-rows.js';

export function SharedTextarea({
  label,
  value,
  onValueChange,
  description,
  name,
  required,
  disabled,
  readOnly,
  minLength,
  maxLength,
  rows,
  autoResize,
  maxRows,
  placeholder,
}: TextareaProps) {
  const id = useId();
  const control = useRef<HTMLTextAreaElement>(null);
  const [attempted, setAttempted] = useState(false);
  const metadata = useFieldMetadata(
    { name, required, disabled },
    description ? [`${id}-description`] : [],
  );
  const minimum = minLength ?? TEXTAREA_POLICY.minimumLength;
  const maximum = maxLength ?? TEXTAREA_POLICY.maximumLength;
  const baseRows = rows ?? TEXTAREA_POLICY.defaultRows;
  useAutoRows(
    control,
    autoResize,
    value,
    baseRows,
    maxRows ?? TEXTAREA_POLICY.defaultMaxRows,
  );
  const localError =
    metadata.required && value.length === 0
      ? TEXTAREA_POLICY.requiredMessage
      : value.length > 0 && value.length < minimum
        ? `${TEXTAREA_POLICY.minimumMessagePrefix} ${minimum} ` +
          TEXTAREA_POLICY.minimumMessageSuffix
        : '';
  const visibleError = attempted ? localError : '';
  const feedback = metadata.error || visibleError;
  const descriptions = [
    ...metadata.descriptionIds,
    ...(visibleError && !metadata.error ? [`${id}-error`] : []),
  ];
  function invalid(
    event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    event.preventDefault();
    setAttempted(true);
    control.current?.focus();
  }
  return (
    <div
      className="reacd-node reacd-field reacd-textarea"
      data-auto-resize={autoResize || undefined}
    >
      <Label htmlFor={id}>{label}</Label>
      {description && <p id={`${id}-description`}>{description}</p>}
      <Textarea
        ref={control}
        id={id}
        value={value}
        name={metadata.name}
        placeholder={placeholder}
        required={metadata.required}
        disabled={metadata.disabled}
        readOnly={readOnly}
        minLength={minimum}
        maxLength={maximum}
        rows={baseRows}
        aria-invalid={Boolean(feedback) || undefined}
        aria-describedby={descriptions.join(' ') || undefined}
        onInvalid={invalid}
        onChange={(event) => {
          const next = event.target.value;
          if (!metadata.disabled && !readOnly && next.length <= maximum) {
            onValueChange(next);
          }
        }}
      />
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
