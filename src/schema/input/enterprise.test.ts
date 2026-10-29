import { expect, it } from 'vitest';
import { inputComponentSchema } from './input.schema.js';
import { inputNodeSchema } from './generative.schema.js';
import { inputValueSchema } from './value.schema.js';

const base = { label: 'Email', value: 'draft', onValueChange() {} };

it('validates bounded editable input and closed autofill intents', () => {
  expect(
    inputComponentSchema.safeParse({
      ...base,
      description: 'Sign-in email',
      name: 'email',
      readOnly: true,
      loading: false,
      minLength: 8,
      maxLength: 20,
      autoComplete: 'email',
      inputType: 'email',
    }).success,
  ).toBe(true);
  for (const invalid of [
    { minLength: -1 },
    { maxLength: 10001 },
    { minLength: 8, maxLength: 7 },
    { maxLength: 4 },
    { autoComplete: 'arbitrary' },
    { inputType: 'number' },
    { onInput() {} },
    { style: {} },
    { defaultValue: 'x' },
  ]) {
    expect(inputComponentSchema.safeParse({ ...base, ...invalid }).success).toBe(false);
  }
  expect(inputValueSchema().safeParse('text').success).toBe(true);
  expect(inputValueSchema(2).safeParse('xx').success).toBe(true);
  expect(inputValueSchema(2).safeParse('xxx').success).toBe(false);
  expect(() => inputValueSchema(-1)).toThrow();
});

it('owns read/readWrite transport for editable drafts', () => {
  const node = {
    type: 'Input',
    label: 'Email',
    inputType: 'email',
    minLength: 8,
    value: { state: 'email', mode: 'read' },
  };
  expect(inputNodeSchema.safeParse(node).success).toBe(true);
  expect(
    inputNodeSchema.safeParse({
      ...node,
      value: {
        state: 'email',
        mode: 'readWrite',
      },
    }).success,
  ).toBe(true);
  expect(inputNodeSchema.safeParse({ ...node, maxLength: 7 }).success).toBe(false);
  expect(inputNodeSchema.safeParse({ ...node, onValueChange() {} }).success).toBe(
    false,
  );
});

it('rejects normalization mismatches and permits email drafts', () => {
  for (const value of ['first\nsecond', 'first\rsecond']) {
    expect(inputComponentSchema.safeParse({ ...base, value }).success).toBe(false);
    expect(inputValueSchema().safeParse(value).success).toBe(false);
  }
  for (const value of [' owner@example.com', 'owner@example.com ', '\temail']) {
    expect(
      inputComponentSchema.safeParse({ ...base, inputType: 'email', value }).success,
    ).toBe(false);
    expect(inputValueSchema(100, 'email').safeParse(value).success).toBe(false);
  }
  expect(inputValueSchema(100, 'email').safeParse('incomplete').success).toBe(true);
  expect(inputValueSchema(100, 'email').safeParse('').success).toBe(true);
});
