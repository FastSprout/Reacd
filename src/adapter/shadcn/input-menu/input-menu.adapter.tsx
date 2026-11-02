import { registrationId } from '../form/registration-id.js';
import { useContext, useEffect, useId } from 'react';
import { RegistrationContext } from '../form/registration-context.js';
import { useFormContext } from 'react-hook-form';
import type { InputMenuProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-menu/input-menu.props.js';
import { FORM_MENU_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/form-menu-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { InputMenuControl } from './input-menu-control.js';

export type ShadcnInputMenuProps = InputMenuProps;
export function ShadcnInputMenu(props: InputMenuProps) {
  const id = useId();
  const metadata = useNativeField(props);
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
    metadata.required,
    metadata.disabled,
    metadata.error,
  ]);
  if (!form) return <InputMenuControl {...props} id={id} />;
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
          !metadata.required ||
          props.value.length > 0 ||
          FORM_MENU_DEFAULTS.requiredMessage,
      }}
      render={({ field, fieldState }) => (
        <InputMenuControl
          {...props}
          id={id}
          managed
          inputRef={field.ref}
          onBlur={field.onBlur}
          validationError={
            fieldState.error?.message === metadata.error
              ? undefined
              : fieldState.error?.message
          }
          onAccepted={(value) => field.onChange(value)}
        />
      )}
    />
  );
}
