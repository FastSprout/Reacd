import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { PinInputProps } from
  '@fastsprout/reacd/adapter-runtime/components/pin-input/pin-input.props.js';
import { PIN_INPUT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/pin-input-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { ShadcnPinControl } from './pin-control.js';

export type ShadcnPinInputProps = PinInputProps;

export function ShadcnPinInput(props: ShadcnPinInputProps) {
  const id = useId();
  const form = useFormContext<Record<string, unknown>>();
  const metadata = useNativeField(props);
  const length = props.length ?? PIN_INPUT_POLICY.length;
  if (!form) return <ShadcnPinControl {...props} id={id} />;
  return (
    <ManagedFormField
      registrationId={id}
      validationKey={JSON.stringify([metadata.error, metadata.required])}
      control={form.control}
      defaultValue={props.value}
      disabled={metadata.disabled}
      rules={{
        validate: () =>
          metadata.error ||
          (!metadata.required && props.value.length === 0) ||
          props.value.length === length ||
          PIN_INPUT_POLICY.incompleteMessage,
      }}
      render={({ field, fieldState }) => (
        <ShadcnPinControl
          {...props}
          id={id}
          inputRef={field.ref}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
          onValueChange={(value) => {
            props.onValueChange(value);
            field.onChange(value);
          }}
        />
      )}
    />
  );
}
