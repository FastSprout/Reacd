import { MuiFieldFeedbackContext } from './form-field/feedback-context.js';
import { useContext } from 'react';
import { useFieldMetadata } from
  '@fastsprout/reacd/adapter-runtime/renderer/form-field/field-metadata.js';
import { useInteractionState } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';

interface FieldOptions {
  readonly name?: string | undefined;
  readonly required?: boolean | undefined;
  readonly disabled?: boolean | undefined;
}

export function useNativeField(options: FieldOptions) {
  const metadata = useFieldMetadata(options);
  const { active, pending } = useInteractionState();
  const ownedFeedback = useContext(MuiFieldFeedbackContext);
  const disabled = metadata.disabled || !active;
  return {
    ...metadata,
    disabled,
    blocked: disabled || pending,
    helperError: ownedFeedback ? '' : metadata.error,
  };
}
