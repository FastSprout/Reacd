import { createElement } from 'react';
import { z } from 'zod';
import { expect, it } from 'vitest';
import { Textarea } from '../../components/textarea/index.js';
import { formFieldSchema } from './form-field.schema.js';
import { createFormFieldNodeSchema } from './generative.schema.js';

it('accepts safe field metadata and rejects native markup or callback escapes', () => {
  const child = <Textarea label="Notes" value="" onValueChange={() => undefined} />;
  const base = { name: 'notes', children: child };
  expect(formFieldSchema.safeParse(base).success).toBe(true);
  expect(
    formFieldSchema.safeParse({
      ...base,
      label: 'Notes',
      description: 'Details',
      hint: 'Required',
      help: 'Write a summary',
      error: 'Check notes',
      required: true,
      disabled: true,
    }).success,
  ).toBe(true);
  expect(formFieldSchema.safeParse({ ...base, error: '' }).success).toBe(true);
  for (const invalid of [
    { name: '' },
    { name: 'bad key' },
    { label: '' },
    { error: true },
    { children: undefined },
    { children: createElement('input') },
    { htmlFor: 'input' },
    { className: 'native' },
    { onBlur() {} },
  ])
    expect(formFieldSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
});

it('exports recursive child contracts with literal or read-only error state', () => {
  const schema = createFormFieldNodeSchema(z.strictObject({ type: z.literal('Text') }));
  const node = {
    type: 'FormField',
    name: 'notes',
    children: [{ type: 'Text' }],
    error: { state: 'notes.error', mode: 'read' },
  };
  expect(schema.safeParse(node).success).toBe(true);
  expect(schema.safeParse({ ...node, error: '' }).success).toBe(true);
  expect(
    schema.safeParse({ ...node, error: { state: 'notes.error', mode: 'readWrite' } })
      .success,
  ).toBe(false);
  expect(schema.safeParse({ ...node, children: [{ type: 'div' }] }).success).toBe(
    false,
  );
});
