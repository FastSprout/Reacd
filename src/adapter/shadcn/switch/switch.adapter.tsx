import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { SwitchProps } from
  '@fastsprout/reacd/adapter-runtime/components/switch/switch.props.js';
import { SWITCH_POLICY } from '@fastsprout/reacd/adapter-runtime/core/switch-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { ShadcnSwitchControl } from './switch-control.js';

export type ShadcnSwitchProps = SwitchProps;

export function ShadcnSwitch(props: SwitchProps) {
  const id = useId();
  const form = useFormContext<Record<string, unknown>>();
  const metadata = useNativeField(props);
  if (!form) return <ShadcnSwitchControl {...props} id={id} />;
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
          props.checked ||
          SWITCH_POLICY.requiredMessage,
      }}
      render={({ field, fieldState }) => (
        <ShadcnSwitchControl
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
