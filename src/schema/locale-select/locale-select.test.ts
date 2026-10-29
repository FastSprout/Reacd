import { expect, it } from 'vitest';
import { localeSelectSchema, localeValueSchema } from './locale-select.schema.js';

const locales = [
  { code: 'en-US', label: 'English' },
  { code: 'pl-PL', label: 'Polish' },
  { code: 'ar', label: 'Arabic' },
];
const properties = {
  label: 'Language',
  value: 'en-US',
  locales,
  onValueChange() {},
};

it('accepts canonical host language data and rejects ambiguous selections', () => {
  expect(localeSelectSchema.safeParse(properties).success).toBe(true);
  expect(localeValueSchema(locales).safeParse('pl-PL').success).toBe(true);
  expect(localeValueSchema(locales).safeParse('fr-FR').success).toBe(false);
  for (const change of [
    { value: 'en-us' },
    { value: 'fr-FR' },
    { locales: [] },
    { locales: [locales[0], locales[0]] },
    { locales: [{ code: 'en_US', label: 'English' }] },
    { locales: [{ code: 'en-US\n', label: 'English' }] },
    { locales: [{ code: 'en-US', label: '' }] },
    { locales: [{ code: '__proto__', label: 'Invalid' }] },
    { onValueChange: 'select' },
    { className: 'native' },
    { style: {} },
  ])
    expect(localeSelectSchema.safeParse({ ...properties, ...change }).success).toBe(
      false,
    );
});
