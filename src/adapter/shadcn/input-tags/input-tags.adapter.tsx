import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { InputTagsProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-tags/input-tags.props.js';
import { INPUT_TAGS_MESSAGES } from
  '@fastsprout/reacd/adapter-runtime/core/input-tags-policy.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ManagedFormField } from '../form/managed-field.js';
import { InputTagsControl } from './input-tags-control.js';

export type ShadcnInputTagsProps = InputTagsProps;

export function ShadcnInputTags(props: InputTagsProps) {
  const id = useId();
  const form = useFormContext<Record<string, unknown>>();
  const metadata = useNativeField(props);
  if (!form) return <InputTagsControl {...props} id={id} />;
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
          INPUT_TAGS_MESSAGES.required,
      }}
      render={({ field, fieldState }) => (
        <InputTagsControl
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
