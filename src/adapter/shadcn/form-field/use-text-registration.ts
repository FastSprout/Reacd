import { useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useRegistration } from '../form/use-registration.js';
import type { FieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { inputSubmissionMessage } from
  '@fastsprout/reacd/adapter-runtime/schema/input/submission.js';

type Submission = Parameters<typeof inputSubmissionMessage>[0];

export function useTextRegistration(
  metadata: FieldMetadata,
  id: string,
  submission: Omit<Submission, 'required'>,
) {
  const options = {
    validate: () =>
      metadata.error ||
      inputSubmissionMessage({
        ...submission,
        required: metadata.required,
      }) ||
      true,
    disabled: metadata.disabled,
    shouldUnregister: true,
  };
  const { form, scope, name } = useRegistration(id, options);
  const registered = form?.register(name, options);
  const error = form?.getFieldState(name, form.formState).error?.message;
  const trigger = form?.trigger;
  const { value, minLength, inputType } = submission;
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
    value,
    minLength,
    inputType,
    metadata.required,
    metadata.error,
    metadata.disabled,
  ]);
  return registered
    ? {
        ...registered,
        error,
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          scope?.prepare();
          form.setValue(name, event.target.value, {
            shouldDirty: true,
            shouldValidate: Boolean(error),
          });
        },
        onBlur: () => {
          scope?.prepare();
          form.setValue(name, submission.value, {
            shouldTouch: true,
            shouldValidate: Boolean(error),
          });
        },
        onInvalid: () => {
          scope?.prepare();
          void trigger?.(name);
        },
      }
    : undefined;
}
