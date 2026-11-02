import { FORM_SUBMIT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/form-submit-policy.js';

export function registrationId(id: string) {
  return `${FORM_SUBMIT_POLICY.privateFieldPrefix}${encodeURIComponent(id).replaceAll(
    '.',
    '%2E',
  )}`;
}
