import { expect, it } from 'vitest';
import { Form } from '../../components/form/index.js';
import { formSchema } from './form.schema.js';
import { FORM_SUBMIT_POLICY } from '../../core/form-submit-policy.js';

const base = {
  label: 'Account',
  children: <Form label="Nested" onSubmit={() => {}} />,
  onSubmit() {},
};

it('accepts readonly summaries and compatible callbacks', () => {
  const parsed = formSchema.parse({
    ...base,
    submitting: true,
    disabled: false,
    errors: [
      { label: 'Network', message: 'Try again.' },
      { message: 'Review pending.' },
    ],
  });
  expect(Object.isFrozen(parsed.errors)).toBe(true);
  expect(Object.isFrozen(parsed.errors?.[0])).toBe(true);
  expect(formSchema.safeParse(base).success).toBe(true);
  for (const invalid of [
    { submitting: 'true' },
    { disabled: null },
    { errors: [{ message: ' ' }] },
    { errors: [{ label: ' ', message: 'Error' }] },
    { errors: [{ message: 'Error', href: '/escape' }] },
    { validate() {} },
    {
      errors: Array.from({ length: FORM_SUBMIT_POLICY.maximumIssues + 1 }, () => ({
        message: 'Error',
      })),
    },
  ]) {
    expect(formSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
  }
});
