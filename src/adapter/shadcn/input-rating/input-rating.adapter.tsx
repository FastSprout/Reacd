import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { InputRatingProps } from
  '@fastsprout/reacd/adapter-runtime/components/input-rating/input-rating.props.js';
import {
  INPUT_RATING_DEFAULTS,
  INPUT_RATING_LABELS,
  INPUT_RATING_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/input-rating-policy.js';
import { UnsupportedAdapterComponentError } from
  '@fastsprout/reacd/adapter-runtime/core/unsupported-adapter-component-error.js';
import { ManagedFormField } from '../form/managed-field.js';
import { useNativeField } from '../form-field/use-native-field.js';
import { ShadcnRatingControl } from './rating-control.js';

export type ShadcnInputRatingProps = InputRatingProps;

export function ShadcnInputRating(props: InputRatingProps) {
  const id = useId();
  const form = useFormContext<Record<string, unknown>>();
  const field = useNativeField(props);
  if (props.hoverable ?? INPUT_RATING_DEFAULTS.shadcnHoverable)
    throw new UnsupportedAdapterComponentError('shadcn-ui', 'InputRating');
  if (!form) return <ShadcnRatingControl {...props} id={id} />;
  return (
    <ManagedFormField
      registrationId={id}
      validationKey={JSON.stringify([field.error, field.required])}
      control={form.control}
      defaultValue={props.value}
      disabled={field.disabled}
      rules={{
        validate: () =>
          !field.required ||
          props.value !== INPUT_RATING_POLICY.emptyValue ||
          INPUT_RATING_LABELS.requiredMessage,
      }}
      render={({ field: native, fieldState }) => (
        <ShadcnRatingControl
          {...props}
          id={id}
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
