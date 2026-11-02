import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckboxProps } from
  '@fastsprout/reacd/adapter-runtime/components/checkbox/checkbox.props.js';
import { CHECKBOX_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/checkbox-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { ShadcnCheckboxControl } from './checkbox-control.js';

export type ShadcnCheckboxProps = CheckboxProps;

export function ShadcnCheckbox(props: ShadcnCheckboxProps) {
  const id = useId();
  const form = useFormContext<Record<string, unknown>>();
  const metadata = useNativeField(props);
  if (!form) return <ShadcnCheckboxControl {...props} id={id} />;
  return (
    <ManagedFormField
      registrationId={id}
      validationKey={JSON.stringify([metadata.error, metadata.required])}
      control={form.control}
      defaultValue={props.checked}
      disabled={metadata.disabled}
      rules={{
        validate: () =>
          metadata.error ||
          !metadata.required ||
          (props.checked && !props.indeterminate) ||
          CHECKBOX_POLICY.requiredMessage,
      }}
      render={({ field, fieldState }) => (
        <ShadcnCheckboxControl
          {...props}
          id={id}
          managed
          inputRef={field.ref}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
          onCheckedChange={(checked) => {
            props.onCheckedChange(checked);
            field.onChange(checked);
          }}
        />
      )}
    />
  );
}
