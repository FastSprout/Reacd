import { useEffect, useEffectEvent } from 'react';
import type { ControllerProps } from 'react-hook-form';
import { FormField as SdkFormField } from '../vendor/ui/form.js';
import { useRegistration } from './use-registration.js';

type ManagedFieldProps = Omit<ControllerProps<Record<string, unknown>>, 'name'> & {
  readonly registrationId: string;
  readonly validationKey?: string | undefined;
};

export function ManagedFormField({
  registrationId,
  validationKey,
  ...props
}: ManagedFieldProps) {
  const { form, scope, name } = useRegistration(registrationId, {
    ...props.rules,
    disabled: Boolean(props.disabled),
  });
  const revision = JSON.stringify(props.defaultValue);
  const trigger = form.trigger;
  const revalidate = useEffectEvent(() => {
    if (form.getFieldState(name).error) {
      scope?.prepare();
      void trigger(name);
    }
  });
  useEffect(() => {
    revalidate();
  }, [revision, validationKey, props.disabled]);
  return (
    <SdkFormField
      {...props}
      name={name}
      render={(value) =>
        props.render({
          ...value,
          field: {
            ...value.field,
            onChange: (next: unknown) => {
              scope?.prepare();
              value.field.onChange(next);
            },
            onBlur: () => {
              scope?.prepare();
              value.field.onBlur();
            },
          },
        })
      }
    />
  );
}
