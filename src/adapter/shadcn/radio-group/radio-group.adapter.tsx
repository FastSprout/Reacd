import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { RadioGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/radio-group/radio-group.props.js';
import {
  CHOICE_DEFAULTS,
  CHOICE_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/choice-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { ShadcnRadioControl } from './radio-control.js';

export type ShadcnRadioGroupProps = RadioGroupProps;

export function ShadcnRadioGroup(props: RadioGroupProps) {
  const id = useId();
  const field = useNativeField(props);
  const form = useFormContext<Record<string, unknown>>();
  if (!form) return <ShadcnRadioControl {...props} id={id} />;
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
          !field.required ||
          props.value !== CHOICE_DEFAULTS.emptyValue ||
          CHOICE_POLICY.requiredMessage,
      }}
      render={({ field: native, fieldState }) => (
        <ShadcnRadioControl
          {...props}
          id={id}
          managed
          inputRef={native.ref}
          onBlur={native.onBlur}
          error={fieldState.error?.message}
          onValueChange={(value) => {
            props.onValueChange(value);
            native.onChange(value);
          }}
        />
      )}
    />
  );
}
