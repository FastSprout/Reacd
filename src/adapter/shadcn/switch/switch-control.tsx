import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { requestNativeChange } from '../form-field/request-native-change.js';
import type { Ref } from 'react';
import { SWITCH_POLICY } from '@fastsprout/reacd/adapter-runtime/core/switch-policy.js';
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '../vendor/ui/field.js';
import type { SwitchProps } from
  '@fastsprout/reacd/adapter-runtime/components/switch/switch.props.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { Switch } from '../vendor/ui/switch.js';

export interface SwitchControlProps extends SwitchProps {
  readonly id: string;
  readonly inputRef?: Ref<HTMLButtonElement> | undefined;
  readonly onBlur?: (() => void) | undefined;
  readonly error?: string | undefined;
  readonly managed?: boolean | undefined;
}

export function ShadcnSwitchControl({
  id,
  inputRef,
  onBlur,
  error,
  managed,
  label,
  checked,
  onCheckedChange,
  description,
  readOnly,
  loading,
  value,
  ...properties
}: SwitchControlProps) {
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
        <Switch
          id={id}
          ref={inputRef}
          onBlur={onBlur}
          checked={checked}
          name={metadata.name}
          value={value}
          required={!managed && metadata.required}
          aria-required={metadata.required}
          disabled={metadata.disabled}
          inert={metadata.blocked}
          aria-busy={loading}
          aria-readonly={readOnly}
          aria-invalid={Boolean(error || metadata.error)}
          aria-describedby={
            [...metadata.descriptionIds, ...(error ? [`${id}-error`] : [])].join(' ') ||
            undefined
          }
          onCheckedChange={(next) => {
            requestNativeChange(Boolean(readOnly || loading || metadata.blocked), () =>
              onCheckedChange(next),
            );
          }}
        />
        <FieldTitle className="min-w-0 break-words">{label}</FieldTitle>
      </FieldLabel>
      {description && <p id={`${id}-help`}>{description}</p>}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
      {loading && (
        <FieldDescription role="status">
          {`${SWITCH_POLICY.loadingPrefix} ${label}`}
        </FieldDescription>
      )}
    </div>
  );
}
