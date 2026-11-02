import { expect, it } from 'vitest';
import { textHeadingLevel } from './text-heading.js';

it('separates logical headings from visually prominent metrics', () => {
  expect(textHeadingLevel('headline', 1)).toBe(1);
  expect(textHeadingLevel('subheadline', 1)).toBe(2);
  expect(textHeadingLevel('headline', 4)).toBe(4);
  expect(textHeadingLevel('subheadline', 4)).toBe(4);
  for (const role of ['body', 'caption', 'display'] as const)
    expect(textHeadingLevel(role, 1)).toBeUndefined();
});
