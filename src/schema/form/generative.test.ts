import { expect, it } from 'vitest';
import { z } from 'zod';
import { createFormNodeSchema } from './generative.schema.js';
import { submitButtonNodeSchema } from '../submit-button/generative.schema.js';

it('validates recursive Form action capabilities and literal/read-only flags', () => {
  const schema = createFormNodeSchema(z.strictObject({ type: z.literal('Text') }));
  const node = {
    type: 'Form',
    label: 'Account',
    submitAction: 'save',
    disabled: { state: 'blocked', mode: 'read' },
    submitting: true,
    errors: [{ message: 'Retry is available.' }],
    children: [{ type: 'Text' }],
  };
  expect(schema.safeParse(node).success).toBe(true);
  expect(
    schema.safeParse({
      ...node,
      disabled: false,
      submitting: {
        state: 'busy',
        mode: 'read',
      },
    }).success,
  ).toBe(true);
  for (const invalid of [
    { submitAction: '' },
    { submitAction: 'save()' },
    { onSubmit() {} },
    { disabled: { state: 'blocked', mode: 'readWrite' } },
    { errors: { state: 'errors', mode: 'read' } },
    { children: [{ type: 'div' }] },
    { children: undefined },
  ]) {
    expect(schema.safeParse({ ...node, ...invalid }).success).toBe(false);
  }
});

it('owns a literal SubmitButton leaf without executable callbacks', () => {
  const node = { type: 'SubmitButton', label: 'Save' };
  expect(submitButtonNodeSchema.safeParse(node).success).toBe(true);
  expect(submitButtonNodeSchema.safeParse({ ...node, disabled: true }).success).toBe(
    true,
  );
  expect(submitButtonNodeSchema.safeParse({ ...node, onClick() {} }).success).toBe(
    false,
  );
});

it('declares only readonly boolean contracts for referenced form flags', async () => {
  const { formNodeBindings } = await import('./binding-contracts.js');
  expect(
    formNodeBindings({
      type: 'Form',
      label: 'Literal',
      submitAction: 'save',
      disabled: false,
      submitting: true,
      children: [],
    }),
  ).toEqual([]);
  const bindings = formNodeBindings({
    type: 'Form',
    label: 'Bound',
    submitAction: 'save',
    disabled: { state: 'blocked', mode: 'read' },
    submitting: { state: 'busy', mode: 'read' },
    children: [],
  });
  expect(
    bindings.map(({ property, mode, kinds }) => ({ property, mode, kinds })),
  ).toEqual([
    { property: 'disabled', mode: 'read', kinds: ['boolean'] },
    { property: 'submitting', mode: 'read', kinds: ['boolean'] },
  ]);
});
