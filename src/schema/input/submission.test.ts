import { expect, it } from 'vitest';
import { inputSubmissionMessage } from './submission.js';
it('validates required and minimum canonical host values', () => {
  expect(inputSubmissionMessage({ value: '' })).toBeUndefined();
  expect(inputSubmissionMessage({ value: '', required: true })).toBe('Enter a value.');
  expect(inputSubmissionMessage({ value: 'AB', minLength: 3 })).toBe(
    'Enter at least 3 characters.',
  );
  expect(inputSubmissionMessage({ value: 'ABC', minLength: 3 })).toBeUndefined();
  expect(inputSubmissionMessage({ value: 'Text' })).toBeUndefined();
});
it('validates complete email host values while allowing empty optional values', () => {
  expect(inputSubmissionMessage({ value: 'draft', inputType: 'email' })).toBe(
    'Enter a valid email address.',
  );
  expect(
    inputSubmissionMessage({ value: 'owner@example.com', inputType: 'email' }),
  ).toBeUndefined();
  expect(inputSubmissionMessage({ value: '', inputType: 'email' })).toBeUndefined();
});
