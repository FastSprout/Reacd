import { INPUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/input-policy.js';
import { inputEmailSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input/value.schema.js';

export function inputValidationMessage(
  value: string,
  required: boolean,
  minimum: number,
  email: boolean,
): string {
  if (value.length === 0) return required ? INPUT_POLICY.requiredMessage : '';
  if (value.length < minimum)
    return (
      `${INPUT_POLICY.minimumMessagePrefix} ` +
      `${minimum} ${INPUT_POLICY.minimumMessageSuffix}`
    );
  if (email && !inputEmailSchema.safeParse(value).success) {
    return INPUT_POLICY.emailMessage;
  }
  return '';
}
