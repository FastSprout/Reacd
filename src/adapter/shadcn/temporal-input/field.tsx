import type { DateFieldRenderProps } from 'react-aria-components';
import { useId, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { INPUT_DATE_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-date-policy.js';
import { INPUT_TIME_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/input-time-policy.js';
import { ManagedFormField } from '../form/managed-field.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { TemporalControl } from './control.js';
import type { TemporalFieldProps } from './field.props.js';
import { temporalDraftIssue } from './validation.js';

export function NativeTemporalField(props: TemporalFieldProps) {
  const id = useId();
  const state = useRef<DateFieldRenderProps['state'] | null>(null);
  const field = useNativeField(props);
  const form = useFormContext<Record<string, unknown>>();
  if (!form) return <TemporalControl {...props} />;
  return (
    <ManagedFormField
      registrationId={id}
      validationKey={JSON.stringify([field.error, field.required])}
      control={form.control}
      defaultValue={props.value}
      disabled={field.disabled}
      rules={{
        validate: () =>
          field.error ||
          temporalDraftIssue(props, state.current) ||
          !field.required ||
          props.value !== null ||
          (props.kind === 'date'
            ? INPUT_DATE_POLICY.incompleteValue
            : INPUT_TIME_POLICY.incompleteValue),
      }}
      render={({ field: native, fieldState }) => (
        <TemporalControl
          {...props}
          stateRef={state}
          inputRef={native.ref}
          onBlur={native.onBlur}
          validationError={fieldState.error?.message}
          onValueChange={(value) => {
            props.onValueChange(value);
            native.onChange(value);
          }}
        />
      )}
    />
  );
}
