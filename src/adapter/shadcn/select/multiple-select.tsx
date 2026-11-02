import { useFormContext } from 'react-hook-form';
import type { MultipleSelectProps } from './multiple-select.props.js';
import { SELECT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/select-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { MultipleSelectControl } from './multiple-select-control.js';

export function MultipleSelect(props: MultipleSelectProps) {
  const form = useFormContext<Record<string, unknown>>();
  const field = useNativeField(props);
  if (!form) return <MultipleSelectControl {...props} />;
  return (
    <ManagedFormField
      registrationId={props.id}
      validationKey={JSON.stringify([field.error, field.required])}
      control={form.control}
      defaultValue={props.value}
      disabled={field.disabled}
      rules={{
        validate: () =>
          field.error ||
          !field.required ||
          props.value.length > 0 ||
          SELECT_POLICY.multipleRequiredMessage,
      }}
      render={({ field: native, fieldState }) => (
        <MultipleSelectControl
          {...props}
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
