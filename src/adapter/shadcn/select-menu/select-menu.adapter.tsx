import { registrationId } from '../form/registration-id.js';
import { useContext, useEffect, useId } from 'react';
import { RegistrationContext } from '../form/registration-context.js';
import { useFormContext } from 'react-hook-form';
import type { SelectMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/select-menu/select-menu.props.js';
import { SELECT_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/select-menu-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { SelectMenuControl } from './select-menu-control.js';

export type ShadcnSelectMenuProps = SelectMenuProps;
export function ShadcnSelectMenu(props: SelectMenuProps) {
  const id = useId();
  const field = useNativeField(props);
  const form = useFormContext<Record<string, unknown>>();
  const name = registrationId(id);
  const scope = useContext(RegistrationContext);
  const error = form?.getFieldState(name, form.formState).error?.message;
  const trigger = form?.trigger;
  useEffect(() => {
    if (trigger && error) {
      scope?.prepare();
      void trigger(name);
    }
  }, [
    trigger,
    scope,
    name,
    error,
    props.value,
    field.required,
    field.disabled,
    field.error,
  ]);
  if (!form) return <SelectMenuControl {...props} id={id} />;
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
          props.value.length > 0 ||
          SELECT_MENU_DEFAULTS.requiredMessage,
      }}
      render={({ field: native, fieldState }) => (
        <SelectMenuControl
          {...props}
          id={id}
          managed
          inputRef={native.ref}
          onBlur={native.onBlur}
          validationError={fieldState.error?.message}
          onAccepted={(value) => native.onChange(value)}
        />
      )}
    />
  );
}
