import type { InputType } from '../../core/policy.js';
import { INPUT_POLICY } from '../../core/input-policy.js';
import { inputEmailSchema } from './value.schema.js';

interface InputSubmissionValue {
  readonly value: string;
  readonly required?: boolean | undefined;
  readonly minLength?: number | undefined;
  readonly inputType?: InputType | undefined;
}

export function inputSubmissionMessage(
  value: InputSubmissionValue,
): string | undefined {
  if (value.value.length === 0) {
    return value.required ? INPUT_POLICY.requiredMessage : undefined;
  }
  if (value.minLength !== undefined && value.value.length < value.minLength) {
    return (
      `${INPUT_POLICY.minimumMessagePrefix} ${value.minLength} ` +
      INPUT_POLICY.minimumMessageSuffix
    );
  }
  if (value.inputType === 'email' && !inputEmailSchema.safeParse(value.value).success) {
    return INPUT_POLICY.emailMessage;
  }
  return undefined;
}
