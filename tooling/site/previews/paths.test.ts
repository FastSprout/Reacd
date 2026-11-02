import { expect, it } from 'vitest';
import { referenceSlug } from './paths.js';

it.each([
  ['Button', 'button'],
  ['VStack', 'v-stack'],
  ['ContentToc', 'content-toc'],
  ['PageCTA', 'page-cta'],
  ['Input2FA', 'input2-fa'],
])('preserves the public component route for %s', (name, expected) => {
  expect(referenceSlug(name)).toBe(expected);
});
