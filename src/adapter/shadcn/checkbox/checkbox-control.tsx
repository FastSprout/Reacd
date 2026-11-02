import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import type { Ref } from 'react';
import type { CheckboxProps } from
  '@fastsprout/reacd/adapter-runtime/components/checkbox/checkbox.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Checkbox } from '../vendor/ui/checkbox.js';

import { FieldError, FieldLabel, FieldTitle } from '../vendor/ui/field.js';

export interface CheckboxControlProps extends CheckboxProps {
  readonly id: string;
  readonly inputRef?: Ref<HTMLButtonElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly error?: string | undefined;
  readonly managed?: boolean;
}

export function ShadcnCheckboxControl({
  id,
  inputRef,
  onBlur,
  error,
  managed = false,
  label,
  checked,
  onCheckedChange,
  indeterminate,
  description,
  readOnly,
  value,
  ...properties
}: CheckboxControlProps) {
  const metadata = useNativeField(properties, description ? [`${id}-help`] : []);
  return (
    <div className="grid gap-2">
      <FieldLabel
        htmlFor={id}
        className="min-w-0 max-w-full items-center"
        style={{
          minBlockSize: LAYOUT_POLICY.controlTargetPx,
          minInlineSize: LAYOUT_POLICY.controlTargetPx,
        }}
      >
        <Checkbox
          id={id}
          ref={inputRef}
          onBlur={onBlur}
          checked={indeterminate ? 'indeterminate' : checked}
          name={metadata.name}
          required={!managed && metadata.required}
          aria-required={metadata.required}
          disabled={metadata.disabled}
          value={value}
          aria-readonly={readOnly}
          aria-invalid={Boolean(error || metadata.error)}
          aria-describedby={
            [...metadata.descriptionIds, ...(error ? [`${id}-error`] : [])].join(' ') ||
            undefined
          }
          onCheckedChange={(next) => {
            requestNativeChange(Boolean(readOnly || metadata.blocked), () =>
              onCheckedChange(next === true),
            );
          }}
        />
        <FieldTitle className="min-w-0 break-words">{label}</FieldTitle>
      </FieldLabel>
      {description && <p id={`${id}-help`}>{description}</p>}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}
