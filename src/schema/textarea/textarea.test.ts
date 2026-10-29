import { expect, it } from 'vitest';
import { textareaSchema, textareaValueSchema } from './textarea.schema.js';
import { textareaNodeSchema } from './generative.schema.js';

const base = { label: 'Notes', value: 'Draft', onValueChange() {} };

it('validates bounded logical rows, maximum length and editable short drafts', () => {
  expect(textareaSchema.safeParse(base).success).toBe(true);
  expect(
    textareaSchema.safeParse({
      ...base,
      value: '',
      minLength: 5,
      maxLength: 20,
      rows: 1,
      maxRows: 8,
      autoResize: true,
      readOnly: true,
      required: true,
      name: 'notes',
      description: 'Account notes',
      placeholder: 'Write notes',
    }).success,
  ).toBe(true);
  expect(textareaValueSchema().safeParse('Draft').success).toBe(true);
  expect(() => textareaValueSchema(-1)).toThrow();
  expect(textareaValueSchema(5).safeParse('12345').success).toBe(true);
  expect(textareaValueSchema(5).safeParse('123456').success).toBe(false);
  for (const invalid of [
    { minLength: -1 },
    { maxLength: 10001 },
    { minLength: 6, maxLength: 5 },
    { maxLength: 4 },
    { rows: 0 },
    { rows: 31 },
    { rows: 8, maxRows: 7 },
    { maxRows: 31 },
    { autoResize: 'true' },
    { onChange() {} },
    { className: 'native' },
    { defaultValue: 'Draft' },
    { value: null },
    { onValueChange: 'action' },
  ])
    expect(textareaSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
});

it('validates text bindings without imposing minimum length on draft state', () => {
  for (const mode of ['read', 'readWrite']) {
    const node = {
      type: 'Textarea',
      label: 'Notes',
      value: { state: 'notes', mode },
      minLength: 5,
      maxLength: 20,
    };
    expect(textareaNodeSchema.safeParse(node).success).toBe(true);
    expect(textareaNodeSchema.safeParse({ ...node, minLength: 21 }).success).toBe(
      false,
    );
    expect(
      textareaNodeSchema.safeParse({ ...node, rows: 10, maxRows: 2 }).success,
    ).toBe(false);
    expect(textareaNodeSchema.safeParse({ ...node, onValueChange() {} }).success).toBe(
      false,
    );
  }
});
